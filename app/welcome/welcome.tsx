import * as React from "react"
import gsap from "gsap"
import LiquidChrome from "~/components/kits/liquid-chrome"
import { GlassButton } from "~/components/apple-tahoe-liquid-glass-button"
import { EmojiBurst, type EmojiBurstHandle } from "~/components/kits/emoji-burst"

export function Welcome() {
  const rootRef = React.useRef<HTMLElement>(null)
  const logoRef = React.useRef<HTMLDivElement>(null)
  const taglineRef = React.useRef<HTMLParagraphElement>(null)
  const badgeRef = React.useRef<HTMLDivElement>(null)
  const ctaWrapRef = React.useRef<HTMLDivElement>(null)
  const ctaBtnRef = React.useRef<HTMLButtonElement>(null)
  const subCtaRef = React.useRef<HTMLDivElement>(null)
  const displayRef = React.useRef<HTMLDivElement>(null)
  const sparkleRef = React.useRef<HTMLDivElement>(null)
  const burstRef = React.useRef<EmojiBurstHandle>(null)

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          badgeRef.current,
          logoRef.current,
          taglineRef.current,
          ctaWrapRef.current,
          subCtaRef.current,
          displayRef.current,
        ],
        { opacity: 0 }
      )

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        badgeRef.current,
        { y: -24, scale: 0.8 },
        { y: 0, scale: 1, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          logoRef.current,
          { y: -40, scale: 0.85 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.55)",
          },
          "-=0.25"
        )
        .fromTo(
          taglineRef.current,
          { y: 18 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.35"
        )
        .fromTo(
          ctaWrapRef.current,
          { y: 18, scale: 0.85 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2)",
            onStart: () => {
              const btn = ctaBtnRef.current
              if (btn && burstRef.current) {
                const r = btn.getBoundingClientRect()
                const cx = r.left + r.width / 2
                const cy = r.top + r.height / 2
                burstRef.current.cascade(cx, cy, {
                  bursts: 6,
                  spread: 260,
                  count: 28,
                })
              }
            },
          },
          "-=0.1"
        )
        .fromTo(
          subCtaRef.current,
          { y: 12 },
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.2"
        )
        .fromTo(
          displayRef.current,
          { y: 80 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
          "-=0.5"
        )

      const sparkleEl = sparkleRef.current
      if (sparkleEl) {
        const dots = sparkleEl.querySelectorAll<HTMLElement>("[data-sparkle]")
        dots.forEach((d, i) => {
          gsap.to(d, {
            y: "+=14",
            x: i % 2 === 0 ? "+=8" : "-=8",
            duration: 2.2 + (i % 3) * 0.4,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.2,
          })
          gsap.to(d, {
            opacity: 0.4,
            duration: 1.6 + (i % 2) * 0.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.15,
          })
        })
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!burstRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    burstRef.current.cascade(cx, cy, { bursts: 8, spread: 320, count: 36 })
  }

  return (
    <main
      ref={rootRef}
      className="w-full h-screen relative overflow-hidden overflow-x-hidden"
    >
      <LiquidChrome
        baseColor={[0.1, 0.1, 0.1]}
        speed={0.3}
        amplitude={0.3}
        interactive
      />

      <EmojiBurst ref={burstRef} />

      {/* Floating sparkles */}
      <div
        ref={sparkleRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
      >
        {Array.from({ length: 14 }).map((_, i) => {
          const left = (i * 71) % 100
          const top = ((i * 137) % 80) + 5
          const size = 6 + (i % 4) * 3
          return (
            <span
              key={i}
              data-sparkle
              className="absolute block rounded-full bg-white/70 blur-[1px]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                opacity: 0.8,
              }}
            />
          )
        })}
      </div>

      {/* Top badge */}
      <div
        ref={badgeRef}
        className="absolute top-24 left-1/2 z-30 -translate-x-1/2"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
          <span className="inline-flex size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          全新一代 · AI 驱动接单平台
        </span>
      </div>

      {/* Logo + tagline */}
      <div
        ref={logoRef}
        className="absolute top-36 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center"
      >
        <img
          src="./assets/logo-text.png"
          alt="爱开发"
          className="h-16 drop-shadow-[0_8px_24px_rgba(255,255,255,0.25)]"
        />
        <p
          ref={taglineRef}
          className="mt-3 text-sm tracking-wide text-white/85"
        >
          确认只是开始，交付不等于结束
        </p>
      </div>

      {/* CTA */}
      <div
        ref={ctaWrapRef}
        className="absolute top-64 w-full justify-center z-30 flex gap-4"
      >
        <GlassButton
          ref={ctaBtnRef}
          onClick={handleCtaClick}
          className="text-background! backdrop-blur-2xl"
        >
          告诉我需求
        </GlassButton>
        <GlassButton
          ref={ctaBtnRef}
          onClick={handleCtaClick}
          className="text-background! backdrop-blur-2xl"
        >
          成为开发者
        </GlassButton>
      </div>

      <div
        ref={subCtaRef}
        className="absolute top-80 w-full justify-center z-30 mt-4 flex items-center gap-3 text-[11px] text-white/70"
      >
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-white/60" />
          AI 拆解需求
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-white/60" />
          平台资金托管
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-1 rounded-full bg-white/60" />
          按工期日结
        </span>
      </div>

      {/* Bottom display image (desktop only — natural ratio, never squeezed) */}
      <div
        ref={displayRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden md:block"
      >
        <div className="relative mx-auto h-[60vh] w-full">
          <img
            src="./assets/display-container.png"
            alt=""
            className="absolute left-1/2 -bottom-40 h-[80vh] w-auto max-w-none -translate-x-1/2 select-none"
          />
        </div>
      </div>
    </main>
  )
}
