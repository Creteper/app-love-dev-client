import * as React from "react"

const DEFAULT_EMOJIS = [
  "🎉",
  "✨",
  "🎊",
  "💖",
  "🚀",
  "⭐",
  "💫",
  "🌟",
  "🎈",
  "🌈",
  "💎",
  "🔥",
]

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vRot: number
  life: number
  maxLife: number
  emoji: string
  scale: number
  scaleVel: number
}

export type EmojiBurstHandle = {
  burst: (x: number, y: number, count?: number) => void
  /** Fire several bursts spread around a center point */
  cascade: (x: number, y: number, options?: { bursts?: number; spread?: number; count?: number }) => void
}

type Props = {
  emojis?: string[]
  /** Particles per burst */
  particles?: number
  /** Base lifespan in ms */
  lifespan?: number
  gravity?: number
  className?: string
}

export const EmojiBurst = React.forwardRef<EmojiBurstHandle, Props>(
  function EmojiBurst(
    {
      emojis = DEFAULT_EMOJIS,
      particles = 40,
      lifespan = 1800,
      gravity = 0.18,
      className,
    },
    ref
  ) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const particlesRef = React.useRef<Particle[]>([])
    const rafRef = React.useRef<number | null>(null)
    const lastTsRef = React.useRef<number>(0)

    const fitCanvas = React.useCallback(() => {
      const c = canvasRef.current
      if (!c) return
      const dpr = window.devicePixelRatio || 1
      const { width, height } = c.getBoundingClientRect()
      c.width = Math.floor(width * dpr)
      c.height = Math.floor(height * dpr)
      const ctx = c.getContext("2d")
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    }, [])

    React.useEffect(() => {
      fitCanvas()
      const onResize = () => fitCanvas()
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }, [fitCanvas])

    const ensureLoop = React.useCallback(() => {
      if (rafRef.current != null) return
      const tick = (ts: number) => {
        const c = canvasRef.current
        if (!c) {
          rafRef.current = null
          return
        }
        const ctx = c.getContext("2d")
        if (!ctx) {
          rafRef.current = null
          return
        }
        const last = lastTsRef.current || ts
        const dt = Math.min(48, ts - last)
        lastTsRef.current = ts

        const { width, height } = c.getBoundingClientRect()
        ctx.clearRect(0, 0, width, height)

        const live: Particle[] = []
        for (const p of particlesRef.current) {
          p.life += dt
          if (p.life >= p.maxLife) continue
          p.vy += gravity * (dt / 16)
          p.x += p.vx * (dt / 16)
          p.y += p.vy * (dt / 16)
          p.rot += p.vRot * (dt / 16)
          p.scale += p.scaleVel * (dt / 16)
          if (p.scale < 0) p.scale = 0

          const t = p.life / p.maxLife
          const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85
          ctx.save()
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.font = `${p.size * p.scale}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(p.emoji, 0, 0)
          ctx.restore()
          live.push(p)
        }
        particlesRef.current = live

        if (live.length > 0) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          rafRef.current = null
          lastTsRef.current = 0
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, [gravity])

    React.useEffect(() => {
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }, [])

    const spawn = React.useCallback(
      (x: number, y: number, count: number) => {
        const c = canvasRef.current
        if (!c) return
        const rect = c.getBoundingClientRect()
        const localX = x - rect.left
        const localY = y - rect.top
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 4 + Math.random() * 9
          const size = 18 + Math.random() * 18
          particlesRef.current.push({
            x: localX,
            y: localY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            size,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.25,
            life: 0,
            maxLife: lifespan * (0.7 + Math.random() * 0.6),
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            scale: 0.6 + Math.random() * 0.5,
            scaleVel: 0.002 + Math.random() * 0.004,
          })
        }
        ensureLoop()
      },
      [emojis, ensureLoop, lifespan]
    )

    React.useImperativeHandle(
      ref,
      () => ({
        burst: (x, y, count) => spawn(x, y, count ?? particles),
        cascade: (x, y, options) => {
          const bursts = options?.bursts ?? 5
          const spread = options?.spread ?? 220
          const count = options?.count ?? Math.floor(particles * 0.6)
          for (let i = 0; i < bursts; i++) {
            const delay = i * 140
            const dx = (Math.random() - 0.5) * spread
            const dy = (Math.random() - 0.5) * spread
            window.setTimeout(() => spawn(x + dx, y + dy, count), delay)
          }
        },
      }),
      [spawn, particles]
    )

    return (
      <canvas
        ref={canvasRef}
        aria-hidden
        className={
          "pointer-events-none fixed inset-0 z-[100] h-full w-full " +
          (className ?? "")
        }
      />
    )
  }
)
