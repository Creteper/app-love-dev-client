import * as React from "react"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { messagesByGroup, type Group, type MessageItem } from "./data"

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}

export function ChatRoom({ group }: { group: Group }) {
  const initial = messagesByGroup[group.id] ?? []
  const [messages, setMessages] = React.useState<MessageItem[]>(initial)

  React.useEffect(() => {
    setMessages(messagesByGroup[group.id] ?? [])
  }, [group.id])

  function appendMessage(content: MessageItem["content"]) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${group.id}-${prev.length + 1}-${Date.now()}`,
        authorName: "你",
        authorRole: "client",
        authorInitial: "我",
        authorTint: "violet",
        time: nowTime(),
        content,
      },
    ])
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <ChatHeader group={group} />
      <MessageList
        messages={messages}
        onReview={(reportDate, feedback) =>
          appendMessage({
            kind: "progress-review",
            reportDate,
            feedback: feedback || undefined,
          })
        }
      />
      <MessageInput
        onSendText={(text) => appendMessage({ kind: "text", text })}
        onSendImage={(src, caption) => appendMessage({ kind: "image", src, caption })}
      />
    </div>
  )
}