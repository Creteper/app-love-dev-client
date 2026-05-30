"use client"

import {
  MessageList,
  MessageInput,
  type MessageItem,
} from "~/components/page-kits/dashboard/messages"

type Props = {
  messages: MessageItem[]
  onSendText: (text: string) => void
}

export function CsPendingChat({ messages, onSendText }: Props) {
  return (
    <div className="flex h-full flex-col bg-muted/20">
      <MessageList messages={messages} meRole="cs" readOnly />
      <MessageInput
        onSendText={onSendText}
        onSendImage={() => {
          /* image attachments disabled in pending */
        }}
      />
    </div>
  )
}
