import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "~/lib/utils"
import { categories, type CategoryTone } from "./data"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const toneIcon: Record<CategoryTone, string> = {
  sky: "bg-sky-500/12 text-sky-600 ring-1 ring-sky-500/20 group-hover:bg-sky-500/22 group-hover:ring-sky-500/35 dark:text-sky-300",
  violet:
    "bg-violet-500/12 text-violet-600 ring-1 ring-violet-500/20 group-hover:bg-violet-500/22 group-hover:ring-violet-500/35 dark:text-violet-300",
  emerald:
    "bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 group-hover:bg-emerald-500/22 group-hover:ring-emerald-500/35 dark:text-emerald-300",
  rose: "bg-rose-500/12 text-rose-600 ring-1 ring-rose-500/20 group-hover:bg-rose-500/22 group-hover:ring-rose-500/35 dark:text-rose-300",
  amber:
    "bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/20 group-hover:bg-amber-500/22 group-hover:ring-amber-500/35 dark:text-amber-300",
  teal: "bg-teal-500/12 text-teal-600 ring-1 ring-teal-500/20 group-hover:bg-teal-500/22 group-hover:ring-teal-500/35 dark:text-teal-300",
  indigo:
    "bg-indigo-500/12 text-indigo-600 ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/22 group-hover:ring-indigo-500/35 dark:text-indigo-300",
  slate:
    "bg-slate-500/12 text-slate-600 ring-1 ring-slate-500/20 group-hover:bg-slate-500/22 group-hover:ring-slate-500/35 dark:text-slate-300",
}

const toneCount: Record<CategoryTone, string> = {
  sky: "text-sky-600/80 dark:text-sky-300/80",
  violet: "text-violet-600/80 dark:text-violet-300/80",
  emerald: "text-emerald-600/80 dark:text-emerald-300/80",
  rose: "text-rose-600/80 dark:text-rose-300/80",
  amber: "text-amber-700/80 dark:text-amber-300/80",
  teal: "text-teal-600/80 dark:text-teal-300/80",
  indigo: "text-indigo-600/80 dark:text-indigo-300/80",
  slate: "text-slate-600/80 dark:text-slate-300/80",
}

const toneGlow: Record<CategoryTone, string> = {
  sky: "radial-gradient(70% 60% at 30% 10%, oklch(0.78 0.13 230 / 0.22), transparent 70%)",
  violet:
    "radial-gradient(70% 60% at 30% 10%, oklch(0.72 0.18 290 / 0.22), transparent 70%)",
  emerald:
    "radial-gradient(70% 60% at 30% 10%, oklch(0.74 0.15 160 / 0.22), transparent 70%)",
  rose: "radial-gradient(70% 60% at 30% 10%, oklch(0.74 0.16 18 / 0.22), transparent 70%)",
  amber:
    "radial-gradient(70% 60% at 30% 10%, oklch(0.80 0.15 75 / 0.24), transparent 70%)",
  teal: "radial-gradient(70% 60% at 30% 10%, oklch(0.74 0.13 195 / 0.22), transparent 70%)",
  indigo:
    "radial-gradient(70% 60% at 30% 10%, oklch(0.66 0.18 270 / 0.22), transparent 70%)",
  slate:
    "radial-gradient(70% 60% at 30% 10%, oklch(0.70 0.04 260 / 0.18), transparent 70%)",
}

const toneAccent: Record<CategoryTone, string> = {
  sky: "from-sky-400/50",
  violet: "from-violet-400/50",
  emerald: "from-emerald-400/50",
  rose: "from-rose-400/50",
  amber: "from-amber-400/50",
  teal: "from-teal-400/50",
  indigo: "from-indigo-400/50",
  slate: "from-slate-400/40",
}

export function CategoryGrid() {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    (_ctx, contextSafe) => {
      const mm = gsap.matchMedia()
      const cleanups: Array<() => void> = []

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cat-header", {
          y: 18,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        })

        gsap.set(".cat-card", { y: 28, autoAlpha: 0, filter: "blur(6px)" })

        ScrollTrigger.batch(".cat-card", {
          start: "top 90%",
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.06,
              clearProps: "filter",
            }),
        })

        if (!contextSafe) return
        const cards = gsap.utils.toArray<HTMLElement>(".cat-card")
        const onMove = contextSafe((e: PointerEvent) => {
          const card = e.currentTarget as HTMLElement
          const rect = card.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width - 0.5
          const py = (e.clientY - rect.top) / rect.height - 0.5
          gsap.to(card, {
            rotateY: px * 8,
            rotateX: -py * 8,
            y: -3,
            duration: 0.35,
            ease: "power2.out",
            transformPerspective: 600,
            transformOrigin: "center",
          })
        }) as unknown as (e: PointerEvent) => void

        const onLeave = contextSafe((e: PointerEvent) => {
          const card = e.currentTarget as HTMLElement
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          })
        }) as unknown as (e: PointerEvent) => void

        cards.forEach((card) => {
          card.addEventListener("pointermove", onMove)
          card.addEventListener("pointerleave", onLeave)
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove)
            card.removeEventListener("pointerleave", onLeave)
          })
        })
      })

      return () => {
        cleanups.forEach((fn) => fn())
        mm.revert()
      }
    },
    { scope: ref }
  )

  return (
    <section ref={ref} aria-label="分类" className="space-y-4">
      <header className="cat-header flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">分类浏览</h2>
          <p className="text-sm text-muted-foreground">
            按你最擅长的方向筛选，获得更精准的接单匹配。
          </p>
        </div>
        <a
          href="#"
          className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground md:inline"
        >
          全部分类 →
        </a>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((c) => {
          const Icon = c.icon
          return (
            <li key={c.id}>
              <a
                href="#"
                className="cat-card group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm transition-[border-color,box-shadow] hover:border-border hover:shadow-[0_18px_40px_-22px_oklch(0.4_0.1_280/0.45)] [transform-style:preserve-3d] will-change-transform"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: toneGlow[c.tone] }}
                />
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100",
                    toneAccent[c.tone]
                  )}
                />
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl transition-colors",
                      toneIcon[c.tone]
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium tabular-nums transition-colors",
                      toneCount[c.tone]
                    )}
                  >
                    {c.count} 单
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-medium tracking-tight">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
