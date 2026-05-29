import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Bot,
  CheckCircle2,
  Headphones,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Users,
  Wallet,
  Workflow,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Feature = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  accent: string
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "AI 拆解需求",
    desc: "把一句话需求拆为可执行的功能清单、技术方案与里程碑。",
    accent: "from-sky-400/30 to-indigo-500/10",
  },
  {
    icon: ShieldCheck,
    title: "平台资金托管",
    desc: "三方支付通道托管，里程碑确认后结算，安全可追溯。",
    accent: "from-emerald-400/30 to-teal-500/10",
  },
  {
    icon: Timer,
    title: "按工期日结",
    desc: "每天一次进度同步，按天结算与验收，进度可视化。",
    accent: "from-amber-400/30 to-orange-500/10",
  },
  {
    icon: Workflow,
    title: "全流程留痕",
    desc: "需求、报价、聊天、交付全程归档，纠纷有据可查。",
    accent: "from-fuchsia-400/30 to-pink-500/10",
  },
  {
    icon: Users,
    title: "程序员分级",
    desc: "C / B / A 三级匹配，难度与价位透明，按级派单。",
    accent: "from-rose-400/30 to-red-500/10",
  },
  {
    icon: Headphones,
    title: "客服全程在线",
    desc: "AI 初审 + 人工客服复核，让对接和验收都不再卡壳。",
    accent: "from-cyan-400/30 to-blue-500/10",
  },
]

const stats = [
  { value: "1,280+", label: "已交付项目" },
  { value: "98%", label: "按期交付率" },
  { value: "4.9", label: "平均验收评分" },
  { value: "24h", label: "极速接单响应" },
]

const testimonials = [
  {
    quote:
      "从 AI 拆解到最终交付都很顺，进度可见、结算清晰，不再担心被开发者鸽。",
    name: "Linda · 跨境电商创始人",
  },
  {
    quote:
      "客服全程跟，遇到问题随时切群里沟通，AI 给的报价也非常合理。",
    name: "Hugo · SaaS 产品经理",
  },
  {
    quote:
      "里程碑结算很贴心，每天都有进度同步，开发体验比传统外包好太多。",
    name: "Mei · 设计工作室主理人",
  },
]

export default function Description() {
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      const scroller =
        document.getElementById("page-scroll") ||
        (root.closest("[data-page-scroll]") as HTMLElement | null) ||
        undefined

      // Hero text — fire-once entrance
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 85%",
              once: true,
            },
          }
        )
      })

      // Section pills / headlines / subtitles below hero — scrubbed enter
      gsap.utils
        .toArray<HTMLElement>("[data-parallax-text]")
        .forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                scroller,
                start: "top 95%",
                end: "top 55%",
                scrub: 0.8,
              },
            }
          )
        })

      // Showcase image — enter + continuous drift past viewport
      const showcase = root.querySelector<HTMLElement>("[data-showcase]")
      if (showcase) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcase,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        })
        tl.fromTo(
          showcase,
          { opacity: 0, scale: 0.9, y: 120 },
          { opacity: 1, scale: 1, y: 0, ease: "none", duration: 0.5 }
        ).to(showcase, { y: -160, ease: "none", duration: 0.5 })
      }

      // Generic parallax cards — staggered per-index depth + drift
      const parallaxCard = (selector: string) => {
        const cards = gsap.utils.toArray<HTMLElement>(selector)
        cards.forEach((el, i) => {
          const upY = 90 + (i % 4) * 30
          const driftY = -(50 + (i % 4) * 20)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          })
          tl.fromTo(
            el,
            { opacity: 0, y: upY, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, ease: "none", duration: 0.45 }
          ).to(
            el,
            { y: driftY, ease: "none", duration: 0.55 },
            ">"
          )
        })
      }

      parallaxCard("[data-stat]")
      parallaxCard("[data-feature]")
      parallaxCard("[data-quote]")

      // Background blobs drift in parallel
      gsap.utils.toArray<HTMLElement>("[data-bg-blob]").forEach((el, i) => {
        const range = 80 + (i % 3) * 60
        gsap.to(el, {
          y: i % 2 === 0 ? -range : range,
          x: i % 2 === 0 ? 30 : -30,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            scroller,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <div className="bg-linear-to-t to-transparent to-75% from-white from-50% absolute w-full h-6 top-[calc(100vh-1rem)]" />

      {/* Hero showcase */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div data-bg-blob className="absolute -top-32 left-1/4 size-105 rounded-full bg-sky-400/15 blur-3xl" />
          <div data-bg-blob className="absolute right-1/4 top-40 size-90 rounded-full bg-fuchsia-400/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-foreground/70">
            <Sparkles className="size-3.5 text-primary" />
            AI 拆解 · 平台托管 · 按工期日结
          </div>
          <h2
            data-reveal
            className="mt-6 font-heading text-4xl font-semibold tracking-tight md:text-6xl"
          >
            一句话需求
            <br className="md:hidden" />
            <span className="bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}AI 帮你变成项目{" "}
            </span>
          </h2>
          <p
            data-reveal
            className="mx-auto mt-6 max-w-2xl text-base text-foreground/65 md:text-lg"
          >
            从需求拆解、报价、匹配开发者，到分阶段交付与验收，爱开发把传统外包的不透明全部摊在桌面上。
          </p>
        </div>

        <div
          data-showcase
          className="mx-auto mt-16 w-[88%] max-w-5xl overflow-hidden rounded-[40px] border border-foreground/10 bg-white shadow-[0_40px_120px_-30px_rgba(15,23,42,0.35)] md:rounded-[56px]"
        >
          <img src="./assets/ai-jane.png" alt="" className="w-full" />
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              data-stat
              className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-white/70 p-6 text-center backdrop-blur"
            >
              <div className="bg-linear-to-br from-foreground to-foreground/60 bg-clip-text font-heading text-3xl font-semibold tabular-nums tracking-tight text-transparent md:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-xs tracking-wide text-foreground/60 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <div
              data-parallax-text
              className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-foreground/70"
            >
              <Layers className="size-3.5 text-primary" />
              为什么选择爱开发
            </div>
            <h3
              data-parallax-text
              className="mt-4 font-heading text-3xl font-semibold tracking-tight md:text-5xl"
            >
              把外包流程拆成
              <span className="text-primary"> 可控的每一步</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  data-feature
                  className="group relative overflow-hidden rounded-3xl border border-foreground/8 bg-white/80 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]"
                >
                  <div
                    className={
                      "pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-linear-to-br blur-2xl opacity-70 transition-opacity group-hover:opacity-100 " +
                      f.accent
                    }
                  />
                  <span className="relative inline-flex size-11 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
                    <Icon className="size-5" />
                  </span>
                  <h4 className="relative mt-5 font-heading text-lg font-semibold tracking-tight">
                    {f.title}
                  </h4>
                  <p className="relative mt-2 text-sm leading-relaxed text-foreground/65">
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div data-bg-blob className="absolute left-1/2 top-1/3 size-130 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h3
              data-parallax-text
              className="font-heading text-3xl font-semibold tracking-tight md:text-5xl"
            >
              四步走完
              <span className="bg-linear-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                {" "}从想法到上线
              </span>
            </h3>
            <p
              data-parallax-text
              className="mx-auto mt-4 max-w-xl text-foreground/65"
            >
              全流程透明可视，每一步都有节点提醒、留痕和复盘。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "描述需求",
                desc: "向 AI 用一句话或几张截图描述你的想法。",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "AI 出方案",
                desc: "自动生成需求文档、报价、工期与分级建议。",
                icon: Bot,
              },
              {
                step: "03",
                title: "客服匹配",
                desc: "客服复核后，按等级匹配开发者并建立项目群。",
                icon: Headphones,
              },
              {
                step: "04",
                title: "分期交付",
                desc: "每个里程碑验收结算，平台资金全程托管。",
                icon: Wallet,
              },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.step}
                  data-feature
                  className="relative overflow-hidden rounded-3xl border border-foreground/8 bg-white/80 p-6 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl font-semibold tracking-tight text-foreground/15">
                      {s.step}
                    </span>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h4 className="mt-4 font-heading text-lg font-semibold tracking-tight">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {s.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h3
              data-parallax-text
              className="font-heading text-3xl font-semibold tracking-tight md:text-5xl"
            >
              他们已经在
              <span className="text-primary"> 爱开发</span> 上线
            </h3>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                data-quote
                className="relative flex h-full flex-col gap-4 rounded-3xl border border-foreground/8 bg-white/80 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/80">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-2 text-xs text-foreground/60">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground/10">
                    <CheckCircle2 className="size-3.5 text-primary" />
                  </span>
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
