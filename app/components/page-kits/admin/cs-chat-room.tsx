"use client"

import * as React from "react"
import {
  ChatHeader,
  MessageList,
  MessageInput,
  messagesByGroup,
  type Group,
  type MessageItem,
} from "~/components/page-kits/dashboard/messages"
import { AVATAR_BY_ROLE } from "~/components/page-kits/dashboard/messages/data"

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export function CsChatRoom({
  group,
  csName,
}: {
  group: Group
  csName: string
}) {
  const initial = messagesByGroup[group.id] ?? []
  const [messages, setMessages] = React.useState<MessageItem[]>(initial)

  React.useEffect(() => {
    setMessages(messagesByGroup[group.id] ?? [])
  }, [group.id])

  function appendAsCs(content: MessageItem["content"]) {
    setMessages((prev) => [
      ...prev,
      {
        id: `${group.id}-${prev.length + 1}-${Date.now()}`,
        authorName: csName,
        authorRole: "cs",
        authorInitial: "客",
        authorAvatar: AVATAR_BY_ROLE.cs,
        authorTint: "blue",
        time: nowTime(),
        content,
      },
    ])
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <ChatHeader group={group} />
      <MessageList messages={messages} meRole="cs" readOnly />
      <MessageInput
        onSendText={(text) => appendAsCs({ kind: "text", text })}
        onSendImage={(src, caption) =>
          appendAsCs({ kind: "image", src, caption })
        }
      />
    </div>
  )
}
