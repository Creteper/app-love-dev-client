import * as React from "react"
import {
  FileArchive,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
  Package,
  Plus,
  SendHorizonal,
  Trash2,
  Upload,
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
import {
  detectFileKind,
  humanFileSize,
  type DeliverableFile,
  type DeliverableFileKind,
} from "~/components/page-kits/dashboard/messages"

const uid = () => Math.random().toString(36).slice(2, 9)

function iconFor(kind: DeliverableFileKind) {
  switch (kind) {
    case "image":
      return ImageIcon
    case "zip":
      return FileArchive
    case "doc":
      return FileText
    default:
      return FileIcon
  }
}

type Draft = {
  files: DeliverableFile[]
  note: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  phase?: string
  onSubmit: (files: DeliverableFile[], note?: string) => void
}

function emptyDraft(): Draft {
  return { files: [], note: "" }
}

export function DevDeliverableComposer({
  open,
  onOpenChange,
  phase,
  onSubmit,
}: Props) {
  const [draft, setDraft] = React.useState<Draft>(emptyDraft)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) setDraft(emptyDraft())
  }, [open])

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || !files.length) return
    const next: DeliverableFile[] = Array.from(files).map((file) => {
      const kind = detectFileKind(file.name)
      return {
        id: uid(),
        name: file.name,
        size: humanFileSize(file.size),
        kind,
        // Only inline image previews; everything else is referenced by name.
        src: undefined,
      }
    })
    // Read images as data URLs in parallel so the chat bubble can show a preview later if needed.
    const previewReads = Array.from(files).map((file, idx) => {
      const target = next[idx]
      if (target.kind !== "image") return Promise.resolve()
      return new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === "string") target.src = reader.result
          resolve()
        }
        reader.onerror = () => resolve()
        reader.readAsDataURL(file)
      })
    })
    Promise.all(previewReads).then(() => {
      setDraft((d) => ({ ...d, files: [...d.files, ...next] }))
    })
    e.target.value = ""
  }

  function removeFile(id: string) {
    setDraft((d) => ({ ...d, files: d.files.filter((f) => f.id !== id) }))
  }

  function submit() {
    if (!draft.files.length) return
    onSubmit(draft.files, draft.note.trim() || undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[88vh] w-full! max-w-[calc(100%-1rem)]! sm:max-w-[600px]! overflow-hidden p-0 sm:rounded-3xl"
      >
        <div className="flex max-h-[88vh] flex-col">
          <DialogHeader className="relative gap-2 border-b border-border/60 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent px-6 pt-6 pb-5">
            <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-emerald-500/8 blur-3xl" />
            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Package className="size-3" />
                项目产物
              </span>
              {phase ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  {phase}
                </span>
              ) : null}
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
              上传项目产物
            </DialogTitle>
            <DialogDescription className="relative text-xs text-muted-foreground">
              上传后会推送一张产物卡片到群里，同时归档到客户的「产物」选项卡。
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              {draft.files.length === 0 ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted/40 hover:text-foreground"
                >
                  <Upload className="size-5" />
                  <span className="text-sm font-medium">点击选择文件，或拖拽到这里</span>
                  <span className="text-[11px] text-muted-foreground">
                    源码 zip / 设计稿 / 文档 / 截图均可
                  </span>
                </button>
              ) : (
                <>
                  <ul className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/60">
                    {draft.files.map((f) => {
                      const Icon = iconFor(f.kind)
                      return (
                        <li
                          key={f.id}
                          className="flex items-center gap-3 px-3 py-2.5"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Icon className="size-4" />
                          </span>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-xs font-medium tracking-tight">
                              {f.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground tabular-nums">
                              {f.size}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            aria-label="移除"
                            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex h-9 w-fit items-center gap-1.5 rounded-full border border-border/60 px-3 text-xs text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                    继续添加
                  </button>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handlePick}
              />

              <textarea
                value={draft.note}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, note: e.target.value }))
                }
                placeholder="备注（可选）：说明产物范围、使用方式、版本号等。"
                rows={2}
                className="resize-none rounded-lg bg-muted/30 px-3 py-2 text-xs leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-border/60 bg-card/40 px-6 py-4 backdrop-blur">
            <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button size="sm" onClick={submit} disabled={!draft.files.length}>
              发送产物
              <SendHorizonal className="ml-0.5 size-3.5" />
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
