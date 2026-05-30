"use client"

import * as React from "react"
import { Link, useParams } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { FolderKanban, Inbox, Search, ShieldCheck } from "lucide-react"
import { cn } from "~/lib/utils"
import { useAdminSidebarNav } from "./sidebar-nav-context"
import { useAdminAuth, roleLabel } from "./admin-auth-context"
import {
  adminProjects,
  assignedClients,
  pendingAssignmentsForCs,
  projectsForCs,
  statusLabel,
  statusTone,
  type AdminProject,
  type AssignedClient,
} from "./data"

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const },
  },
}

type Props = {
  onItemSelect?: () => void
}

export function AdminSecondPanelContent({ onItemSelect }: Props) {
  const { activeItem, setSubItem } = useAdminSidebarNav()
  const { user } = useAdminAuth()
  const params = useParams()
  const activeId = params.id
  const [query, setQuery] = React.useState("")

  // Clear query when switching between sections.
  React.useEffect(() => {
    setQuery("")
  }, [activeItem.url])

  const visibleProjects = React.useMemo<AdminProject[]>(() => {
    const base = user?.role === "cs" ? projectsForCs(user.name) : adminProjects
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.dev?.toLowerCase().includes(q) ?? false)
    )
  }, [user, query])

  const visiblePending = React.useMemo<AssignedClient[]>(() => {
    const base =
      user?.role === "cs" ? pendingAssignmentsForCs(user.name) : assignedClients
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (a) =>
        a.client.toLowerCase().includes(q) ||
        a.intent.toLowerCase().includes(q) ||
        a.aiSpec.projectName.toLowerCase().includes(q)
    )
  }, [user, query])

  const placeholder =
    activeItem.title === "待对接" ? "搜索客户 / 意图" : "搜索项目 / 客户 / 单号"

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="gap-4 border-b border-border/60 px-5 pt-5 pb-4">
        <motion.div
          key={`admin-header-${activeItem.title}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
          className="flex flex-col gap-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            className="flex flex-col gap-0.5"
          >
            <div className="flex items-center gap-1.5 text-[17px] font-semibold tracking-tight text-foreground">
              {activeItem?.title}
              {user ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <ShieldCheck className="size-3" />
                  {roleLabel[user.role]}
                </span>
              ) : null}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeItem?.subtitle}
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="h-9 w-full rounded-lg border border-transparent bg-muted/60 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:border-border focus:bg-background focus:outline-none"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.title + query}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="px-2 py-2"
          >
            {activeItem.title === "项目" ? (
              <ProjectList
                projects={visibleProjects}
                activeId={activeId}
                setSubItem={setSubItem}
                onItemSelect={onItemSelect}
              />
            ) : activeItem.title === "待对接" ? (
              <PendingList
                items={visiblePending}
                activeId={activeId}
                setSubItem={setSubItem}
                onItemSelect={onItemSelect}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProjectList({
  projects,
  activeId,
  setSubItem,
  onItemSelect,
}: {
  projects: AdminProject[]
  activeId?: string
  setSubItem: (s: string | null) => void
  onItemSelect?: () => void
}) {
  if (!projects.length) {
    return (
      <motion.div
        variants={itemVariants}
        className="mx-3 mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center"
      >
        <FolderKanban className="size-5 text-muted-foreground/70" />
        <span className="text-xs font-medium tracking-tight">没有匹配的项目</span>
      </motion.div>
    )
  }
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1"
    >
      {projects.map((p) => (
        <motion.div
          key={p.id}
          variants={itemVariants}
          data-active={activeId === p.id}
          className="group rounded-xl transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
        >
          <Link
            to={`/admin/projects/${p.id}`}
            onClick={() => {
              setSubItem(p.name)
              onItemSelect?.()
            }}
            className="flex flex-col gap-2 px-3 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="flex-1 truncate text-sm font-medium tracking-tight">
                {p.name}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  statusTone[p.status]
                )}
              >
                {statusLabel[p.status]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="truncate">{p.client}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="shrink-0">
                {p.dev ? `开发者 ${p.dev}` : "未派单"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-foreground/70 transition-all"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {p.progress}%
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

function PendingList({
  items,
  activeId,
  setSubItem,
  onItemSelect,
}: {
  items: AssignedClient[]
  activeId?: string
  setSubItem: (s: string | null) => void
  onItemSelect?: () => void
}) {
  if (!items.length) {
    return (
      <motion.div
        variants={itemVariants}
        className="mx-3 mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center"
      >
        <Inbox className="size-5 text-muted-foreground/70" />
        <span className="text-xs font-medium tracking-tight">
          目前没有待对接的客户
        </span>
      </motion.div>
    )
  }
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1"
    >
      {items.map((a) => (
        <motion.div
          key={a.id}
          variants={itemVariants}
          data-active={activeId === a.id}
          className="group rounded-xl transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
        >
          <Link
            to={`/admin/pending/${a.id}`}
            onClick={() => {
              setSubItem(a.client)
              onItemSelect?.()
            }}
            className="flex flex-col gap-1.5 px-3 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium tracking-tight">
                {a.client}
              </span>
              <span className="shrink-0 text-[11px] text-muted-foreground">
                {a.assignedAt}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="truncate">{a.contactName}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="shrink-0 tabular-nums">{a.phone}</span>
            </div>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {a.intent}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className="truncate">AI 初稿：{a.aiSpec.projectName}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="shrink-0">{a.aiSpec.estimatedPrice}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
