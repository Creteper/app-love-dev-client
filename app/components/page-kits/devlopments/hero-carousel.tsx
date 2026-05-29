import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel"
import { Button } from "~/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { cn } from "~/lib/utils"
import { activitySlides, type ActivitySlide } from "./data"

gsap.registerPlugin(useGSAP)

const toneStyles: Record<ActivitySlide["tone"], string> = {
  violet:
    "bg-[linear-gradient(135deg,_oklch(0.55_0.18_278)_0%,_oklch(0.45_0.22_268)_100%)] text-white",
  amber:
    "bg-[linear-gradient(135deg,_oklch(0.78_0.16_70)_0%,_oklch(0.62_0.18_50)_100%)] text-white",
  emerald:
    "bg-[linear-gradient(135deg,_oklch(0.70_0.16_165)_0%,_oklch(0.50_0.16_175)_100%)] text-white",
  sky:
    "bg-[linear-gradient(135deg,_oklch(0.74_0.14_230)_0%,_oklch(0.55_0.18_252)_100%)] text-white",
}

export function HeroCarousel() {
  const rootRef = React.useRef<HTMLElement>(null)
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(activitySlides.length)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api) return
    const id = window.setInterval(() => {
      api.scrollNext()
    }, 6000)
    return () => window.clearInterval(id)
  }, [api])

  // Entry animation + ambient orb drift
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hero-shell", {
          scale: 0.97,
          y: 24,
          autoAlpha: 0,
          filter: "blur(12px)",
          duration: 0.95,
          ease: "expo.out",
          clearProps: "filter",
        })
        gsap.to(".hero-orb", {
          x: () => gsap.utils.random(-40, 40),
          y: () => gsap.utils.random(-25, 25),
          scale: () => gsap.utils.random(0.9, 1.2),
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.7, from: "random" },
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  // Re-animate the active slide's text on change
  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduced) return
      const slide = rootRef.current?.querySelector<HTMLElement>(
        `[data-slide="${current}"]`
      )
      if (!slide) return
      const targets = slide.querySelectorAll<HTMLElement>("[data-reveal]")
      gsap.fromTo(
        targets,
        { y: 18, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "filter",
        }
      )
    },
    { scope: rootRef, dependencies: [current] }
  )

  return (
    <section
      ref={rootRef}
      aria-label="活动"
      className="relative will-change-transform"
    >
      <div className="hero-shell relative">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          className="overflow-hidden rounded-3xl shadow-[0_30px_80px_-30px_oklch(0.4_0.15_270_/_0.35)] ring-1 ring-white/10"
        >
          <CarouselContent className="-ml-0">
            {activitySlides.map((slide, i) => (
              <CarouselItem
                key={slide.id}
                data-slide={i}
                className="basis-full pl-0"
              >
                <div
                  className={cn(
                    "relative flex h-56 flex-col justify-end overflow-hidden rounded-3xl p-7 sm:h-64 md:h-72 md:p-10",
                    toneStyles[slide.tone]
                  )}
                >
                  <div className="hero-orb pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/20 blur-3xl" />
                  <div className="hero-orb pointer-events-none absolute -left-10 bottom-0 size-44 rounded-full bg-white/15 blur-2xl" />
                  <div className="hero-orb pointer-events-none absolute left-1/2 top-1/4 size-32 rounded-full bg-white/10 blur-2xl" />

                  <div className="relative max-w-2xl space-y-3">
                    <span
                      data-reveal
                      className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/95 backdrop-blur"
                    >
                      <Sparkles className="size-3" />
                      {slide.eyebrow}
                    </span>
                    <h2
                      data-reveal
                      className="text-2xl font-semibold tracking-tight md:text-3xl"
                    >
                      {slide.title}
                    </h2>
                    <p
                      data-reveal
                      className="max-w-xl text-sm text-white/85 md:text-base"
                    >
                      {slide.description}
                    </p>
                    <div data-reveal className="pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/95 text-foreground hover:bg-white"
                      >
                        {slide.cta}
                        <ArrowRight className="ml-1 size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="absolute bottom-4 right-5 z-10 flex items-center gap-1.5 md:bottom-6 md:right-8">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`切换到第 ${i + 1} 张`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current
                ? "w-7 bg-white shadow-[0_0_12px_oklch(1_0_0_/_0.7)]"
                : "w-1.5 bg-white/50 hover:bg-white/85"
            )}
          />
        ))}
      </div>
    </section>
  )
}