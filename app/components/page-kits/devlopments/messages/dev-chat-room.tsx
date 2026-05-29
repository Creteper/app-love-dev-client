import * as React from "react"
import {
  ChatHeader,
  MessageList,
  MessageInput,
  messagesByGroup,
  appendDeliverable,
  type Deliverable,
  type DeliverableFile,
  type Group,
  type MessageItem,
  type ProgressReport,
} from "~/components/page-kits/dashboard/messages"
import { AVATAR_BY_ROLE } from "~/components/page-kits/dashboard/messages/data"
import { TodayDeliveryBanner } from "./today-delivery-banner"
import { DevProgressComposer } from "./dev-progress-composer"
import { DevDeliverableComposer } from "./dev-deliverable-composer"

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

function todayLabel() {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const DEV_NAME = "你（开发者）"

export function DevChatRoom({ group }: { group: Group }) {
  const initial = messagesByGroup[group.id] ?? []
  const [messages, setMessages] = React.useState<MessageItem[]>(initial)
  const [composerOpen, setComposerOpen] = React.useState(false)
  const [deliverableOpen, setDeliverableOpen] = React.useState(false)

  React.useEffect(() => {
    setMessages(messagesByGroup[group.id] ?? [])
    setComposerOpen(false)
    setDeliverableOpen(false)
  }, [group.id])

  // The most recent acceptance-pass phase, used to label the deliverable dialog.
  const latestAcceptancePhase = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m.content.kind === "acceptance-pass") return m.content.phase
    }
    return undefined
  }, [messages])

  function appendAsDev(content: MessageItem["content"]) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${group.id}-${prev.length + 1}-${Date.now()}`,
        authorName: DEV_NAME,
        authorRole: "dev",
        authorInitial: "我",
        authorAvatar: AVATAR_BY_ROLE.dev,
        authorTint: group.tint,
        time: nowTime(),
        content,
      },
    ])
  }

  function sendReport(report: ProgressReport) {
    appendAsDev({ kind: "progress-report", report })
    setComposerOpen(false)
  }

  function sendDeliverable(files: DeliverableFile[], note?: string) {
    if (!files.length) return
    appendAsDev({ kind: "deliverable", files, note })
    const record: Deliverable = {
      id: `dlv-${Date.now()}`,
      groupId: group.id,
      uploadedBy: DEV_NAME,
      time: "刚刚",
      files,
      note,
    }
    appendDeliverable(record)
    setDeliverableOpen(false)
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <ChatHeader group={group} />
      <TodayDeliveryBanner
        group={group}
        onCompose={() => setComposerOpen(true)}
      />
      <MessageList
        messages={messages}
        meRole="dev"
        readOnly
        onUploadDeliverable={() => setDeliverableOpen(true)}
      />
      <MessageInput
        onSendText={(text) => appendAsDev({ kind: "text", text })}
        onSendImage={(src, caption) =>
          appendAsDev({ kind: "image", src, caption })
        }
      />
      <DevProgressComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        defaultDate={todayLabel()}
        defaultTitle={`${todayLabel()} 进度回报`}
        onSubmit={sendReport}
      />
      <DevDeliverableComposer
        open={deliverableOpen}
        onOpenChange={setDeliverableOpen}
        phase={latestAcceptancePhase}
        onSubmit={sendDeliverable}
      />
    </div>
  )
}
