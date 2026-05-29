import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Check } from "lucide-react"
import { cn } from "~/lib/utils"
import type { OrderMilestone } from "../data"

gsap.registerPlugin(useGSAP)

export function OrderTimeline({
  milestones,
}: {
  milestones: OrderMilestone[]
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const doneCount = milestones.filter((m) => m.status === "done").length
  const progress = Math.round((doneCount / milestones.length) * 100)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".timeline-item", {
          x: -10,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.1,
        })
        gsap.from(".timeline-progress", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
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
      <header className="flex items-center justify-between gap-3 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight">项目时间线</h2>
          <p className="text-xs text-muted-foreground">
            从立项到结算的关键里程碑，平台全程托管资金。
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums tracking-tight">
          {progress}%
        </span>
      </header>

      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="timeline-progress h-full rounded-full bg-foreground/75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="relative mt-6 space-y-5 border-l border-border/60 pl-6">
        {milestones.map((m, i) => (
          <li key={i} className="timeline-item relative">
            <Dot status={m.status} />
            <div className="flex items-baseline justify-between gap-2">
              <h3
                className={cn(
                  "text-sm font-medium tracking-tight",
                  m.status === "pending" && "text-muted-foreground"
                )}
              >
                {m.title}
              </h3>
              {m.date ? (
                <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                  {m.date}
                </span>
              ) : null}
            </div>
            {m.desc ? (
              <p
                className={cn(
                  "mt-0.5 text-xs leading-relaxed",
                  m.status === "pending"
                    ? "text-muted-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {m.desc}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Dot({ status }: { status: OrderMilestone["status"] }) {
  if (status === "done") {
    return (
      <span
        aria-hidden
        className="absolute -left-[1.875rem] top-0.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background ring-4 ring-card"
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
    )
  }
  if (status === "current") {
    return (
      <span
        aria-hidden
        className="absolute -left-[1.875rem] top-0.5 flex size-5 items-center justify-center"
      >
        <span className="absolute inline-block size-5 animate-ping rounded-full bg-primary/30" />
        <span className="relative inline-block size-3 rounded-full bg-primary ring-4 ring-primary/15" />
      </span>
    )
  }
  return (
    <span
      aria-hidden
      className="absolute -left-[1.875rem] top-1 inline-block size-3 rounded-full border border-border bg-muted ring-4 ring-card"
    />
  )
}