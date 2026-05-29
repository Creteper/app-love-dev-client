import * as React from "react"
import { motion } from "motion/react"
import { Navigate } from "react-router"
import {
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import {
  clientAccounts,
  csAccounts,
  devAccounts,
  formatCNY,
  type ClientAccount,
  type CsAccount,
  type DevAccount,
  type DevLevel,
} from "~/components/page-kits/admin/data"
import { cn } from "~/lib/utils"

export function meta() {
  return [{ title: "爱开发 - 后台用户" }]
}

type UserTab = "客户" | "开发者" | "客服"

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`

const todayLabel = () => new Date().toISOString().slice(0, 10)

type StatusValue = "active" | "suspended"

type AccountDraft = {
  id?: string
  name: string
  email: string
  status: StatusValue
  // dev-only
  level?: DevLevel
  skills?: string
  // client-only
  creditScore?: number
}

type DialogState =
  | { kind: "closed" }
  | { kind: "create"; tab: UserTab; draft: AccountDraft }
  | {
      kind: "edit"
      tab: UserTab
      draft: AccountDraft
      originalId: string
    }
  | {
      kind: "delete"
      tab: UserTab
      id: string
      name: string
    }

function blankDraft(tab: UserTab): AccountDraft {
  if (tab === "开发者") {
    return { name: "", email: "", status: "active", level: "C", skills: "" }
  }
  if (tab === "客户") {
    return { name: "", email: "", status: "active", creditScore: 650 }
  }
  return { name: "", email: "", status: "active" }
}

export default function AdminUsers() {
  const { user } = useAdminAuth()
  if (user?.role !== "admin") {
    return <Navigate to="/admin" replace />
  }

  const [tab, setTab] = React.useState<UserTab>("客户")
  const [query, setQuery] = React.useState("")
  const [clients, setClients] = React.useState<ClientAccount[]>(clientAccounts)
  const [devs, setDevs] = React.useState<DevAccount[]>(devAccounts)
  const [css, setCss] = React.useState<CsAccount[]>(csAccounts)
  const [dialog, setDialog] = React.useState<DialogState>({ kind: "closed" })

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const test = (s: string) => !q || s.toLowerCase().includes(q)
    if (tab === "客户") return clients.filter((c) => test(c.name) || test(c.email))
    if (tab === "开发者")
      return devs.filter(
        (d) => test(d.name) || test(d.email) || d.skills.some(test)
      )
    return css.filter((c) => test(c.name) || test(c.email))
  }, [tab, query, clients, devs, css])

  const counts = {
    客户: clients.length,
    开发者: devs.length,
    客服: css.length,
  }

  function openCreate(t: UserTab) {
    setDialog({ kind: "create", tab: t, draft: blankDraft(t) })
  }

  function openEdit(t: UserTab, id: string) {
    const src =
      t === "客户"
        ? clients.find((x) => x.id === id)
        : t === "开发者"
          ? devs.find((x) => x.id === id)
          : css.find((x) => x.id === id)
    if (!src) return
    const base: AccountDraft = {
      id: src.id,
      name: src.name,
      email: src.email,
      status: src.status,
    }
    if (t === "开发者") {
      const d = src as DevAccount
      base.level = d.level
      base.skills = d.skills.join(", ")
    } else if (t === "客户") {
      const c = src as ClientAccount
      base.creditScore = c.creditScore
    }
    setDialog({ kind: "edit", tab: t, draft: base, originalId: id })
  }

  function openDelete(t: UserTab, id: string, name: string) {
    setDialog({ kind: "delete", tab: t, id, name })
  }

  function closeDialog() {
    setDialog({ kind: "closed" })
  }

  function applyCreate(t: UserTab, d: AccountDraft) {
    if (t === "客户") {
      const next: ClientAccount = {
        id: uid("cli"),
        name: d.name.trim(),
        email: d.email.trim(),
        status: d.status,
        registeredAt: todayLabel(),
        creditScore: d.creditScore ?? 650,
        projectsCount: 0,
        totalSpent: 0,
      }
      setClients((prev) => [next, ...prev])
    } else if (t === "开发者") {
      const next: DevAccount = {
        id: uid("dev"),
        name: d.name.trim(),
        email: d.email.trim(),
        status: d.status,
        registeredAt: todayLabel(),
        level: d.level ?? "C",
        finishedOrders: 0,
        rating: 5.0,
        skills: (d.skills ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }
      setDevs((prev) => [next, ...prev])
    } else {
      const next: CsAccount = {
        id: uid("cs"),
        name: d.name.trim(),
        email: d.email.trim(),
        status: d.status,
        registeredAt: todayLabel(),
        responsibleCount: 0,
        pendingAssignments: 0,
      }
      setCss((prev) => [next, ...prev])
    }
    closeDialog()
  }

  function applyEdit(t: UserTab, d: AccountDraft, originalId: string) {
    if (t === "客户") {
      setClients((prev) =>
        prev.map((c) =>
          c.id === originalId
            ? {
                ...c,
                name: d.name.trim(),
                email: d.email.trim(),
                status: d.status,
                creditScore: d.creditScore ?? c.creditScore,
              }
            : c
        )
      )
    } else if (t === "开发者") {
      setDevs((prev) =>
        prev.map((x) =>
          x.id === originalId
            ? {
                ...x,
                name: d.name.trim(),
                email: d.email.trim(),
                status: d.status,
                level: d.level ?? x.level,
                skills: (d.skills ?? "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : x
        )
      )
    } else {
      setCss((prev) =>
        prev.map((x) =>
          x.id === originalId
            ? {
                ...x,
                name: d.name.trim(),
                email: d.email.trim(),
                status: d.status,
              }
            : x
        )
      )
    }
    closeDialog()
  }

  function applyDelete(t: UserTab, id: string) {
    if (t === "客户") setClients((prev) => prev.filter((x) => x.id !== id))
    else if (t === "开发者") setDevs((prev) => prev.filter((x) => x.id !== id))
    else setCss((prev) => prev.filter((x) => x.id !== id))
    closeDialog()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:gap-6 md:p-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          用户与账号
        </h1>
        <p className="text-sm text-muted-foreground">
          管理 客户 / 开发者 / 客服 三类账号 · 支持增删改查与停用。
        </p>
      </motion.section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
          {(["客户", "开发者", "客服"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{t}</span>
              <span className="tabular-nums text-muted-foreground/80">
                {counts[t]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative ml-auto flex-1 md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`搜索 ${tab} · 姓名 / 邮箱…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>

        <Button onClick={() => openCreate(tab)} className="shrink-0">
          <Plus className="size-4" />
          新建{tab}
        </Button>
      </div>

      {tab === "客户" && (
        <ClientsTable
          items={filtered as ClientAccount[]}
          onEdit={(id) => openEdit(tab, id)}
          onDelete={(id, name) => openDelete(tab, id, name)}
        />
      )}
      {tab === "开发者" && (
        <DevsTable
          items={filtered as DevAccount[]}
          onEdit={(id) => openEdit(tab, id)}
          onDelete={(id, name) => openDelete(tab, id, name)}
        />
      )}
      {tab === "客服" && (
        <CsTable
          items={filtered as CsAccount[]}
          onEdit={(id) => openEdit(tab, id)}
          onDelete={(id, name) => openDelete(tab, id, name)}
        />
      )}

      <AccountFormDialog
        state={dialog}
        onClose={closeDialog}
        onCreate={applyCreate}
        onEdit={applyEdit}
      />
      <DeleteDialog state={dialog} onClose={closeDialog} onDelete={applyDelete} />
    </main>
  )
}

// ---------- Tables ----------

function Table({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              {headers.map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </motion.div>
  )
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>
}

function StatusPill({ status }: { status: StatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        status === "active"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      )}
    >
      {status === "active" ? (
        "正常"
      ) : (
        <>
          <ShieldAlert className="size-3" /> 已停用
        </>
      )}
    </span>
  )
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onEdit}
        aria-label="编辑"
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Pencil className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="删除"
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr className="border-t border-border/40">
      <td
        colSpan={colSpan}
        className="px-4 py-6 text-center text-xs text-muted-foreground"
      >
        {label}
      </td>
    </tr>
  )
}

function ClientsTable({
  items,
  onEdit,
  onDelete,
}: {
  items: ClientAccount[]
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}) {
  if (!items.length) {
    return (
      <Table headers={["客户", "信誉分", "项目数", "累计投入", "状态", "操作"]}>
        <EmptyRow colSpan={6} label="没有匹配的客户" />
      </Table>
    )
  }
  return (
    <Table headers={["客户", "信誉分", "项目数", "累计投入", "状态", "操作"]}>
      {items.map((c) => (
        <tr key={c.id} className="border-t border-border/40">
          <Td>
            <div className="flex flex-col">
              <span className="font-medium tracking-tight">{c.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {c.email}
              </span>
            </div>
          </Td>
          <Td>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
                c.creditScore >= 650
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              )}
            >
              {c.creditScore}
            </span>
          </Td>
          <Td className="tabular-nums">{c.projectsCount}</Td>
          <Td className="tabular-nums">¥ {formatCNY(c.totalSpent)}</Td>
          <Td>
            <StatusPill status={c.status} />
          </Td>
          <Td className="text-right">
            <RowActions
              onEdit={() => onEdit(c.id)}
              onDelete={() => onDelete(c.id, c.name)}
            />
          </Td>
        </tr>
      ))}
    </Table>
  )
}

function DevsTable({
  items,
  onEdit,
  onDelete,
}: {
  items: DevAccount[]
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}) {
  if (!items.length) {
    return (
      <Table headers={["开发者", "等级", "完单", "评分", "技能", "状态", "操作"]}>
        <EmptyRow colSpan={7} label="没有匹配的开发者" />
      </Table>
    )
  }
  return (
    <Table headers={["开发者", "等级", "完单", "评分", "技能", "状态", "操作"]}>
      {items.map((d) => (
        <tr key={d.id} className="border-t border-border/40">
          <Td>
            <div className="flex flex-col">
              <span className="font-medium tracking-tight">{d.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {d.email}
              </span>
            </div>
          </Td>
          <Td>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              {d.level} 级
            </span>
          </Td>
          <Td className="tabular-nums">{d.finishedOrders}</Td>
          <Td className="tabular-nums">★ {d.rating}</Td>
          <Td>
            <div className="flex flex-wrap gap-1">
              {d.skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </Td>
          <Td>
            <StatusPill status={d.status} />
          </Td>
          <Td className="text-right">
            <RowActions
              onEdit={() => onEdit(d.id)}
              onDelete={() => onDelete(d.id, d.name)}
            />
          </Td>
        </tr>
      ))}
    </Table>
  )
}

function CsTable({
  items,
  onEdit,
  onDelete,
}: {
  items: CsAccount[]
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}) {
  if (!items.length) {
    return (
      <Table headers={["客服", "负责项目", "待对接", "入职", "状态", "操作"]}>
        <EmptyRow colSpan={6} label="没有匹配的客服" />
      </Table>
    )
  }
  return (
    <Table headers={["客服", "负责项目", "待对接", "入职", "状态", "操作"]}>
      {items.map((c) => (
        <tr key={c.id} className="border-t border-border/40">
          <Td>
            <div className="flex flex-col">
              <span className="font-medium tracking-tight">{c.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {c.email}
              </span>
            </div>
          </Td>
          <Td className="tabular-nums">{c.responsibleCount}</Td>
          <Td className="tabular-nums">{c.pendingAssignments}</Td>
          <Td className="text-muted-foreground">{c.registeredAt}</Td>
          <Td>
            <StatusPill status={c.status} />
          </Td>
          <Td className="text-right">
            <RowActions
              onEdit={() => onEdit(c.id)}
              onDelete={() => onDelete(c.id, c.name)}
            />
          </Td>
        </tr>
      ))}
    </Table>
  )
}

// ---------- Dialogs ----------

function AccountFormDialog({
  state,
  onClose,
  onCreate,
  onEdit,
}: {
  state: DialogState
  onClose: () => void
  onCreate: (tab: UserTab, draft: AccountDraft) => void
  onEdit: (tab: UserTab, draft: AccountDraft, originalId: string) => void
}) {
  const open = state.kind === "create" || state.kind === "edit"
  const [draft, setDraft] = React.useState<AccountDraft>(blankDraft("客户"))
  const tab: UserTab =
    state.kind === "create" || state.kind === "edit" ? state.tab : "客户"

  React.useEffect(() => {
    if (state.kind === "create" || state.kind === "edit") {
      setDraft(state.draft)
    }
  }, [state])

  const valid =
    draft.name.trim().length > 0 && /.+@.+\..+/.test(draft.email.trim())

  function submit() {
    if (!valid) return
    if (state.kind === "create") onCreate(state.tab, draft)
    else if (state.kind === "edit") onEdit(state.tab, draft, state.originalId)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {state.kind === "edit" ? `编辑${tab}` : `新建${tab}`}
          </DialogTitle>
          <DialogDescription>
            修改账号资料后保存即可生效，所有操作会写入审计日志。
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              姓名
            </label>
            <Input
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
              placeholder={tab === "客户" ? "例：上海·萌爪科技" : "例：客服·小张"}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              邮箱
            </label>
            <Input
              type="email"
              value={draft.email}
              onChange={(e) =>
                setDraft((d) => ({ ...d, email: e.target.value }))
              }
              placeholder="someone@example.com"
            />
          </div>

          {tab === "开发者" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  等级
                </label>
                <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
                  {(["A", "B", "C"] as const).map((lv) => (
                    <button
                      key={lv}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, level: lv }))}
                      className={cn(
                        "flex-1 rounded-md py-1 text-xs font-medium transition-all",
                        draft.level === lv
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  技能（逗号分隔）
                </label>
                <Input
                  value={draft.skills ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, skills: e.target.value }))
                  }
                  placeholder="React, Node, 微信支付"
                />
              </div>
            </div>
          )}

          {tab === "客户" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                信誉分（≥ 650 可分期）
              </label>
              <Input
                type="number"
                min={0}
                max={1000}
                value={draft.creditScore ?? 650}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    creditScore: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
              状态
            </label>
            <div className="flex gap-1 rounded-lg bg-muted/60 p-1 md:w-fit">
              {(
                [
                  { v: "active", label: "正常" },
                  { v: "suspended", label: "停用" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, status: opt.v }))}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all",
                    draft.status === opt.v
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.v === "active" ? (
                    <ShieldCheck className="size-3" />
                  ) : (
                    <ShieldAlert className="size-3" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={submit} disabled={!valid}>
            {state.kind === "edit" ? "保存修改" : "创建账号"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  state,
  onClose,
  onDelete,
}: {
  state: DialogState
  onClose: () => void
  onDelete: (tab: UserTab, id: string) => void
}) {
  const open = state.kind === "delete"
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>删除账号</DialogTitle>
          <DialogDescription>
            {state.kind === "delete" ? (
              <>
                确定要删除 <strong>{state.name}</strong> 吗？此操作不可撤销，
                相关的历史项目将保留，但账号将无法登录。
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          {state.kind === "delete" ? (
            <Button
              variant="destructive"
              onClick={() => onDelete(state.tab, state.id)}
            >
              <Trash2 className="size-3.5" />
              确认删除
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
