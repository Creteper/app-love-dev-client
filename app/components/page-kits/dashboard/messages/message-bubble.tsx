import { motion } from "motion/react"
import {
  CheckCircle2,
  FileArchive,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
  Package,
  Upload,
} from "lucide-react"
import { ProgressCard } from "./progress-card"
import { SpecChatCard } from "./spec-chat-card"
import {
  tintBg,
  roleBadge,
  type DeliverableFile,
  type MessageItem,
} from "./data"

const EASE = [0.4, 0, 0.2, 1] as const

// Per-bubble entrance: each motion.div owns initial/animate so a newly added
// message animates in on its own, without re-animating the whole list.

// Centered system-style cards (system / progress-review / acceptance-pass).
const centeredEnter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: EASE },
}

// Outbound (own) bubbles slide in from the right.
const meEnter = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: EASE },
}

// Inbound (others') bubbles slide in subtly from the left.
const themEnter = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, ease: EASE },
}

type Props = {
  msg: MessageItem
  onReview?: (reportDate: string, feedback: string) => void
  /** Fired when the viewer asks to upload deliverables (dev side only). */
  onUploadDeliverable?: () => void
  /** Whose perspective to render the chat from. Default: "client" */
  meRole?: MessageItem["authorRole"]
  /** When true, hides reviewer-only actions (e.g. dev viewing). Default: false */
  readOnly?: boolean
}

function fileIconFor(file: DeliverableFile) {
  switch (file.kind) {
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

export function MessageBubble({
  msg,
  onReview,
  onUploadDeliverable,
  meRole = "client",
  readOnly = false,
}: Props) {
  if (msg.content.kind === "system") {
    return (
      <motion.div
        {...centeredEnter}
        className="flex items-center justify-center py-2"
      >
        <span className="rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground">
          {msg.content.text}
        </span>
      </motion.div>
    )
  }

  if (msg.content.kind === "progress-review") {
    const { reportDate, feedback } = msg.content
    return (
      <motion.div
        {...centeredEnter}
        className="flex items-center justify-center py-2"
      >
        <div className="flex max-w-md flex-col items-center gap-1.5 rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-4 py-2.5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-3.5" />
            <span>{reportDate}的进度已批阅</span>
          </div>
          {feedback && (
            <p className="text-[11px] leading-relaxed text-emerald-700/80 dark:text-emerald-300/80">
              「{feedback}」
            </p>
          )}
        </div>
      </motion.div>
    )
  }

  if (msg.content.kind === "acceptance-pass") {
    const { phase, feedback } = msg.content
    const canUpload = meRole === "dev" && !!onUploadDeliverable
    return (
      <motion.div
        {...centeredEnter}
        className="flex items-center justify-center py-2"
      >
        <div className="flex w-full max-w-md flex-col items-center gap-2 rounded-2xl border border-emerald-200/60 bg-emerald-50/70 px-5 py-4 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-300" />
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {phase} 已通过验收
          </div>
          {feedback && (
            <p className="text-[11px] leading-relaxed text-emerald-700/80 dark:text-emerald-300/80">
              客户反馈：「{feedback}」
            </p>
          )}
          <p className="max-w-sm text-[11px] leading-relaxed text-muted-foreground">
            请尽快上传本期产物（源码 / 设计稿 / 文档等），上传后会自动归档到客户的「产物」选项卡。
          </p>
          {canUpload && (
            <button
              type="button"
              onClick={onUploadDeliverable}
              className="mt-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-xs font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-emerald-600/90 dark:bg-emerald-500"
            >
              <Upload className="size-3.5" />
              上传项目产物
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  const isMe = msg.authorRole === meRole
  const badge = roleBadge[msg.authorRole]
  const enter = isMe ? meEnter : themEnter

  return (
    <motion.div
      {...enter}
      className={`flex w-full items-end gap-3 ${isMe ? "flex-row-reverse" : ""}`}
    >
      {msg.authorAvatar ? (
        <img
          src={msg.authorAvatar}
          alt={msg.authorName}
          className="size-9 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
            tintBg[msg.authorTint]
          }`}
        >
          {msg.authorInitial}
        </div>
      )}

      <div className={`flex min-w-0 max-w-[72%] flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-1.5 px-1 text-[11px] ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="font-medium text-foreground">{msg.authorName}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${badge.cls}`}
          >
            {badge.label}
          </span>
          <span className="text-muted-foreground tabular-nums">{msg.time}</span>
        </div>

        {msg.content.kind === "text" && (
          <div
            className={`max-w-full rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
              isMe
                ? "rounded-tr-md bg-primary text-primary-foreground"
                : "rounded-tl-md bg-card text-foreground border border-border/40"
            }`}
          >
            {msg.content.text}
          </div>
        )}

        {msg.content.kind === "image" && (
          <div
            className={`flex max-w-full flex-col gap-1 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm ${
              isMe ? "rounded-tr-md" : "rounded-tl-md"
            }`}
          >
            <img
              src={msg.content.src}
              alt={msg.content.caption ?? ""}
              className="h-auto max-h-72 w-full object-cover"
            />
            {msg.content.caption && (
              <span className="px-3 py-2 text-[11px] text-muted-foreground">
                {msg.content.caption}
              </span>
            )}
          </div>
        )}

        {msg.content.kind === "progress-report" && (
          <ProgressCard
            report={msg.content.report}
            align={isMe ? "right" : "left"}
            readOnly={readOnly}
            onReview={(date, fb) => onReview?.(date, fb)}
          />
        )}

        {msg.content.kind === "spec-card" && (
          <SpecChatCard
            spec={msg.content.spec}
            variant={msg.content.variant}
            align={isMe ? "right" : "left"}
          />
        )}

        {msg.content.kind === "deliverable" && (
          <div
            className={`flex w-full max-w-md flex-col gap-2 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm ${
              isMe ? "rounded-tr-md" : "rounded-tl-md"
            }`}
          >
            <header className="flex items-center gap-2 border-b border-border/40 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent px-4 pt-3 pb-2.5">
              <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Package className="size-3.5" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
                  项目产物已上传
                </span>
                <span className="text-xs text-muted-foreground">
                  共 {msg.content.files.length} 份 · 已归档到客户产物清单
                </span>
              </div>
            </header>

            <ul className="flex flex-col gap-1 px-3 pb-3">
              {msg.content.files.map((f) => {
                const Icon = fileIconFor(f)
                return (
                  <li
                    key={f.id}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-medium tracking-tight">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {f.size}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>

            {msg.content.note && (
              <div className="border-t border-border/40 bg-muted/30 px-4 py-2 text-[11px] leading-relaxed text-muted-foreground">
                {msg.content.note}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
