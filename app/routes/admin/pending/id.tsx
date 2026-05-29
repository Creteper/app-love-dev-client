import * as React from "react"
import { Link, Navigate, useParams } from "react-router"
import { motion } from "motion/react"
import {
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  Eye,
  Inbox,
  Mail,
  Pencil,
  Sparkles,
  Wallet,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import { useAdminSidebarNav } from "~/components/page-kits/admin/sidebar-nav-context"
import {
  assignedClients,
  pendingThreads,
  type PendingMessage,
  type PendingSpec,
} from "~/components/page-kits/admin/data"
import {
  InvoiceDialog,
  InvoiceMiniCard,
} from "~/components/page-kits/dashboard/chats/invoice"
import { CsPendingChat } from "~/components/page-kits/admin/cs-pending-chat"
import { CsSpecEditor } from "~/components/page-kits/admin/cs-spec-editor"
import { cn } from "~/lib/utils"
import type { Route } from "./+types/id"

export function meta({ params }: Route.MetaArgs) {
  const it = assignedClients.find((a) => a.id === params.id)
  return [
    { title: it ? `爱开发 - ${it.client}` : "爱开发 - 待对接客户" },
  ]
}

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
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

  const [thread, setThread] = React.useState<PendingMessage[]>(() =>
    client ? pendingThreads[client.id] ?? [] : []
  )
  const [confirmedSpec, setConfirmedSpec] = React.useState<PendingSpec | null>(
    null
  )
  const [viewAi, setViewAi] = React.useState(false)
  const [viewConfirmed, setViewConfirmed] = React.useState(false)
  const [editorOpen, setEditorOpen] = React.useState(false)

  if (!client) {
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
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
        </motion.div>
      </main>
    )
  }

  function handleSendText(text: string) {
    if (!client) return
    const cid = client.id
    setThread((prev) => [
      ...prev,
      {
        id: `${cid}-cs-${prev.length + 1}-${Date.now()}`,
        author: "cs",
        time: nowTime(),
        text,
      },
    ])
  }

  function handleConfirm(spec: PendingSpec) {
    setConfirmedSpec(spec)
    setEditorOpen(false)
  }

  return (
    <main className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
      <Link
        to="/admin/pending"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回待对接列表
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm md:p-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-tight">
            {client.client}
          </h1>
          <span className="text-[11px] text-muted-foreground">
            {client.assignedAt}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{client.intent}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="size-3" />
            {client.channel}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1">
            <Mail className="size-3" />
            {client.contactEmail}
          </span>
          {confirmedSpec ? (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                已发送终版
              </span>
            </>
          ) : null}
        </div>
      </motion.section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
          <CsPendingChat
            client={client}
            csName={user.name}
            initialMessages={thread}
            confirmedSpec={confirmedSpec ?? undefined}
            onSendText={handleSendText}
          />
        </div>

        <aside className="flex flex-col gap-4">
          <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                AI 生成的需求初稿
              </h2>
              <button
                type="button"
                onClick={() => setViewAi(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Eye className="size-3" />
                查看完整
              </button>
            </header>
            <SpecMini spec={client.aiSpec} />
          </section>

          {confirmedSpec ? (
            <section className="flex flex-col gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4 backdrop-blur-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <header className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-emerald-800 dark:text-emerald-200">
                  我已发送的终版
                </h2>
                <button
                  type="button"
                  onClick={() => setViewConfirmed(true)}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-300"
                >
                  <Eye className="size-3" />
                  查看完整
                </button>
              </header>
              <SpecMini spec={confirmedSpec} variant="confirmed" />
            </section>
          ) : (
            <Button
              size="lg"
              onClick={() => setEditorOpen(true)}
              className="w-full"
            >
              <Pencil className="size-4" />
              修改并发送终版
            </Button>
          )}

          {confirmedSpec ? (
            <Button
              variant="outline"
              onClick={() => setEditorOpen(true)}
              className="w-full"
            >
              <Pencil className="size-4" />
              再次修改
            </Button>
          ) : null}
        </aside>
      </div>

      <InvoiceDialog
        open={viewAi}
        onOpenChange={setViewAi}
        spec={client.aiSpec}
        variant="ai"
        onConfirm={() => {
          setViewAi(false)
          setEditorOpen(true)
        }}
      />
      {confirmedSpec ? (
        <InvoiceDialog
          open={viewConfirmed}
          onOpenChange={setViewConfirmed}
          spec={confirmedSpec}
          variant="cs"
          onConfirm={() => setViewConfirmed(false)}
        />
      ) : null}

      <CsSpecEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initial={confirmedSpec ?? client.aiSpec}
        onConfirm={handleConfirm}
      />
    </main>
  )
}

function SpecMini({
  spec,
  variant = "ai",
}: {
  spec: PendingSpec
  variant?: "ai" | "confirmed"
}) {
  return (
    <InvoiceMiniCard
      className={cn(variant === "confirmed" && "[&_.invoice-accent]:text-emerald-700")}
    >
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-primary">
          {variant === "confirmed" ? "Love · 客服终版" : "Love · AI 初稿"}
        </span>
        <h3 className="truncate text-sm font-semibold text-foreground">
          {spec.projectName}
        </h3>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2.5">
          <Stat
            icon={<Wallet className="size-3" />}
            label={variant === "confirmed" ? "最终价" : "预估价"}
            value={spec.estimatedPrice}
          />
          <Stat
            icon={<CalendarRange className="size-3" />}
            label="工期"
            value={spec.estimatedDuration}
          />
          <Stat icon={null} label="等级" value={`${spec.level} 级`} />
        </div>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {spec.requirementsMd
            .replace(/^#[^\n]*\n/, "")
            .replace(/^##[^\n]*\n/g, "")
            .replace(/[*`]/g, "")
            .trim()}
        </p>
      </div>
    </InvoiceMiniCard>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-xs font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </span>
    </div>
  )
}
