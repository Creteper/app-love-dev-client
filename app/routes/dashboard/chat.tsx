import * as React from "react"
import gsap from "gsap"
import { Outlet, useNavigate, useOutlet } from "react-router"
import {
  ArrowUp,
  BarChart3,
  Lightbulb,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from "lucide-react"
import { useSidebarNav } from "~/components/page-kits/dashboard/sidebar-nav-context"
import type { Route } from "./+types/chat"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 对话" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ]
}

const TITLE_SEGMENTS = [
  { text: "输入您的需求 ", primary: false },
  { text: "Jane", primary: true },
  { text: " 帮您分析", primary: false },
] as const

const PLACEHOLDER_WORDS = [
  "输入您的需求",
  "我需要一个电商网站",
  "帮我做一个餐厅点餐系统",
  "想开发一个企业官网，要求支持多语言",
  "搭建一个数据分析后台",
]

const SUGGESTIONS = [
  { icon: ShoppingBag, label: "做一个电商小程序" },
  { icon: Smartphone, label: "餐厅点餐 + 厨房打印" },
  { icon: BarChart3, label: "搭建一个数据分析后台" },
  { icon: Lightbulb, label: "我有点子，但不知道怎么落地" },
]

function useTypewriterPlaceholder(words: readonly string[]) {
  const [text, setText] = React.useState("")

  React.useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let wordIndex = 0
    let progress = 0
    let phase: "typing" | "hold-full" | "deleting" | "hold-empty" = "typing"

    function tick() {
      if (cancelled) return
      const target = words[wordIndex]
      let delay = 70

      if (phase === "typing") {
        progress++
        setText(target.slice(0, progress))
        if (progress >= target.length) {
          phase = "hold-full"
          delay = 1800
        } else {
          delay = 75 + Math.random() * 50
        }
      } else if (phase === "hold-full") {
        phase = "deleting"
        delay = 40
      } else if (phase === "deleting") {
        progress--
        setText(target.slice(0, Math.max(progress, 0)))
        if (progress <= 0) {
          phase = "hold-empty"
          delay = 320
        } else {
          delay = 30
        }
      } else {
        wordIndex = (wordIndex + 1) % words.length
        progress = 0
        phase = "typing"
        delay = 80
      }

      timer = setTimeout(tick, delay)
    }

    timer = setTimeout(tick, 900)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [words])

  return text
}

function ChatHome() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const avatarRef = React.useRef<HTMLDivElement>(null)
  const avatarImgRef = React.useRef<HTMLImageElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const cursorRef = React.useRef<HTMLSpanElement>(null)
  const subtitleRef = React.useRef<HTMLParagraphElement>(null)
  const tagRef = React.useRef<HTMLSpanElement>(null)
  const titleGroupRef = React.useRef<HTMLDivElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  const hintRef = React.useRef<HTMLParagraphElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = React.useState("")
  const [isExiting, setIsExiting] = React.useState(false)
  const placeholder = useTypewriterPlaceholder(PLACEHOLDER_WORDS)
  const navigate = useNavigate()
  const { skipNextLoadingRef } = useSidebarNav()

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const chars =
        titleRef.current?.querySelectorAll<HTMLSpanElement>("span[data-char]")
      const cursor = cursorRef.current
      const tag = tagRef.current
      const subtitle = subtitleRef.current
      const form = formRef.current
      const suggestions =
        suggestionsRef.current?.querySelectorAll<HTMLButtonElement>(":scope > button")

      const avatar = avatarRef.current
      const hint = hintRef.current

      if (tag) gsap.set(tag, { opacity: 0, y: -6 })
      if (chars) gsap.set(chars, { opacity: 0, y: 12 })
      if (cursor) gsap.set(cursor, { opacity: 0 })
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 8 })
      if (form) gsap.set(form, { opacity: 0, y: 24, scale: 0.97 })
      if (avatar) gsap.set(avatar, { opacity: 0, scale: 0.6, y: 12 })
      if (suggestions) gsap.set(suggestions, { opacity: 0, y: 10 })
      if (hint) gsap.set(hint, { opacity: 0, y: 6 })

      const tl = gsap.timeline({ delay: 0.15 })

      if (tag) {
        tl.to(tag, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        })
      }

      if (chars && chars.length > 0) {
        tl.to(
          chars,
          {
            opacity: 1,
            y: 0,
            duration: 0.04,
            stagger: 0.065,
            ease: "power2.out",
          },
          "-=0.2"
        )
      }

      if (cursor) {
        tl.to(
          cursor,
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(cursor, {
                opacity: 0,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
              })
            },
          },
          "-=0.05"
        )
      }

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.15"
        )
      }

      if (form) {
        tl.to(
          form,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.2"
        )
      }

      if (avatar) {
        tl.to(
          avatar,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: "back.out(1.7)",
          },
          "-=0.25"
        )
      }

      if (suggestions && suggestions.length > 0) {
        tl.to(
          suggestions,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.3"
        )
      }

      if (hint) {
        tl.to(
          hint,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.25"
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  function renderTitleChars() {
    let charIndex = 0
    return TITLE_SEGMENTS.map((seg, si) => (
      <span
        key={si}
        className={seg.primary ? "text-primary" : undefined}
      >
        {Array.from(seg.text).map((ch) => {
          const i = charIndex++
          return (
            <span
              key={i}
              data-char
              className="inline-block whitespace-pre"
            >
              {ch === " " ? " " : ch}
            </span>
          )
        })}
      </span>
    ))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || isExiting) return

    const img = avatarImgRef.current
    const form = formRef.current
    const titleGroup = titleGroupRef.current
    const suggestions = suggestionsRef.current
    const hint = hintRef.current
    const contentArea = document.querySelector<HTMLElement>("[data-content-area]")

    const targetId = "ecom-miniapp"

    if (!img || !contentArea) {
      skipNextLoadingRef.current = true
      navigate(`/dashboard/chats/${targetId}`)
      return
    }

    setIsExiting(true)

    const srcRect = img.getBoundingClientRect()
    const contentRect = contentArea.getBoundingClientRect()

    // Detail page layout: <main class="p-6"> wrapped by <div class="mx-auto max-w-3xl">
    // Jane image is size-16 (64px). Compute the on-screen top-left where it lands.
    const INNER_MAX_WIDTH = 768 // max-w-3xl
    const PADDING = 24 // p-6
    const TARGET_SIZE = 64 // size-16

    const innerWidth = Math.min(contentRect.width - PADDING * 2, INNER_MAX_WIDTH)
    const innerLeft =
      contentRect.left + (contentRect.width - innerWidth) / 2
    const targetLeft = innerLeft
    const targetTop = contentRect.top + PADDING

    const tl = gsap.timeline({
      onComplete: () => {
        skipNextLoadingRef.current = true
        navigate(`/dashboard/chats/${targetId}`)
      },
    })

    if (titleGroup) {
      tl.to(
        titleGroup,
        { y: -60, opacity: 0, duration: 0.45, ease: "power2.in" },
        0
      )
    }

    const bottomTargets: HTMLElement[] = [form, suggestions, hint].filter(
      (el): el is NonNullable<typeof el> => !!el
    )
    if (bottomTargets.length > 0) {
      tl.to(
        bottomTargets,
        {
          y: 80,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
          stagger: 0.04,
        },
        0
      )
    }

    tl.set(
      img,
      {
        position: "fixed",
        left: srcRect.left,
        top: srcRect.top,
        width: srcRect.width,
        height: srcRect.height,
        margin: 0,
        zIndex: 60,
      },
      0
    )
    tl.to(
      img,
      {
        left: targetLeft,
        top: targetTop,
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        duration: 0.7,
        ease: "power3.inOut",
      },
      0
    )
  }

  function pickSuggestion(label: string) {
    setValue(label)
    textareaRef.current?.focus()
  }

  return (
    <main
      ref={containerRef}
      className="relative flex h-full min-h-full items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex w-full max-w-2xl flex-col items-center gap-8">
        <div
          ref={titleGroupRef}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span
            ref={tagRef}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary"
          >
            <Sparkles className="size-3" />
            AI 需求分析师 · Jane
          </span>
          <h1
            ref={titleRef}
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            {renderTitleChars()}
            <span
              ref={cursorRef}
              aria-hidden
              className="ml-1 inline-block h-[0.9em] w-[2px] translate-y-[0.12em] bg-primary align-middle"
            />
          </h1>
          <p
            ref={subtitleRef}
            className="max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            一句话描述您的想法，Jane 会帮您梳理功能、拆解需求，并匹配合适的开发者。
          </p>
        </div>

        <div className="relative w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute right-3 bottom-full z-10 translate-y-7 sm:right-6"
          >
            <div
              ref={avatarRef}
              className="relative flex items-end justify-center"
            >
              <img
                ref={avatarImgRef}
                src="/assets/logo.png"
                alt="Jane"
                className="size-24 select-none object-contain drop-shadow-[0_10px_22px_rgba(99,102,241,0.22)] md:size-28"
                draggable={false}
              />
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="group relative w-full rounded-3xl border border-border/50 bg-card shadow-sm transition-all focus-within:border-foreground/40 focus-within:shadow-md"
          >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
            rows={3}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            aria-label="发送"
            className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-all hover:scale-105 hover:shadow-md disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-sm"
          >
            <ArrowUp className="size-4" />
          </button>
          </form>
        </div>

        <div
          ref={suggestionsRef}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => pickSuggestion(s.label)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground"
            >
              <s.icon className="size-3.5 text-muted-foreground/70 transition-colors group-hover:text-foreground/80" />
              {s.label}
            </button>
          ))}
        </div>

        <p
          ref={hintRef}
          className="text-[11px] text-muted-foreground/70"
        >
          按 Enter 发送，Shift + Enter 换行
        </p>
      </div>
    </main>
  )
}

export default function DashBoardChat() {
  const outlet = useOutlet()

  if (outlet) {
    return (
      <div className="flex h-full min-h-full flex-col">
        <Outlet />
      </div>
    )
  }

  return <ChatHome />
}