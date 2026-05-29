import { motion } from "motion/react"
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock,
  ImageIcon,
  Plus,
  StickyNote,
  Target,
  Users,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import {
  getLatestReport,
  roleBadge,
  tintBg,
  type Group,
  type Milestone,
} from "./data"

const stageTone: Record<string, string> = {
  开发中: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  待验收: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  等待接单: "bg-muted text-muted-foreground",
}

type Props = {
  group: Group
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function GroupInfoSheet({ group, open, onOpenChange }: Props) {
  const latest = getLatestReport(group.id)
  const todayCompleted = latest ? latest.steps.filter((s) => s.done).length : 0
  const todayTotal = latest?.steps.length ?? 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full! max-w-none! sm:max-w-none! md:w-1/2! p-0 gap-0"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="relative gap-3 border-b border-border/60 px-6 pt-6 pb-5">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative flex items-center gap-3">
              <img
                src={group.avatar}
                alt={group.name}
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <SheetTitle className="truncate text-base font-semibold tracking-tight">
                  {group.name}
                </SheetTitle>
                <div className="flex items-center gap-2">
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      stageTone[group.stage] ?? stageTone["等待接单"]
                    }`}
                  >
                    {group.stage}
                  </span>
                  <SheetDescription className="text-[11px]">
                    {group.members.length} 位成员 · 实时同步
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Delivery progress */}
            <section className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                    交付进度
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  当前阶段 · {group.stage}
                </span>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold tabular-nums tracking-tight">
                  {group.progress}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">%</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  key={group.id + group.progress}
                  initial={{ width: 0 }}
                  animate={{ width: `${group.progress}%` }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                  className="h-full rounded-full bg-foreground/70"
                />
              </div>

              {latest && (
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  最近一次进度：{latest.date} · {latest.title}
                </p>
              )}
            </section>

            {/* Members */}
            <section className="mt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                  <Users className="size-3" />
                  群成员
                </h3>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {group.members.length} 人
                </span>
              </div>
              <ul className="grid grid-cols-4 gap-x-2 gap-y-3 rounded-2xl border border-border/40 bg-card p-4 sm:grid-cols-5">
                {group.members.map((m) => {
                  const badge = roleBadge[m.role]
                  return (
                    <li
                      key={m.name}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        {m.avatar ? (
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="size-11 rounded-xl object-cover shadow-sm"
                          />
                        ) : (
                          <div
                            className={`flex size-11 items-center justify-center rounded-xl text-sm font-medium shadow-sm ${tintBg[m.tint]}`}
                          >
                            {m.initial}
                          </div>
                        )}
                      </div>
                      <span className="mt-1 w-full truncate text-center text-[11px] text-foreground/90">
                        {m.name}
                      </span>
                    </li>
                  )
                })}
                <li className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="添加成员"
                    className="flex size-11 items-center justify-center rounded-xl border border-dashed border-border/70 text-muted-foreground transition-all hover:border-foreground/40 hover:bg-muted/60 hover:text-foreground"
                  >
                    <Plus className="size-4" />
                  </button>
                  <span className="mt-1 text-center text-[11px] text-muted-foreground">添加</span>
                </li>
              </ul>
            </section>

            {/* Global milestones */}
            <section className="mt-5 flex flex-col gap-3">
              <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                <ClipboardList className="size-3" />
                全局阶段
              </h3>
              <ol className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card p-5">
                <div className="absolute top-7 bottom-7 left-[26px] w-px bg-border/70" />
                {group.milestones.map((ms, i) => (
                  <MilestoneRow key={i} milestone={ms} index={i} />
                ))}
              </ol>
            </section>

            {/* Today's steps */}
            {latest ? (
              <section className="mt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                    <CalendarDays className="size-3" />
                    当日任务（{latest.date}）
                  </h3>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {todayCompleted} / {todayTotal}
                  </span>
                </div>
                <ol className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card p-5">
                  <div className="absolute top-5 bottom-5 left-[26px] w-px bg-border/70" />
                  {latest.steps.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.28 }}
                      className="relative flex items-start gap-3"
                    >
                      <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-card">
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
                            <span className="flex items-center gap-0.5 text-[11px] tabular-nums text-muted-foreground">
                              <Clock className="size-3" />
                              {s.time}
                            </span>
                          )}
                        </div>
                        {s.desc && (
                          <span className="text-[11px] leading-relaxed text-muted-foreground">
                            {s.desc}
                          </span>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ol>

                {/* Screenshots */}
                {latest.screenshots.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                      <ImageIcon className="size-3" />
                      当日截图
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {latest.screenshots.map((shot, i) => (
                        <figure
                          key={i}
                          className="overflow-hidden rounded-xl border border-border/40 bg-card"
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
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note */}
                {latest.note && (
                  <div className="mt-2 flex flex-col gap-2">
                    <h4 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                      <StickyNote className="size-3" />
                      当日备注
                    </h4>
                    <p className="rounded-2xl bg-muted/40 px-4 py-3 text-xs leading-relaxed text-foreground/90">
                      {latest.note}
                    </p>
                  </div>
                )}
              </section>
            ) : (
              <section className="mt-5 rounded-2xl border border-dashed border-border/60 px-5 py-6 text-center text-xs text-muted-foreground">
                今天暂未收到开发者的进度回报
              </section>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MilestoneRow({ milestone, index }: { milestone: Milestone; index: number }) {
  const icon =
    milestone.status === "done" ? (
      <CheckCircle2 className="size-5 text-emerald-500" />
    ) : milestone.status === "current" ? (
      <span className="relative flex size-5 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <span className="relative size-2.5 rounded-full bg-primary" />
      </span>
    ) : (
      <Circle className="size-5 text-muted-foreground/50" />
    )

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.28 }}
      className="relative flex items-start gap-3"
    >
      <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full bg-card">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium tracking-tight ${
              milestone.status === "pending" ? "text-muted-foreground" : ""
            }`}
          >
            {milestone.title}
          </span>
          {milestone.status === "current" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              进行中
            </span>
          )}
          {milestone.date && (
            <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
              {milestone.date}
            </span>
          )}
        </div>
        {milestone.desc && (
          <span className="text-[11px] leading-relaxed text-muted-foreground">
            {milestone.desc}
          </span>
        )}
      </div>
    </motion.li>
  )
}