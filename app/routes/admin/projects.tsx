import * as React from "react"
import { Link, Outlet, useOutlet } from "react-router"
import { motion } from "motion/react"
import {
  ArrowRight,
  ArrowUpFromLine,
  CircleSlash,
  FolderKanban,
  Search,
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
import { useIsMobile } from "~/hooks/use-mobile"
import { AdminSecondPanelContent } from "~/components/page-kits/admin/second-panel-content"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import {
  adminProjects,
  formatCNY,
  statusLabel,
  statusTone,
  type AdminProject,
  type AdminProjectStatus,
  type DevLevel,
} from "~/components/page-kits/admin/data"
import { cn } from "~/lib/utils"

export function meta() {
  return [{ title: "爱开发 - 后台项目" }]
}

type StatusFilter = "全部" | AdminProjectStatus
type LevelFilter = "全部" | DevLevel

const STATUS_FILTERS: StatusFilter[] = [
  "全部",
  "pending-confirm",
  "open",
  "in-progress",
  "review",
  "settled",
  "frozen",
]

const LEVEL_FILTERS: LevelFilter[] = ["全部", "A", "B", "C"]

export default function AdminProjects() {
  const { user } = useAdminAuth()
  const outlet = useOutlet()
  const isMobile = useIsMobile()

  if (outlet) {
    return (
      <div className="flex h-full min-h-full flex-col">
        <Outlet />
      </div>
    )
  }

  // CS: project list shown in second sidebar; main area is a quiet placeholder.
  if (user?.role === "cs") {
    if (isMobile) {
      return (
        <div className="flex h-full min-h-full flex-col">
          <AdminSecondPanelContent />
        </div>
      )
    }
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <FolderKanban className="size-5" />
          </span>
          <div className="text-sm font-medium tracking-tight">
            选择一个项目进入对话
          </div>
          <p className="text-xs text-muted-foreground">
            左侧二级面板可按名称 / 客户 / 单号搜索你负责的项目
          </p>
        </motion.div>
      </main>
    )
  }

  return <AdminProjectsGrid />
}

function AdminProjectsGrid() {
  const [projects, setProjects] = React.useState<AdminProject[]>(adminProjects)
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("全部")
  const [level, setLevel] = React.useState<LevelFilter>("全部")
  const [pendingAction, setPendingAction] = React.useState<{
    id: string
    name: string
    intent: "takedown" | "publish"
  } | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (status !== "全部" && p.status !== status) return false
      if (level !== "全部" && p.level !== level) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    })
  }, [projects, query, status, level])

  function applyStatusChange(
    id: string,
    next: AdminProjectStatus,
    nextMilestone?: string
  ) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: next, nextMilestone: nextMilestone ?? p.nextMilestone } : p
      )
    )
  }

  function confirmPending() {
    if (!pendingAction) return
    if (pendingAction.intent === "takedown") {
      applyStatusChange(pendingAction.id, "frozen", "已被运营下架")
    } else {
      applyStatusChange(pendingAction.id, "open", "已重新上架，等待开发者抢单")
    }
    setPendingAction(null)
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
          项目管理
        </h1>
        <p className="text-sm text-muted-foreground">
          全部项目 · 支持搜索、按状态 / 等级筛选 · 上架 / 下架接单大厅。
        </p>
      </motion.section>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 backdrop-blur-sm md:flex-row md:items-center md:p-4">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索项目名 / 客户 / 单号"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <span className="hidden h-6 w-px bg-border/70 md:block" />
        <div className="flex flex-wrap items-center gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
                status === s
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {s === "全部" ? "全部" : statusLabel[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <span>等级</span>
        {LEVEL_FILTERS.map((lv) => (
          <button
            key={lv}
            onClick={() => setLevel(lv)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium transition-all",
              level === lv
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                : "bg-muted/60 hover:bg-muted hover:text-foreground"
            )}
          >
            {lv}
          </button>
        ))}
        <span className="ml-auto text-muted-foreground">
          共 <span className="tabular-nums text-foreground">{filtered.length}</span> 单
        </span>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center"
        >
          <FolderKanban className="size-6 text-muted-foreground/70" />
          <div className="text-sm font-medium">没有符合条件的项目</div>
          <p className="text-xs text-muted-foreground">
            试着改一下筛选条件，或清空搜索关键词。
          </p>
        </motion.div>
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
          }}
          className="grid gap-3 md:grid-cols-2"
        >
          {filtered.map((p) => (
            <motion.li
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <ProjectCard
                project={p}
                onTakedown={() =>
                  setPendingAction({ id: p.id, name: p.name, intent: "takedown" })
                }
                onPublish={() =>
                  setPendingAction({ id: p.id, name: p.name, intent: "publish" })
                }
              />
            </motion.li>
          ))}
        </motion.ul>
      )}

      <Dialog
        open={!!pendingAction}
        onOpenChange={(v) => !v && setPendingAction(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.intent === "takedown" ? "下架项目" : "重新上架"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.intent === "takedown" ? (
                <>
                  确定要下架 <strong>{pendingAction?.name}</strong> 吗？该项目将从
                  接单大厅移除，已签约的开发者不受影响。
                </>
              ) : (
                <>
                  将 <strong>{pendingAction?.name}</strong> 重新上架到接单大厅，
                  开发者将可看到并抢单。
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingAction(null)}>
              取消
            </Button>
            <Button
              variant={
                pendingAction?.intent === "takedown" ? "destructive" : "default"
              }
              onClick={confirmPending}
            >
              {pendingAction?.intent === "takedown" ? (
                <>
                  <CircleSlash className="size-3.5" />
                  确认下架
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="size-3.5" />
                  确认上架
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function ProjectCard({
  project,
  onTakedown,
  onPublish,
}: {
  project: AdminProject
  onTakedown: () => void
  onPublish: () => void
}) {
  const isOpen = project.status === "open"
  const canPublish =
    project.status === "frozen" || project.status === "pending-confirm"

  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm transition-colors hover:border-border">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono tabular-nums">{project.id}</span>
          <span className="size-1 rounded-full bg-border" />
          <span>{project.createdAt}</span>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
            statusTone[project.status]
          )}
        >
          {statusLabel[project.status]}
        </span>
      </header>

      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-base font-semibold tracking-tight">
            {project.name}
          </h3>
          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            {project.level} 级
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {project.client} · 客服 {project.cs}
          {project.dev ? ` · 开发者 ${project.dev}` : " · 无开发者"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/30 p-3">
        <Stat label="预算" value={`¥${formatCNY(project.budget)}`} />
        <Stat label="已付" value={`¥${formatCNY(project.paid)}`} />
        <Stat label="未结算" value={`¥${formatCNY(project.unsettled)}`} />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground/70 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {project.progress}%
        </span>
      </div>

      {project.nextMilestone ? (
        <p className="text-[11px] text-muted-foreground">
          下一里程碑：{project.nextMilestone}
        </p>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {isOpen ? (
            <Button size="sm" variant="destructive" onClick={onTakedown}>
              <CircleSlash className="size-3.5" />
              下架
            </Button>
          ) : canPublish ? (
            <Button size="sm" onClick={onPublish}>
              <ArrowUpFromLine className="size-3.5" />
              上架接单大厅
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              {project.status === "in-progress"
                ? "开发中 · 不可下架"
                : project.status === "review"
                  ? "待验收 · 不可下架"
                  : project.status === "settled"
                    ? "已结算"
                    : ""}
            </span>
          )}
        </div>
        <Link
          to={`/admin/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          查看详情
          <ArrowRight className="size-3.5" />
        </Link>
      </footer>
    </article>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="truncate text-xs font-semibold tabular-nums tracking-tight">
        {value}
      </span>
    </div>
  )
}
