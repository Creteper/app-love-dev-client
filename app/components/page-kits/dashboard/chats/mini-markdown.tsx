import * as React from "react"
import { cn } from "~/lib/utils"

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "p"; text: string }
  | { type: "blank" }

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let listBuf: string[] | null = null
  let paraBuf: string[] | null = null

  const flushList = () => {
    if (listBuf && listBuf.length > 0) blocks.push({ type: "ul", items: listBuf })
    listBuf = null
  }
  const flushPara = () => {
    if (paraBuf && paraBuf.length > 0)
      blocks.push({ type: "p", text: paraBuf.join(" ") })
    paraBuf = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flushList()
      flushPara()
      continue
    }
    let m: RegExpMatchArray | null
    if ((m = line.match(/^#{1}\s+(.+)$/))) {
      flushList()
      flushPara()
      blocks.push({ type: "h1", text: m[1] })
    } else if ((m = line.match(/^#{2}\s+(.+)$/))) {
      flushList()
      flushPara()
      blocks.push({ type: "h2", text: m[1] })
    } else if ((m = line.match(/^#{3}\s+(.+)$/))) {
      flushList()
      flushPara()
      blocks.push({ type: "h3", text: m[1] })
    } else if ((m = line.match(/^[-*]\s+(.+)$/))) {
      flushPara()
      if (!listBuf) listBuf = []
      listBuf.push(m[1])
    } else {
      flushList()
      if (!paraBuf) paraBuf = []
      paraBuf.push(line)
    }
  }
  flushList()
  flushPara()
  return blocks
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let i = 0
  let key = 0
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[2] !== undefined) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {m[2]}
        </strong>
      )
    } else if (m[3] !== undefined) {
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.78em] text-foreground"
        >
          {m[3]}
        </code>
      )
    }
    last = m.index + m[0].length
    i++
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export function MiniMarkdown({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  const blocks = React.useMemo(() => parseBlocks(source), [source])
  return (
    <div className={cn("flex flex-col gap-3 text-sm leading-relaxed", className)}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h1":
            return (
              <h2
                key={i}
                className="mt-2 text-base font-semibold tracking-tight text-foreground first:mt-0"
              >
                {renderInline(b.text)}
              </h2>
            )
          case "h2":
            return (
              <h3
                key={i}
                className="mt-1 text-sm font-semibold tracking-tight text-foreground"
              >
                {renderInline(b.text)}
              </h3>
            )
          case "h3":
            return (
              <h4
                key={i}
                className="text-xs font-semibold tracking-tight text-muted-foreground uppercase"
              >
                {renderInline(b.text)}
              </h4>
            )
          case "ul":
            return (
              <ul key={i} className="flex flex-col gap-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-foreground/85"
                  >
                    <span className="mt-[0.55em] inline-block size-1 shrink-0 rounded-full bg-primary/60" />
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ul>
            )
          case "p":
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/85">
                {renderInline(b.text)}
              </p>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
