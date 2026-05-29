import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { HeroCarousel } from "~/components/page-kits/devlopments/hero-carousel"
import { CategoryGrid } from "~/components/page-kits/devlopments/category-grid"
import { OrdersList } from "~/components/page-kits/devlopments/orders-list"

gsap.registerPlugin(useGSAP)

export function meta() {
  return [
    { title: "爱开发 - 接单大厅" },
    { name: "description", content: "爱开发开发者端 · 接单大厅" },
  ]
}

export default function DevHomePage() {
  const ref = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".page-title-line", {
          y: 26,
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.08,
          clearProps: "filter",
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="space-y-10">
      <section className="space-y-2">
        <h1 className="page-title-line text-2xl font-semibold tracking-tight md:text-3xl">
          接单大厅
        </h1>
        <p className="page-title-line text-sm text-muted-foreground">
          实时上新，谁手速快谁先得。完单越多，等级越高，可接需求越大。
        </p>
      </section>

      <HeroCarousel />
      <CategoryGrid />
      <OrdersList />
    </div>
  )
}
