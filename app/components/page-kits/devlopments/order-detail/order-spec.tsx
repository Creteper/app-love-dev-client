import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { FileText } from "lucide-react"
import { MiniMarkdown } from "~/components/page-kits/dashboard/chats/mini-markdown"

gsap.registerPlugin(useGSAP)

export function OrderSpec({ requirementsMd }: { requirementsMd: string }) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".spec-body > *", {
          y: 12,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.1,
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
      <header className="flex items-center gap-2 pb-4">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-3.5" />
        </span>
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight">项目详情</h2>
          <p className="text-xs text-muted-foreground">
            客户与客服已确认的需求与验收口径。
          </p>
        </div>
      </header>

      <MiniMarkdown source={requirementsMd} className="spec-body" />
    </section>
  )
}