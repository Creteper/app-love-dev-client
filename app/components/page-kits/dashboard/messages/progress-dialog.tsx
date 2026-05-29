import * as React from "react"
import { motion } from "motion/react"
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ImageIcon,
  MessageSquareQuote,
  SendHorizonal,
  Sparkles,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import type { ProgressReport } from "./data"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  report: ProgressReport
  onSubmit?: (feedback: string) => void
  /** When true, hides the feedback footer and shows a waiting state. */
  readOnly?: boolean
}

export function ProgressDialog({
  open,
  onOpenChange,
  report,
  onSubmit,
  readOnly = false,
}: Props) {
  const [feedback, setFeedback] = React.useState("")

  React.useEffect(() => {
    if (!open) setFeedback("")
  }, [open])

  const completed = report.steps.filter((s) => s.done).length
  const total = report.steps.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-full! max-w-[calc(100%-1rem)]! sm:max-w-[680px]! md:max-w-[760px]! lg:max-w-[860px]! overflow-hidden p-0 sm:rounded-3xl">
        <div className="flex max-h-[88vh] flex-col">
          {/* Header */}
          <DialogHeader className="relative gap-2 border-b border-border/60 px-6 pt-6 pb-5">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                <CalendarDays className="size-3" />
                {report.date}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Sparkles className="size-3" />
                进度回报
              </span>
            </div>
            <DialogTitle className="relative text-lg font-semibold tracking-tight">
              {report.title}
            </DialogTitle>
            <DialogDescription className="relative text-xs text-muted-foreground">
              {report.summary}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Timeline */}
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                  完成情况
                </h3>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {completed} / {total}
                </span>
              </div>

              <ol className="relative flex flex-col gap-3">
                <div className="absolute top-2 bottom-2 left-[10px] w-px bg-border/70" />
                {report.steps.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="relative flex items-start gap-3 pl-0"
                  >
                    <div className="relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background">
                      {s.done ? (
                        <CheckCircle2 className="size-5 text-emerald-500" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground/60" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium tracking-tight ${s.done ? "" : "text-muted-foreground"}`}>
                          {s.title}
                        </span>
                        {s.time && (
                          <span className="text-[11px] tabular-nums text-muted-foreground">{s.time}</span>
                        )}
                      </div>
                      {s.desc && (
                        <span className="text-[11px] leading-relaxed text-muted-foreground">{s.desc}</span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </section>

            {/* Screenshots */}
            {report.screenshots.length > 0 && (
              <section className="mt-6 flex flex-col gap-3">
                <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                  <ImageIcon className="size-3" />
                  现场截图
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {report.screenshots.map((shot, i) => (
                    <motion.figure
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i + 0.1, duration: 0.3 }}
                      className="overflow-hidden rounded-2xl border border-border/40 bg-card"
                    >
                      <img
                        src={shot.src}
                        alt={shot.caption ?? ""}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {shot.caption && (
                        <figcaption className="px-3 py-2 text-[11px] text-muted-foreground">
                          {shot.caption}
                        </figcaption>
                      )}
                    </motion.figure>
                  ))}
                </div>
              </section>
            )}

            {/* Note */}
            {report.note && (
              <section className="mt-6 flex flex-col gap-2">
                <h3 className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                  备注
                </h3>
                <p className="rounded-2xl bg-muted/40 px-4 py-3 text-xs leading-relaxed text-foreground/90">
                  {report.note}
                </p>
              </section>
            )}
          </div>

          {/* Footer: feedback (client) or waiting-state (read-only) */}
          {readOnly ? (
            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-amber-50/60 px-6 py-4 text-xs dark:bg-amber-500/10">
              <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Clock className="size-3.5" />
                <span className="font-medium">等待客户批阅</span>
                <span className="text-amber-700/70 dark:text-amber-300/70">
                  客户在此卡片上填写反馈后即可结算阶段款
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-9 shrink-0 rounded-full px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                关闭
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 border-t border-border/60 bg-card/40 px-6 py-4 backdrop-blur">
              <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                <MessageSquareQuote className="size-3" />
                你的反馈
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={2}
                placeholder="写下你的批阅意见，留空也可以直接确认通过…"
                className="max-h-32 min-h-16 w-full resize-none rounded-2xl border border-border/50 bg-background px-3.5 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:border-border focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="h-9 rounded-full px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => onSubmit?.(feedback.trim())}
                    className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-medium text-background shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
                  >
                    <SendHorizonal className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    发送批阅
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}