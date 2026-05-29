import { motion } from "motion/react"
import { CalendarClock, FileEdit } from "lucide-react"
import type { Group } from "~/components/page-kits/dashboard/messages"
import { Button } from "~/components/ui/button"

type Props = {
  group: Group
  onCompose: () => void
}

export function TodayDeliveryBanner({ group, onCompose }: Props) {
  const current = group.milestones.find((m) => m.status === "current")
  const today = `${new Date().getMonth() + 1}月${new Date().getDate()}日`

  if (!current) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
      className="relative overflow-hidden border-b border-border/60 bg-card/60 px-4 py-3 backdrop-blur md:px-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 80% at 20% 0%, oklch(0.78 0.13 230 / 0.10), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-sky-400/50 to-transparent"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-300">
          <CalendarClock className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {today} · 今日交付
            </span>
            <h3 className="text-sm font-semibold tracking-tight">
              {current.title}
            </h3>
          </div>
          {current.desc ? (
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              {current.desc}
            </p>
          ) : null}
        </div>

        <Button size="sm" onClick={onCompose} className="shrink-0">
          <FileEdit className="size-3.5" />
          撰写今日进度
        </Button>
      </div>
    </motion.section>
  )
}
