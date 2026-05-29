"use client"

import { Link, useParams } from "react-router"
import { motion } from "motion/react"
import { Search } from "lucide-react"
import { useDevSidebarNav } from "./sidebar-nav-context"
import {
  groups as projectGroups,
  tintBg,
} from "~/components/page-kits/dashboard/messages"

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
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

export function DevSecondPanelContent({ onItemSelect }: Props) {
  const { activeItem, setSubItem } = useDevSidebarNav()
  const params = useParams()
  const activeGroupId = params.id

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="gap-4 border-b border-border/60 px-5 pt-5 pb-4">
        <motion.div
          key={`dev-header-${activeItem.title}`}
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
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              },
            }}
            className="flex flex-col gap-0.5"
          >
            <div className="text-[17px] font-semibold tracking-tight text-foreground">
              {activeItem?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              {activeItem?.subtitle}
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              },
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="搜索项目群组…"
              className="h-9 w-full rounded-lg border border-transparent bg-muted/60 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:border-border focus:bg-background focus:outline-none"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1 px-2 py-2"
        >
          {projectGroups.map((group) => (
            <motion.div
              key={group.id}
              variants={itemVariants}
              data-active={activeGroupId === group.id}
              className="group rounded-xl transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
            >
              <Link
                to={`/devdashboard/messages/${group.id}`}
                onClick={() => {
                  setSubItem(group.name)
                  onItemSelect?.()
                }}
                className="flex flex-col gap-2 px-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="size-9 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 truncate text-sm font-medium tracking-tight">
                        {group.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {group.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0 text-[10px] ${tintBg[group.tint]}`}
                      >
                        {group.stage}
                      </span>
                      <span className="truncate">{group.lastMsg}</span>
                    </div>
                  </div>
                  {group.unread > 0 && (
                    <span className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground tabular-nums">
                      {group.unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 pl-12">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/70 transition-all"
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                    {group.progress}%
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
