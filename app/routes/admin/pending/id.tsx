import * as React from "react"
import { Link, Navigate, useParams } from "react-router"
import { motion } from "motion/react"
import {
  ArrowLeft,
  Building2,
  CalendarRange,
  Eye,
  Inbox,
  Mail,
  Phone,
  Plus,
  SendHorizonal,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import { useAdminSidebarNav } from "~/components/page-kits/admin/sidebar-nav-context"
import {
  assignedClients,
  pendingThreads,
  type AssignedClient,
  type DevLevel,
  type PendingPhase,
  type PendingSpec,
} from "~/components/page-kits/admin/data"
import {
  AVATAR_BY_ROLE,
} from "~/components/page-kits/dashboard/messages/data"
import {
  type MessageItem,
  type SpecPayload,
} from "~/components/page-kits/dashboard/messages"
import { InvoiceDialog } from "~/components/page-kits/dashboard/chats/invoice"
import type { ProjectSpec } from "~/components/page-kits/dashboard/chats/data"
import { CsPendingChat } from "~/components/page-kits/admin/cs-pending-chat"
import { cn } from "~/lib/utils"
import type { Route } from "./+types/id"

export function meta({ params }: Route.MetaArgs) {
  const it = assignedClients.find((a) => a.id === params.id)
  return [{ title: it ? `爱开发 - ${it.client}` : "爱开发 - 待对接客户" }]
}

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

function seedMessages(client: AssignedClient, csName: string): MessageItem[] {
  const thread = pendingThreads[client.id] ?? []
  return thread.map((m) => {
    if (m.author === "cs") {
      return {
        id: m.id,
        authorName: csName,
        authorRole: "cs",
        authorInitial: "客",
        authorAvatar: AVATAR_BY_ROLE.cs,
        authorTint: "blue",
        time: m.time,
        content: { kind: "text", text: m.text },
      }
    }
    return {
      id: m.id,
      authorName: client.contactName,
      authorRole: "client",
      authorInitial: client.contactName.slice(0, 1) || "客",
      authorAvatar: AVATAR_BY_ROLE.client,
      authorTint: "violet",
      time: m.time,
      content: { kind: "text", text: m.text },
    }
  })
}

function clonePhases(phases: PendingPhase[]): PendingPhase[] {
  return phases.map((p) => ({ ...p, items: [...p.items] }))
}

function cloneSpec(s: PendingSpec): PendingSpec {
  return {
    ...s,
    phasesPrimary: clonePhases(s.phasesPrimary),
    phasesSecondary: clonePhases(s.phasesSecondary),
  }
}

function pendingToSpecPayload(s: PendingSpec): SpecPayload {
  // PendingSpec is structurally compatible with SpecPayload.
  return cloneSpec(s) as SpecPayload
}

export default function AdminPendingDetail() {
  const { id } = useParams()
  const { user } = useAdminAuth()
  const { setSubItem } = useAdminSidebarNav()

  if (user?.role !== "cs") {
    return <Navigate to="/admin" replace />
  }

  const client = assignedClients.find((a) => a.id === id)

  React.useEffect(() => {
    if (client) setSubItem(client.client)
  }, [client?.id, client?.client, setSubItem])

  // All hooks are declared above the early-return below so order stays stable.
  const csName = user.name
  const [messages, setMessages] = React.useState<MessageItem[]>(() =>
    client ? seedMessages(client, csName) : []
  )
  const [draft, setDraft] = React.useState<PendingSpec>(() =>
    client ? cloneSpec(client.aiSpec) : ({} as PendingSpec)
  )
  const [confirmed, setConfirmed] = React.useState(false)
  const [viewAi, setViewAi] = React.useState(false)

  React.useEffect(() => {
    if (!client) return
    setMessages(seedMessages(client, csName))
    setDraft(cloneSpec(client.aiSpec))
    setConfirmed(false)
  }, [client?.id, csName])

  if (!client) {
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <Inbox className="size-5" />
          </div>
          <div className="text-sm font-medium">未找到该待对接客户</div>
          <Link
            to="/admin/pending"
            className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all hover:scale-[1.03]"
          >
            返回列表
          </Link>
        </div>
      </main>
    )
  }

  function handleSendText(text: string) {
    const cid = client!.id
    setMessages((prev) => [
      ...prev,
      {
        id: `${cid}-cs-text-${prev.length + 1}-${Date.now()}`,
        authorName: csName,
        authorRole: "cs",
        authorInitial: "客",
        authorAvatar: AVATAR_BY_ROLE.cs,
        authorTint: "blue",
        time: nowTime(),
        content: { kind: "text", text },
      },
    ])
  }

  function handleSendConfirmedSpec() {
    if (!isValid(draft)) return
    const cid = client!.id
    const payload = pendingToSpecPayload(draft)
    setMessages((prev) => [
      ...prev,
      {
        id: `${cid}-cs-spec-${prev.length + 1}-${Date.now()}`,
        authorName: csName,
        authorRole: "cs",
        authorInitial: "客",
        authorAvatar: AVATAR_BY_ROLE.cs,
        authorTint: "blue",
        time: nowTime(),
        content: { kind: "spec-card", spec: payload, variant: "cs" },
      },
    ])
    setConfirmed(true)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Slim header bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-border/60 bg-card/40 px-4 py-2 backdrop-blur md:px-6">
        <Link
          to="/admin/pending"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          返回
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="truncate text-sm font-medium tracking-tight">
          {client.client}
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span className="text-xs text-muted-foreground">
          {client.contactName}
        </span>
        {confirmed ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="size-3" />
            已发送终版
          </span>
        ) : null}
      </header>

      {/* Left chat / Right info+editor */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-0 flex-1 flex-col border-r border-border/60">
          <CsPendingChat messages={messages} onSendText={handleSendText} />
        </section>

        <aside className="flex w-full shrink-0 flex-col border-t border-border/60 bg-background lg:w-[420px] lg:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-4"
            >
              <ClientInfo client={client} />

              <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-primary">
                      AI 初稿 · 可编辑
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewAi(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Eye className="size-3" />
                    查看 AI 完整
                  </button>
                </header>

                <SpecForm draft={draft} onChange={setDraft} />
              </section>
            </motion.div>
          </div>

          {/* Sticky bottom action */}
          <div className="shrink-0 border-t border-border/60 bg-card/60 px-4 py-3 backdrop-blur md:px-5">
            <Button
              size="lg"
              onClick={handleSendConfirmedSpec}
              disabled={!isValid(draft)}
              className="w-full"
            >
              <SendHorizonal className="size-4" />
              {confirmed ? "再次发送终版" : "发送终版"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              发送后客户会在聊天里收到一张终版发票卡片
            </p>
          </div>
        </aside>
      </div>

      <InvoiceDialog
        open={viewAi}
        onOpenChange={setViewAi}
        spec={client.aiSpec as unknown as ProjectSpec}
        variant="ai"
        onConfirm={() => setViewAi(false)}
      />
    </div>
  )
}

function isValid(s: PendingSpec): boolean {
  return (
    s.projectName.trim().length > 0 &&
    s.estimatedPrice.trim().length > 0 &&
    s.estimatedDuration.trim().length > 0
  )
}

// ---------- Client info ----------

function ClientInfo({ client }: { client: AssignedClient }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
      <header className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-4.5" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold tracking-tight">
            {client.client}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {client.contactName} · {client.assignedAt}
          </span>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2">
        <InfoRow icon={<Phone className="size-3.5" />} label="手机" value={client.phone} />
        <InfoRow icon={<Mail className="size-3.5" />} label="邮箱" value={client.contactEmail} />
      </div>
      <p className="rounded-xl bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
        客户在 AI 入口表达了：{client.intent}
      </p>
    </section>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <span className="w-10 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="truncate text-foreground">{value}</span>
    </div>
  )
}

// ---------- Inline spec form ----------

function SpecForm({
  draft,
  onChange,
}: {
  draft: PendingSpec
  onChange: (next: PendingSpec) => void
}) {
  function patch(p: Partial<PendingSpec>) {
    onChange({ ...draft, ...p })
  }

  function patchPhase(
    section: "phasesPrimary" | "phasesSecondary",
    index: number,
    patchVal: Partial<PendingPhase>
  ) {
    onChange({
      ...draft,
      [section]: draft[section].map((p, i) =>
        i === index ? { ...p, ...patchVal } : p
      ),
    })
  }
  function addPhase(section: "phasesPrimary" | "phasesSecondary") {
    onChange({
      ...draft,
      [section]: [...draft[section], { label: "新阶段", range: "", items: [] }],
    })
  }
  function removePhase(section: "phasesPrimary" | "phasesSecondary", index: number) {
    onChange({
      ...draft,
      [section]: draft[section].filter((_, i) => i !== index),
    })
  }
  function patchPhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number,
    itemIdx: number,
    next: string
  ) {
    onChange({
      ...draft,
      [section]: draft[section].map((p, i) =>
        i === phaseIdx
          ? { ...p, items: p.items.map((it, j) => (j === itemIdx ? next : it)) }
          : p
      ),
    })
  }
  function addPhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number
  ) {
    onChange({
      ...draft,
      [section]: draft[section].map((p, i) =>
        i === phaseIdx ? { ...p, items: [...p.items, ""] } : p
      ),
    })
  }
  function removePhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number,
    itemIdx: number
  ) {
    onChange({
      ...draft,
      [section]: draft[section].map((p, i) =>
        i === phaseIdx
          ? { ...p, items: p.items.filter((_, j) => j !== itemIdx) }
          : p
      ),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <Field label="项目名">
        <Input
          value={draft.projectName}
          onChange={(e) => patch({ projectName: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="最终价" icon={<Wallet className="size-3" />}>
          <Input
            value={draft.estimatedPrice}
            onChange={(e) => patch({ estimatedPrice: e.target.value })}
            placeholder="¥ 12,000"
          />
        </Field>
        <Field label="确认工期" icon={<CalendarRange className="size-3" />}>
          <Input
            value={draft.estimatedDuration}
            onChange={(e) => patch({ estimatedDuration: e.target.value })}
            placeholder="30 天"
          />
        </Field>
      </div>

      <Field label="项目等级">
        <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
          {(["A", "B", "C"] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => patch({ level: lv as DevLevel })}
              className={cn(
                "flex-1 rounded-md py-1 text-xs font-medium transition-all",
                draft.level === lv
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {lv} 级
            </button>
          ))}
        </div>
      </Field>

      <Field label="价格区间">
        <Input
          value={draft.budget}
          onChange={(e) => patch({ budget: e.target.value })}
          placeholder="¥ 8,000 – 14,000"
        />
      </Field>

      <Field label="需求说明（Markdown）">
        <textarea
          value={draft.requirementsMd}
          onChange={(e) => patch({ requirementsMd: e.target.value })}
          rows={8}
          className="min-h-32 w-full resize-y rounded-lg border border-border/50 bg-background px-3 py-2 font-mono text-[12px] leading-relaxed placeholder:text-muted-foreground focus:border-border focus:outline-none"
        />
      </Field>

      <PhasesEditor
        title="开发阶段"
        phases={draft.phasesPrimary}
        onAdd={() => addPhase("phasesPrimary")}
        onPatch={(i, p) => patchPhase("phasesPrimary", i, p)}
        onRemove={(i) => removePhase("phasesPrimary", i)}
        onPatchItem={(pi, ii, v) => patchPhaseItem("phasesPrimary", pi, ii, v)}
        onAddItem={(pi) => addPhaseItem("phasesPrimary", pi)}
        onRemoveItem={(pi, ii) => removePhaseItem("phasesPrimary", pi, ii)}
      />

      <PhasesEditor
        title="付款里程碑"
        phases={draft.phasesSecondary}
        onAdd={() => addPhase("phasesSecondary")}
        onPatch={(i, p) => patchPhase("phasesSecondary", i, p)}
        onRemove={(i) => removePhase("phasesSecondary", i)}
        onPatchItem={(pi, ii, v) =>
          patchPhaseItem("phasesSecondary", pi, ii, v)
        }
        onAddItem={(pi) => addPhaseItem("phasesSecondary", pi)}
        onRemoveItem={(pi, ii) =>
          removePhaseItem("phasesSecondary", pi, ii)
        }
      />
    </div>
  )
}

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}

function PhasesEditor({
  title,
  phases,
  onAdd,
  onPatch,
  onRemove,
  onPatchItem,
  onAddItem,
  onRemoveItem,
}: {
  title: string
  phases: PendingPhase[]
  onAdd: () => void
  onPatch: (i: number, p: Partial<PendingPhase>) => void
  onRemove: (i: number) => void
  onPatchItem: (phaseIdx: number, itemIdx: number, next: string) => void
  onAddItem: (phaseIdx: number) => void
  onRemoveItem: (phaseIdx: number, itemIdx: number) => void
}) {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-3" />
          阶段
        </button>
      </header>

      <ol className="flex flex-col gap-2">
        {phases.map((p, pi) => (
          <li
            key={pi}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-3"
          >
            <div className="flex items-center gap-2">
              <Input
                value={p.label}
                onChange={(e) => onPatch(pi, { label: e.target.value })}
                placeholder="阶段名"
                className="h-7 flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => onRemove(pi)}
                aria-label="删除阶段"
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
            <Input
              value={p.range}
              onChange={(e) => onPatch(pi, { range: e.target.value })}
              placeholder="时间 / 触发条件"
              className="h-7 text-xs"
            />
            <ul className="flex flex-col gap-1">
              {p.items.map((it, ii) => (
                <li key={ii} className="flex items-center gap-1.5">
                  <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  <Input
                    value={it}
                    onChange={(e) => onPatchItem(pi, ii, e.target.value)}
                    placeholder="交付项"
                    className="h-6 flex-1 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(pi, ii)}
                    aria-label="删除"
                    className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </li>
              ))}
              <button
                type="button"
                onClick={() => onAddItem(pi)}
                className="inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-2.5" />
                交付项
              </button>
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
