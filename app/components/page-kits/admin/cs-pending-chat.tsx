"use client"

import * as React from "react"
import {
  MessageList,
  MessageInput,
  type MessageItem,
} from "~/components/page-kits/dashboard/messages"
import { AVATAR_BY_ROLE } from "~/components/page-kits/dashboard/messages/data"
import type {
  AssignedClient,
  PendingMessage,
  PendingSpec,
} from "~/components/page-kits/admin/data"

function nowTime() {
  const d = new Date()
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

function pendingToMessage(
  m: PendingMessage,
  client: AssignedClient,
  csName: string
): MessageItem {
  if (m.author === "cs") {
    return {
      id: m.id,
      authorName: csName,
      authorRole: "cs",
      authorInitial: "客",
      authorAvatar: AVATAR_BY_ROLE.cs,
      authorTint: "blue",
      time: m.time,
      content: { kind: "text", text: m.text },
    }
  }
  return {
    id: m.id,
    authorName: client.client,
    authorRole: "client",
    authorInitial: client.client.slice(0, 1) || "客",
    authorAvatar: AVATAR_BY_ROLE.client,
    authorTint: "violet",
    time: m.time,
    content: { kind: "text", text: m.text },
  }
}

type Props = {
  client: AssignedClient
  csName: string
  initialMessages: PendingMessage[]
  /** When the cs sends a confirmation invoice this is appended into the chat as a special card. */
  confirmedSpec?: PendingSpec
  onSendText: (text: string) => void
}

export function CsPendingChat({
  client,
  csName,
  initialMessages,
  confirmedSpec,
  onSendText,
}: Props) {
  const messages = React.useMemo<MessageItem[]>(() => {
    const list = initialMessages.map((m) => pendingToMessage(m, client, csName))
    if (confirmedSpec) {
      list.push({
        id: `${client.id}-cs-confirm`,
        authorName: csName,
        authorRole: "cs",
        authorInitial: "客",
        authorAvatar: AVATAR_BY_ROLE.cs,
        authorTint: "blue",
        time: nowTime(),
        content: {
          kind: "text",
          text:
            `📄 已发送终版需求确认单\n\n` +
            `项目：${confirmedSpec.projectName}\n` +
            `等级：${confirmedSpec.level} 级\n` +
            `最终价：${confirmedSpec.estimatedPrice}\n` +
            `工期：${confirmedSpec.estimatedDuration}\n\n` +
            `客户确认后系统将自动建群并按等级匹配开发者。`,
        },
      })
    }
    return list
  }, [client, csName, initialMessages, confirmedSpec])

  return (
    <div className="flex h-full flex-col bg-muted/20">
      <MessageList messages={messages} meRole="cs" readOnly />
      <MessageInput
        onSendText={onSendText}
        onSendImage={() => {
          /* no image attachments in pending */
        }}
      />
    </div>
  )
}
