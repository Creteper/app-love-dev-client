import * as React from "react"
import { motion } from "motion/react"
import { ImagePlus, Smile, SendHorizonal } from "lucide-react"

type Props = {
  onSendText: (text: string) => void
  onSendImage: (src: string, caption?: string) => void
}

export function MessageInput({ onSendText, onSendImage }: Props) {
  const [value, setValue] = React.useState("")
  const fileRef = React.useRef<HTMLInputElement>(null)

  function send() {
    const t = value.trim()
    if (!t) return
    onSendText(t)
    setValue("")
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onSendImage(reader.result, file.name)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      className="border-t border-border/60 bg-card/40 px-4 py-3 backdrop-blur md:px-6 md:py-4"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border/50 bg-background p-2 shadow-sm focus-within:border-border">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="发送图片"
        >
          <ImagePlus className="size-4" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

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
          placeholder="说点什么…  Enter 发送，Shift+Enter 换行"
          className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
        />

        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="表情"
        >
          <Smile className="size-4" />
        </button>

        <button
          type="button"
          onClick={send}
          disabled={!value.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all hover:scale-[1.04] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:hover:scale-100"
          aria-label="发送"
        >
          <SendHorizonal className="size-4" />
        </button>
      </div>
    </motion.div>
  )
}