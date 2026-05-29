import * as React from "react"
import {
  CalendarDays,
  Check,
  ImagePlus,
  ListChecks,
  Plus,
  SendHorizonal,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type {
  ProgressReport,
  ProgressShot,
  ProgressStep,
} from "~/components/page-kits/dashboard/messages"

type Draft = {
  title: string
  summary: string
  steps: Array<ProgressStep & { id: string }>
  shots: Array<ProgressShot & { id: string }>
  note: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate: string
  defaultTitle?: string
  onSubmit: (report: ProgressReport) => void
}

const uid = () => Math.random().toString(36).slice(2, 9)

function emptyStep(): Draft["steps"][number] {
  return { id: uid(), title: "", done: false }
}

function makeInitialDraft(defaultTitle: string): Draft {
  return {
    title: defaultTitle,
    summary: "",
    steps: [emptyStep()],
    shots: [],
    note: "",
  }
}

export function DevProgressComposer({
  open,
  onOpenChange,
  defaultDate,
  defaultTitle = "今日进度回报",
  onSubmit,
}: Props) {
  const [draft, setDraft] = React.useState<Draft>(() =>
    makeInitialDraft(defaultTitle)
  )
  const fileRef = React.useRef<HTMLInputElement>(null)

  // Reset the form when reopening, so previous drafts don't leak between sessions.
  React.useEffect(() => {
    if (open) {
      setDraft(makeInitialDraft(defaultTitle))
    }
  }, [open, defaultTitle])

  function updateStep(id: string, patch: Partial<ProgressStep>) {
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }))
  }

  function removeStep(id: string) {
    setDraft((d) => ({
      ...d,
      steps:
        d.steps.length > 1 ? d.steps.filter((s) => s.id !== id) : d.steps,
    }))
  }

  function addStep() {
    setDraft((d) => ({ ...d, steps: [...d.steps, emptyStep()] }))
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !files.length) return
    const readers = Array.from(files).map(
      (file) =>
        new Promise<{ src: string; caption?: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve({ src: reader.result, caption: file.name })
            } else {
              reject()
            }
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((items) => {
      setDraft((d) => ({
        ...d,
        shots: [...d.shots, ...items.map((it) => ({ id: uid(), ...it }))],
      }))
    })
    e.target.value = ""
  }

  function removeShot(id: string) {
    setDraft((d) => ({ ...d, shots: d.shots.filter((s) => s.id !== id) }))
  }

  function canSend(): boolean {
    if (!draft.title.trim() || !draft.summary.trim()) return false
    const validSteps = draft.steps.filter((s) => s.title.trim().length)
    return validSteps.length > 0
  }

  function submit() {
    if (!canSend()) return
    const validSteps = draft.steps
      .filter((s) => s.title.trim().length)
      .map<ProgressStep>(({ title, desc, done, time }) => ({
        title: title.trim(),
        desc: desc?.trim() || undefined,
        done,
        time,
      }))
    const validShots = draft.shots.map<ProgressShot>(({ src, caption }) => ({
      src,
      caption,
    }))
    const report: ProgressReport = {
      reportId: `rp-${Date.now()}`,
      date: defaultDate,
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      steps: validSteps,
      screenshots: validShots,
      note: draft.note.trim() || undefined,
    }
    onSubmit(report)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[88vh] w-full! max-w-[calc(100%-1rem)]! sm:max-w-[640px]! md:max-w-[720px]! overflow-hidden p-0 sm:rounded-3xl"
      >
        <div className="flex max-h-[88vh] flex-col">
          <DialogHeader className="relative gap-2 border-b border-border/60 bg-gradient-to-br from-primary/5 via-transparent to-transparent px-6 pt-6 pb-5">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                <CalendarDays className="size-3" />
                {defaultDate}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Sparkles className="size-3" />
                进度回报草稿
              </span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="关闭"
                className="ml-auto flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <DialogTitle className="relative text-lg font-semibold tracking-tight">
              撰写今日进度
            </DialogTitle>
            <DialogDescription className="relative text-xs text-muted-foreground">
              发送后客户将在群里看到这张卡片并进行批阅。
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              <input
                value={draft.title}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="今日工作主题"
                className="border-b border-border/50 bg-transparent pb-1.5 text-sm font-semibold tracking-tight placeholder:font-normal placeholder:text-muted-foreground focus:border-foreground/60 focus:outline-none"
              />

              <textarea
                value={draft.summary}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, summary: e.target.value }))
                }
                placeholder="一句话总结今天交付了什么、明天计划做什么。"
                rows={2}
                className="resize-none rounded-lg bg-muted/40 px-3 py-2 text-xs leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />

              <section className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <ListChecks className="size-3.5" />
                    完成项
                  </span>
                  <button
                    type="button"
                    onClick={addStep}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="size-3" />
                    添加
                  </button>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {draft.steps.map((s) => (
                    <li key={s.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateStep(s.id, { done: !s.done })}
                        aria-label={s.done ? "标记未完成" : "标记完成"}
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          s.done
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background text-transparent hover:border-foreground/60"
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </button>
                      <input
                        value={s.title}
                        onChange={(e) =>
                          updateStep(s.id, { title: e.target.value })
                        }
                        placeholder="例如：跑通登录注册接口"
                        className={cn(
                          "flex-1 bg-transparent text-xs leading-relaxed placeholder:text-muted-foreground focus:outline-none",
                          s.done && "text-muted-foreground line-through"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(s.id)}
                        disabled={draft.steps.length <= 1}
                        aria-label="删除"
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <ImagePlus className="size-3.5" />
                    截图 / 现场图
                  </span>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="size-3" />
                    上传
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFiles}
                  />
                </div>

                {draft.shots.length ? (
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {draft.shots.map((s) => (
                      <li
                        key={s.id}
                        className="group relative overflow-hidden rounded-lg border border-border/60"
                      >
                        <img
                          src={s.src}
                          alt={s.caption ?? ""}
                          className="aspect-square w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeShot(s.id)}
                          aria-label="移除"
                          className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/85 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        >
                          <X className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border/70 text-[11px] text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/40 hover:text-foreground"
                  >
                    <ImagePlus className="mr-1.5 size-3.5" />
                    点击上传，或拖拽到这里
                  </button>
                )}
              </section>

              <textarea
                value={draft.note}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, note: e.target.value }))
                }
                placeholder="补充说明（可选）：例如风险、需要客户配合的事项。"
                rows={2}
                className="resize-none rounded-lg bg-muted/30 px-3 py-2 text-xs leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-border/60 bg-card/40 px-6 py-4 backdrop-blur">
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button size="sm" onClick={submit} disabled={!canSend()}>
              发送进度卡
              <SendHorizonal className="ml-0.5 size-3.5" />
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
