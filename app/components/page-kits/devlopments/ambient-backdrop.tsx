import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export function AmbientBackdrop() {
  const ref = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".ambient-orb").forEach((orb, i) => {
          gsap.to(orb, {
            x: () => gsap.utils.random(-90, 90),
            y: () => gsap.utils.random(-70, 70),
            scale: () => gsap.utils.random(0.9, 1.15),
            duration: 9 + i * 1.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="ambient-orb absolute -top-32 -left-24 size-[28rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.75 0.18 278 / 0.55), transparent 70%)",
        }}
      />
      <div
        className="ambient-orb absolute top-40 -right-20 size-[26rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.78 0.14 230 / 0.55), transparent 70%)",
        }}
      />
      <div
        className="ambient-orb absolute top-[55%] left-1/3 size-[22rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.74 0.16 165 / 0.55), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at top, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 30%, transparent 75%)",
        }}
      />
    </div>
  )
}
