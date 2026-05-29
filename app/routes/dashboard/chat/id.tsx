import * as React from "react"
import { Link, useParams } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { ArrowUp, MessageCircleOff, Sparkles, Users } from "lucide-react"
import { getChatById } from "~/components/page-kits/dashboard/chats/data"
import { useSidebarNav } from "~/components/page-kits/dashboard/sidebar-nav-context"
import { ProjectCard } from "~/components/page-kits/dashboard/chats/project-card"
import { CsFlyout } from "~/components/page-kits/dashboard/chats/cs-flyout"
import type { Route } from "./+types/id"

export function meta({ params }: Route.MetaArgs) {
  const chat = getChatById(params.id)
  return [
    { title: chat ? `爱开发 - ${chat.title}` : "爱开发 - 对话" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ]
}

type Stage = "intro" | "thinking" | "card" | "confirmed"

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="inline-flex max-w-fit items-center gap-2 rounded-2xl rounded-tl-md border border-border/50 bg-card px-4 py-3 shadow-sm"
    >
      <Sparkles className="size-3.5 text-primary" />
      <span className="text-xs text-muted-foreground">Jane 正在思考</span>
      <span className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block size-1 rounded-full bg-primary/70"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </span>
    </motion.div>
  )
}

export default function DashboardChatDetail() {
  const params = useParams()
  const chat = getChatById(params.id)
  const { setSubItem } = useSidebarNav()
  const [stage, setStage] = React.useState<Stage>("intro")
  const [csActive, setCsActive] = React.useState(false)
  const [csOpen, setCsOpen] = React.useState(false)
  const [groupName, setGroupName] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (chat) setSubItem(chat.title)
  }, [chat?.id, chat?.title, setSubItem])

  React.useEffect(() => {
    if (!chat?.spec) return
    setStage("intro")
    const t1 = setTimeout(() => setStage("thinking"), 1100)
    const t2 = setTimeout(() => setStage("card"), 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [chat?.id, chat?.spec])

  if (!chat) {
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <MessageCircleOff className="size-5" />
          </div>
          <div className="text-sm font-medium">未找到该对话</div>
          <Link
            to="/dashboard/chats"
            className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all hover:scale-[1.03]"
          >
            返回对话列表
          </Link>
        </motion.div>
      </main>
    )
  }

  const spec = chat.spec

  return (
    <main className="flex h-full min-h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 pb-32 md:p-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* First AI message — Jane's avatar position is the seamless transition target */}
          <div className="flex items-start gap-3">
            <img
              data-jane-anchor
              src="/assets/logo.png"
              alt="Jane"
              className="size-12 shrink-0 select-none object-contain drop-shadow-[0_8px_22px_rgba(99,102,241,0.18)] md:size-16"
              draggable={false}
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.35 }}
              className="flex min-w-0 max-w-xl flex-1 flex-col gap-1.5 rounded-2xl rounded-tl-md border border-border/50 bg-card px-4 py-3 shadow-sm"
            >
              <span className="text-[11px] font-medium text-primary">
                Jane · AI 需求分析师
              </span>
              <p className="text-sm leading-relaxed text-foreground/90 break-words">
                收到你的需求，我先帮你梳理一下核心模块、技术方案和大致预算，稍等～
              </p>
            </motion.div>
          </div>

          {/* Thinking + card progression (only when chat has a spec) */}
          {spec && (
            <div className="flex flex-col gap-6">
              <AnimatePresence mode="popLayout">
                {stage === "thinking" && (
                  <motion.div
                    key="thinking-row"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 pl-15 md:pl-19"
                  >
                    <ThinkingBubble />
                  </motion.div>
                )}
              </AnimatePresence>

              {(stage === "card" || stage === "confirmed") && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-start gap-3 pl-15 md:pl-19"
                >
                  <ProjectCard
                    spec={spec}
                    onConfirm={() => {
                      setStage("confirmed")
                      setCsActive(true)
                      setCsOpen(true)
                    }}
                  />
                </motion.div>
              )}

              {stage === "confirmed" && !groupName && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-[11px] text-muted-foreground"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  已确认需求，客服小张正在接入
                </motion.div>
              )}

              {groupName && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <Users className="size-3.5" />
                  已自动建群「{groupName}」，等待程序员接单
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.45 }}
        className="border-t border-border/60 bg-card/40 px-4 py-3 backdrop-blur md:px-6 md:py-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border/50 bg-card px-4 py-3 shadow-sm">
          <textarea
            rows={1}
            placeholder="继续补充你的需求…"
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            aria-label="发送"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-all hover:scale-105"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </motion.div>

      {spec && (
        <CsFlyout
          active={csActive}
          open={csOpen}
          onOpenChange={setCsOpen}
          spec={spec}
          onGroupCreated={(name) => setGroupName(name)}
        />
      )}
    </main>
  )
}
