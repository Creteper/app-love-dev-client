import * as React from "react"
import { Link, useParams } from "react-router"
import { motion } from "motion/react"
import { ArrowLeft, FolderKanban, MessageCircleOff } from "lucide-react"
import {
  adminProjects,
  formatCNY,
  statusLabel,
  statusTone,
} from "~/components/page-kits/admin/data"
import { useAdminSidebarNav } from "~/components/page-kits/admin/sidebar-nav-context"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import { getGroupById } from "~/components/page-kits/dashboard/messages"
import { CsChatRoom } from "~/components/page-kits/admin/cs-chat-room"
import { cn } from "~/lib/utils"
import type { Route } from "./+types/id"

export function meta({ params }: Route.MetaArgs) {
  const p = adminProjects.find((x) => x.id === params.id)
  return [{ title: p ? `爱开发 - ${p.name}` : "爱开发 - 后台项目" }]
}

export default function AdminProjectDetail() {
  const { id } = useParams()
  const project = adminProjects.find((p) => p.id === id)
  const { setSubItem } = useAdminSidebarNav()
  const { user } = useAdminAuth()

  React.useEffect(() => {
    if (project) setSubItem(project.name)
  }, [project?.id, project?.name, setSubItem])

  if (!project) {
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <FolderKanban className="size-5" />
          </span>
          <div className="text-sm font-medium">未找到该项目</div>
          <Link
            to="/admin/projects"
            className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all hover:scale-[1.03]"
          >
            返回项目列表
          </Link>
        </motion.div>
      </main>
    )
  }

  // CS role: render chat with the project group (or placeholder)
  if (user?.role === "cs") {
    const group = project.groupId ? getGroupById(project.groupId) : undefined

    if (!group) {
      return (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:p-8">
          <Link
            to="/admin/projects"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            返回项目列表
          </Link>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
            <MessageCircleOff className="size-5 text-muted-foreground/70" />
            <div className="text-sm font-medium">{project.name}</div>
            <p className="text-xs text-muted-foreground">
              该项目还没有项目群。开发者抢单签约后会自动建群。
            </p>
            <p className="text-[11px] text-muted-foreground">
              当前状态：{statusLabel[project.status]}
            </p>
          </div>
        </main>
      )
    }

    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border/60 bg-card/40 px-4 py-2 backdrop-blur md:px-6">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            返回项目列表
          </Link>
        </div>
        <div className="min-h-0 flex-1">
          <CsChatRoom group={group} csName={user.name} />
        </div>
      </div>
    )
  }

  // Admin role: project detail with stats
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8">
      <Link
        to="/admin/projects"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        返回项目列表
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 md:p-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at 25% 0%, oklch(0.72 0.18 290 / 0.12), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-violet-400/60 to-transparent"
        />
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-mono tabular-nums">{project.id}</span>
          <span className="size-1 rounded-full bg-border" />
          <span>{project.createdAt} 创建</span>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {project.name}
          </h1>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
              statusTone[project.status]
            )}
          >
            {statusLabel[project.status]}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {project.client} · 客服 {project.cs}
          {project.dev ? ` · 开发者 ${project.dev}` : ""}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="预算" value={`¥ ${formatCNY(project.budget)}`} />
          <Stat label="已付" value={`¥ ${formatCNY(project.paid)}`} />
          <Stat label="未结算" value={`¥ ${formatCNY(project.unsettled)}`} />
          <Stat label="进度" value={`${project.progress}%`} />
        </div>

        <div className="mt-5">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/70 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          {project.nextMilestone ? (
            <p className="mt-2 text-xs text-muted-foreground">
              下一里程碑：{project.nextMilestone}
            </p>
          ) : null}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
        className="rounded-3xl border border-border/60 bg-card p-6"
      >
        <h2 className="text-sm font-semibold tracking-tight">资金账</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          客户款项托管在平台，按阶段验收释放给开发者。
        </p>
        <ul className="mt-4 grid grid-cols-3 divide-x divide-border/60">
          {[
            { label: "预算", value: project.budget, tone: "text-foreground" },
            { label: "已付到开发者", value: project.paid, tone: "text-emerald-600 dark:text-emerald-300" },
            { label: "未结算", value: project.unsettled, tone: "text-amber-600 dark:text-amber-300" },
          ].map((row) => (
            <li key={row.label} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {row.label}
              </span>
              <span className={cn("text-base font-semibold tabular-nums tracking-tight", row.tone)}>
                ¥ {formatCNY(row.value)}
              </span>
            </li>
          ))}
        </ul>
      </motion.section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
    </div>
  )
}
