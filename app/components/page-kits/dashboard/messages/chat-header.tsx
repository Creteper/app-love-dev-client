import * as React from "react"
import { motion } from "motion/react"
import { Users, Phone, MoreHorizontal } from "lucide-react"
import { tintBg, type Group } from "./data"
import { GroupInfoSheet } from "./group-info-sheet"

const stageTone: Record<string, string> = {
  开发中: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  待验收: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  等待接单: "bg-muted text-muted-foreground",
}

export function ChatHeader({ group }: { group: Group }) {
  const [infoOpen, setInfoOpen] = React.useState(false)

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col gap-4 border-b border-border/60 bg-card/40 px-6 py-4 backdrop-blur"
    >
      <div className="flex items-center gap-3">
        <img
          src={group.avatar}
          alt={group.name}
          className="size-11 shrink-0 rounded-full object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold tracking-tight">{group.name}</h1>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                stageTone[group.stage] ?? stageTone["等待接单"]
              }`}
            >
              {group.stage}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Users className="size-3" />
            <span>{group.members.length} 位成员</span>
            <span className="text-muted-foreground/40">·</span>
            <div className="flex -space-x-1.5">
              {group.members.slice(0, 3).map((m) =>
                m.avatar ? (
                  <img
                    key={m.name}
                    src={m.avatar}
                    alt={m.name}
                    className="size-4 rounded-full object-cover ring-2 ring-card"
                  />
                ) : (
                  <span
                    key={m.name}
                    className={`flex size-4 items-center justify-center rounded-full text-[8px] font-medium ring-2 ring-card ${tintBg[m.tint]}`}
                  >
                    {m.initial}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="语音"
          >
            <Phone className="size-4" />
          </button>
          <button
            onClick={() => setInfoOpen(true)}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="群信息"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
          交付进度
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${group.progress}%` }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="h-full rounded-full bg-foreground/70"
          />
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums tracking-tight">
          {group.progress}%
        </span>
      </div>
    </motion.header>
    <GroupInfoSheet group={group} open={infoOpen} onOpenChange={setInfoOpen} />
    </>
  )
}