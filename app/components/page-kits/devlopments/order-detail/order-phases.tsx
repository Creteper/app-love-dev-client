import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "~/lib/utils"
import type { OrderPhase } from "../data"

gsap.registerPlugin(useGSAP)

type Variant = "primary" | "secondary"

const variantStyle: Record<
  Variant,
  {
    glow: string
    accent: string
    index: string
    bullet: string
  }
> = {
  primary: {
    glow: "radial-gradient(70% 60% at 30% 10%, oklch(0.72 0.18 290 / 0.16), transparent 70%)",
    accent: "from-violet-400/50",
    index:
      "bg-violet-500/12 text-violet-600 ring-1 ring-violet-500/20 dark:text-violet-300",
    bullet: "bg-violet-500/70",
  },
  secondary: {
    glow: "radial-gradient(70% 60% at 30% 10%, oklch(0.74 0.15 160 / 0.16), transparent 70%)",
    accent: "from-emerald-400/50",
    index:
      "bg-emerald-500/12 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300",
    bullet: "bg-emerald-500/70",
  },
}

export function OrderPhases({
  title,
  description,
  phases,
  variant = "primary",
}: {
  title: string
  description?: string
  phases: OrderPhase[]
  variant?: Variant
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const v = variantStyle[variant]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".phase-card", {
          y: 16,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "filter",
          delay: 0.05,
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      className="rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm"
    >
      <header className="space-y-0.5 pb-4">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </header>

      <ol className="space-y-3">
        {phases.map((p, i) => (
          <li
            key={i}
            className="phase-card group relative overflow-hidden rounded-xl border border-border/60 bg-card/80 p-4 transition-colors hover:border-border"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: v.glow }}
            />
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100",
                v.accent
              )}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <span
                  className={cn(
                    "inline-flex h-5 min-w-7 items-center justify-center rounded-md px-1.5 text-[10px] font-medium tabular-nums",
                    v.index
                  )}
                >
                  0{i + 1}
                </span>
                {p.label}
              </h3>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {p.range}
              </span>
            </div>

            <ul className="mt-2 flex flex-col gap-1.5">
              {p.items.map((it, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-xs leading-relaxed text-foreground/85"
                >
                  <span
                    className={cn(
                      "mt-[0.55em] inline-block size-1 shrink-0 rounded-full",
                      v.bullet
                    )}
                  />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
