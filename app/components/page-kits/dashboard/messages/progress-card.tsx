import * as React from "react"
import {
  CalendarDays,
  ChevronRight,
  Clock,
  ImageIcon,
  ListChecks,
  Sparkles,
} from "lucide-react"
import { ProgressDialog } from "./progress-dialog"
import type { ProgressReport } from "./data"

type Props = {
  report: ProgressReport
  align?: "left" | "right"
  onReview?: (reportDate: string, feedback: string) => void
  /** When true, hides the review affordance and footer CTA. */
  readOnly?: boolean
}

export function ProgressCard({
  report,
  align = "left",
  onReview,
  readOnly = false,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const completed = report.steps.filter((s) => s.done).length
  const total = report.steps.length
  const ratio = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group flex w-full max-w-md flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md ${
          align === "right" ? "rounded-tr-md" : "rounded-tl-md"
        }`}
      >
        {/* Top bar */}
        <div className="relative flex items-center gap-2 border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent px-4 pt-3.5 pb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
            <CalendarDays className="size-3" />
            {report.date}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="size-3" />
            进度回报
          </span>
          <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 px-4 pb-3.5">
          <h4 className="text-sm font-semibold tracking-tight">{report.title}</h4>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {report.summary}
          </p>

          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ListChecks className="size-3.5" />
              <span className="tabular-nums">
                {completed} / {total}
              </span>
              <span>步骤</span>
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="size-3.5" />
              <span className="tabular-nums">{report.screenshots.length}</span>
              <span>张截图</span>
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/70 transition-all"
                style={{ width: `${ratio}%` }}
              />
            </div>
            <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
              {ratio}%
            </span>
          </div>
        </div>

        <div
          className={`border-t border-border/40 px-4 py-2 text-[11px] font-medium transition-colors ${
            readOnly
              ? "bg-amber-50/60 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
              : "bg-muted/30 text-foreground/80 group-hover:bg-muted/50"
          }`}
        >
          {readOnly ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              等待客户批阅 · 点击查看详情
            </span>
          ) : (
            "点击查看详情并批阅 →"
          )}
        </div>
      </button>

      <ProgressDialog
        open={open}
        onOpenChange={setOpen}
        report={report}
        readOnly={readOnly}
        onSubmit={(feedback) => {
          onReview?.(report.date, feedback)
          setOpen(false)
        }}
      />
    </>
  )
}
