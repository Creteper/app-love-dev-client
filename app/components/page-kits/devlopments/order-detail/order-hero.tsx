import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Button } from "~/components/ui/button"
import { ArrowRight, Clock, Users } from "lucide-react"
import { cn } from "~/lib/utils"
import type { DevLevel, Order } from "../data"

gsap.registerPlugin(useGSAP)

const levelStyle: Record<DevLevel, string> = {
  A: "bg-rose-500/12 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 ring-1 ring-rose-500/25",
  B: "bg-amber-500/12 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-amber-500/25",
  C: "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-emerald-500/25",
}

export function OrderHero({ order }: { order: Order }) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-line", {
          y: 14,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.07,
          clearProps: "filter",
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <section
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm md:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 25% 0%, oklch(0.72 0.18 290 / 0.14), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-violet-400/60 to-transparent"
      />

      <div className="hero-line flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className="font-mono tabular-nums">{order.id}</span>
        <span className="size-1 rounded-full bg-border" />
        <span>{order.category}</span>
        <span className="size-1 rounded-full bg-border" />
        <span>{order.client}</span>
        <span className="size-1 rounded-full bg-border" />
        <span>{order.postedAt}发布</span>
      </div>

      <div className="hero-line mt-3 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {order.title}
        </h1>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
            levelStyle[order.level]
          )}
        >
          {order.level} 级
        </span>
      </div>

      <p className="hero-line mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {order.summary}
      </p>

      <div className="hero-line mt-4 flex flex-wrap gap-1.5">
        {order.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="hero-line mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="报价" value={`¥ ${order.budget.toLocaleString()}`} />
        <Stat
          label="工期"
          value={order.duration}
          icon={<Clock className="size-3.5" />}
        />
        <Stat
          label="抢单热度"
          value={`${order.bids} 人`}
          icon={<Users className="size-3.5" />}
        />
        <Stat label="发布" value={order.postedAt} />
      </div>

      <div className="hero-line mt-6 flex flex-wrap items-center gap-3">
        <Button size="lg">
          抢单
          <ArrowRight className="ml-1 size-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          抢单即提交平台审核，审核通过自动签约。
        </span>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-4 py-3">
      <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-base font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </div>
    </div>
  )
}
