import * as React from "react"
import gsap from "gsap"
import { Check } from "lucide-react"
import { confettiEmojis } from "./shared"

type SuccessViewProps = {
  amount: number
  onClose: () => void
  /** Heading text, default "充值成功" */
  title?: string
  /** Helper text under the amount, default "已到账可用余额 · 可立即用于新项目托管" */
  hint?: string
  /** Sign shown before the amount, default "+" */
  sign?: "+" | "-"
}

export function SuccessView({
  amount,
  onClose,
  title = "充值成功",
  hint = "已到账可用余额 · 可立即用于新项目托管",
  sign = "+",
}: SuccessViewProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const confettiRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    const layer = confettiRef.current
    if (!root || !layer) return

    const ctx = gsap.context(() => {
      gsap.from(".success-check", {
        scale: 0,
        rotate: -180,
        duration: 0.6,
        ease: "back.out(1.8)",
      })
      gsap.from(".success-title", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        delay: 0.2,
        ease: "power2.out",
      })
      gsap.from(".success-amount", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        delay: 0.3,
        ease: "power2.out",
      })
      gsap.from(".success-hint", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        delay: 0.4,
        ease: "power2.out",
      })
      gsap.from(".success-cta", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        delay: 0.55,
        ease: "power2.out",
      })

      // Confetti burst
      const pieces = layer.querySelectorAll<HTMLSpanElement>(".confetti-piece")
      pieces.forEach((el) => {
        const angle = gsap.utils.random(-Math.PI, Math.PI)
        const distance = gsap.utils.random(140, 280)
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance - gsap.utils.random(40, 120)
        const rot = gsap.utils.random(-540, 540)
        const scale = gsap.utils.random(0.7, 1.4)
        const dur = gsap.utils.random(0.9, 1.4)

        gsap.set(el, { x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 })
        gsap.to(el, {
          x,
          y,
          rotate: rot,
          scale,
          duration: dur,
          ease: "power2.out",
          delay: gsap.utils.random(0, 0.15),
        })
        gsap.to(el, {
          opacity: 0,
          duration: 0.5,
          delay: dur * 0.6,
          ease: "power1.in",
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col items-center justify-center gap-3 px-6 py-10 text-center"
    >
      <div
        ref={confettiRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="confetti-piece absolute text-2xl select-none"
            style={{ willChange: "transform" }}
          >
            {confettiEmojis[i % confettiEmojis.length]}
          </span>
        ))}
      </div>

      <div className="success-check relative z-10 flex size-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <Check className="size-8" strokeWidth={3} />
      </div>

      <h2 className="success-title relative z-10 text-xl font-semibold tracking-tight">
        {title}
      </h2>

      <div className="success-amount relative z-10 flex items-baseline gap-1">
        <span className="text-sm text-muted-foreground">{sign}</span>
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          ¥{amount.toLocaleString("zh-CN")}
        </span>
      </div>

      <p className="success-hint relative z-10 text-xs text-muted-foreground">
        {hint}
      </p>

      <button
        onClick={onClose}
        className="success-cta relative z-10 mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
      >
        <Check className="size-4" />
        完成
      </button>
    </div>
  )
}