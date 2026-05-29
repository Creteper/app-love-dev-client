import * as React from "react"
import { motion } from "motion/react"
import { MessageBubble } from "./message-bubble"
import type { MessageItem } from "./data"

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
}

type Props = {
  messages: MessageItem[]
  onReview?: (reportDate: string, feedback: string) => void
  /** Triggered when the viewer requests to upload deliverables (dev side). */
  onUploadDeliverable?: () => void
  /** Whose perspective to render the chat from. Default: "client" */
  meRole?: MessageItem["authorRole"]
  /** When true, hides reviewer-only actions. Default: false */
  readOnly?: boolean
}

export function MessageList({
  messages,
  onReview,
  onUploadDeliverable,
  meRole = "client",
  readOnly = false,
}: Props) {
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto">
      <motion.div
        key={messages.length}
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6"
      >
        {messages.map((m, i) => {
          const prev = messages[i - 1]
          const showDate = m.date && (!prev || prev.date !== m.date)
          return (
            <React.Fragment key={m.id}>
              {showDate && (
                <div className="flex items-center justify-center py-2">
                  <span className="rounded-full bg-muted/60 px-3 py-1 text-[11px] text-muted-foreground">
                    {m.date}
                  </span>
                </div>
              )}
              <MessageBubble
                msg={m}
                onReview={onReview}
                onUploadDeliverable={onUploadDeliverable}
                meRole={meRole}
                readOnly={readOnly}
              />
            </React.Fragment>
          )
        })}
        <div ref={endRef} />
      </motion.div>
    </div>
  )
}
