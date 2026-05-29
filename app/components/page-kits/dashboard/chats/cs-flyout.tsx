import * as React from "react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowUp,
  CalendarRange,
  CheckCircle2,
  FileText,
  Headphones,
  Receipt,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react"
import { cn } from "~/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { InvoiceDialog, InvoiceMiniCard } from "./invoice"
import type { ProjectSpec } from "./data"

type TextMsg = {
  id: number
  kind: "text"
  role: "cs" | "me"
  text: string
  time: string
}
type SystemMsg = {
  id: number
  kind: "system"
  text: string
  time: string
}
type SpecMsg = {
  id: number
  kind: "spec"
  role: "cs"
  time: string
  finalPrice: string
  duration: string
  level: ProjectSpec["level"]
  projectName: string
  highlights: string[]
}

type Msg = TextMsg | SystemMsg | SpecMsg

function nowStr() {
  return new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function MeBubble({ m }: { m: TextMsg }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="ml-auto flex max-w-[85%] flex-col items-end gap-1"
    >
      <div className="rounded-2xl rounded-tr-md bg-foreground px-3.5 py-2 text-sm leading-relaxed text-background shadow-sm">
        {m.text}
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {m.time}
      </span>
    </motion.div>
  )
}

function CsBubble({ m }: { m: TextMsg }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="flex max-w-[85%] flex-col items-start gap-1"
    >
      <div className="rounded-2xl rounded-tl-md border border-border/50 bg-card px-3.5 py-2 text-sm leading-relaxed text-foreground/90 shadow-sm">
        {m.text}
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {m.time}
      </span>
    </motion.div>
  )
}

function SystemPill({ m }: { m: SystemMsg }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground"
    >
      <span className="size-1.5 rounded-full bg-muted-foreground/60" />
      {m.text}
    </motion.div>
  )
}

function TypingBubble() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -24, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
      className="flex items-start"
    >
      <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border/50 bg-card px-3 py-2 shadow-sm">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block size-1.5 rounded-full bg-muted-foreground/60"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.13,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function SpecCardBubble({
  m,
  spec,
  confirmed,
  onConfirm,
}: {
  m: SpecMsg
  spec: ProjectSpec
  confirmed: boolean
  onConfirm: () => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, x: -24, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="flex max-w-[92%] flex-col items-start gap-1"
      >
        <InvoiceMiniCard className="w-full">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[10px] tracking-[0.18em] text-primary uppercase">
                  Love · 客服终版确认
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {m.projectName}
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {m.level} 级
              </span>
            </div>
            <div className="border-t border-dashed border-border/60" />
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3">
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                  <Wallet className="size-3" />
                  最终价
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {m.finalPrice}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                  <CalendarRange className="size-3" />
                  工期
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {m.duration}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {m.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-foreground/85"
                >
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={confirmed}
              className={cn(
                "group flex items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition-colors",
                confirmed
                  ? "border-border/60 bg-muted text-muted-foreground"
                  : "border-border/60 bg-background hover:border-primary/60 hover:text-primary"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {confirmed ? (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    已确认，正在建群…
                  </>
                ) : (
                  <>
                    <FileText className="size-3.5" />
                    查看详情
                  </>
                )}
              </span>
              {!confirmed && (
                <span className="text-muted-foreground/70 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>
          </div>
        </InvoiceMiniCard>
        <span className="text-[10px] tabular-nums text-muted-foreground">
          {m.time}
        </span>
      </motion.div>
      <InvoiceDialog
        open={open}
        onOpenChange={setOpen}
        spec={spec}
        variant="cs"
        onConfirm={() => {
          setOpen(false)
          onConfirm()
        }}
      />
    </>
  )
}

function CsSheet({
  open,
  onOpenChange,
  spec,
  onGroupCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  spec: ProjectSpec
  onGroupCreated: (groupName: string) => void
}) {
  const idRef = React.useRef(0)
  const next = () => ++idRef.current

  const [messages, setMessages] = React.useState<Msg[]>(() => {
    idRef.current = 0
    return [
      {
        id: next(),
        kind: "system",
        text: "客服小张 已加入对话",
        time: nowStr(),
      },
      {
        id: next(),
        kind: "text",
        role: "cs",
        text: "你好，我是爱开发的客服小张 👋",
        time: nowStr(),
      },
      {
        id: next(),
        kind: "text",
        role: "cs",
        text: "我已经收到 Jane 整理的需求文档和报价，咱们再确认一下细节就可以为你匹配开发者。",
        time: nowStr(),
      },
      {
        id: next(),
        kind: "text",
        role: "cs",
        text: `请问 ${spec.estimatedPrice} 的预估价格在你的预算范围内吗？`,
        time: nowStr(),
      },
    ]
  })

  const [value, setValue] = React.useState("")
  const [typing, setTyping] = React.useState(false)
  const [specSent, setSpecSent] = React.useState(false)
  const [confirmed, setConfirmed] = React.useState(false)
  const userMsgCountRef = React.useRef(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    })
  }, [messages, typing])

  function pushCsText(text: string) {
    setMessages((m) => [
      ...m,
      { id: next(), kind: "text", role: "cs", text, time: nowStr() },
    ])
  }

  function pushSystem(text: string) {
    setMessages((m) => [
      ...m,
      { id: next(), kind: "system", text, time: nowStr() },
    ])
  }

  function pushSpec() {
    setMessages((m) => [
      ...m,
      {
        id: next(),
        kind: "spec",
        role: "cs",
        time: nowStr(),
        projectName: spec.projectName,
        finalPrice: spec.estimatedPrice,
        duration: spec.estimatedDuration,
        level: spec.level,
        highlights: [
          "需求文档与开发计划已与你确认无误",
          "三期里程碑结算，平台全程托管资金",
          "建群后将由对应等级程序员接单，每日进度同步",
        ],
      },
    ])
  }

  function send() {
    const text = value.trim()
    if (!text || confirmed) return

    setMessages((m) => [
      ...m,
      { id: next(), kind: "text", role: "me", text, time: nowStr() },
    ])
    setValue("")
    userMsgCountRef.current += 1

    const shouldSendSpec = userMsgCountRef.current >= 2 && !specSent

    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      if (shouldSendSpec) {
        pushCsText("好的，那我把咱们最终确认的版本整理一下👇")
        window.setTimeout(() => {
          pushSpec()
          setSpecSent(true)
        }, 450)
      } else if (specSent) {
        pushCsText("收到，等你点上方卡片里的「确认需求，自动建群」就行～")
      } else {
        const replies = [
          "好的，我记一下这个细节。",
          "明白，那咱们继续聊聊预算和工期。",
          "我这边已同步到工单，请稍等～",
        ]
        pushCsText(replies[userMsgCountRef.current % replies.length])
      }
    }, 1100)
  }

  function handleConfirmSpec() {
    if (confirmed) return
    setConfirmed(true)
    const groupName = `${spec.projectName} · 项目群`
    window.setTimeout(() => {
      pushSystem(`已为你建立项目群「${groupName}」，程序员接单后会自动入群`)
      onGroupCreated(groupName)
    }, 700)
  }

  return (
    <SheetPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <SheetPrimitive.Portal>
        <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <SheetPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-dvh flex-col bg-popover text-popover-foreground shadow-2xl",
            "w-full sm:w-2/3 md:w-1/2 lg:w-1/3",
            "border-l border-border/60",
            "data-open:animate-in data-open:slide-in-from-right-10 data-open:fade-in-0",
            "data-closed:animate-out data-closed:slide-out-to-right-10 data-closed:fade-out-0",
            "duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
            <Avatar className="size-10">
              <AvatarImage src="/assets/avatar%20(2).png" alt="客服小张" />
              <AvatarFallback className="bg-primary/15 text-xs text-primary">
                小张
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <SheetPrimitive.Title className="font-heading text-sm font-medium">
                  客服 · 小张
                </SheetPrimitive.Title>
                <ShieldCheck className="size-3.5 text-emerald-500" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                在线 · 通常 1 分钟内回复
              </span>
            </div>
            <SheetPrimitive.Close
              aria-label="关闭"
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </SheetPrimitive.Close>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  if (m.kind === "system")
                    return <SystemPill key={m.id} m={m} />
                  if (m.kind === "spec")
                    return (
                      <SpecCardBubble
                        key={m.id}
                        m={m}
                        spec={spec}
                        confirmed={confirmed}
                        onConfirm={handleConfirmSpec}
                      />
                    )
                  return m.role === "me" ? (
                    <MeBubble key={m.id} m={m} />
                  ) : (
                    <CsBubble key={m.id} m={m} />
                  )
                })}
                {typing && <TypingBubble key="__typing" />}
              </AnimatePresence>
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2 shadow-sm">
              <textarea
                rows={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder={
                  confirmed
                    ? "已建群，可在主对话中查看进展"
                    : "和客服确认需求与价格…"
                }
                disabled={confirmed}
                className="flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                onClick={send}
                disabled={!value.trim() || confirmed}
                aria-label="发送"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </SheetPrimitive.Content>
      </SheetPrimitive.Portal>
    </SheetPrimitive.Root>
  )
}

export function CsFlyout({
  active,
  open,
  onOpenChange,
  spec,
  onGroupCreated,
}: {
  active: boolean
  open: boolean
  onOpenChange: (v: boolean) => void
  spec: ProjectSpec
  onGroupCreated: (groupName: string) => void
}) {
  return (
    <>
      <AnimatePresence>
        {active && !open && (
          <motion.button
            key="cs-float"
            type="button"
            onClick={() => onOpenChange(true)}
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            aria-label="联系客服"
            className="fixed right-12 bottom-32 z-40 inline-flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-[0_18px_36px_rgba(15,23,42,0.28)] transition-all hover:scale-[1.06] hover:shadow-[0_24px_48px_rgba(15,23,42,0.32)]"
          >
            <Headphones className="size-5" />
            <span className="absolute -top-1 -right-1 inline-flex size-3 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <CsSheet
        open={open}
        onOpenChange={onOpenChange}
        spec={spec}
        onGroupCreated={onGroupCreated}
      />
    </>
  )
}
