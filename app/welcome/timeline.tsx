import * as React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "~/components/stepper"
import {
  ArrowRight,
  Check,
  LoaderCircleIcon,
  Sparkles,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  { title: "Step 1", description: "梳理需求，输出设计稿" },
  { title: "Step 2", description: "搭建服务端架构与接口" },
  { title: "Step 3", description: "前后端联调、功能对接" },
  { title: "Step 4", description: "整体验收与交付上线" },
]

const dateSteps = [
  [
    { title: "5月1日", description: "需求沟通，绘制原型图" },
    { title: "5月2日", description: "UI 视觉稿细化定稿" },
  ],
  [
    { title: "5月3日", description: "数据库设计、接口定义" },
    { title: "5月4日", description: "核心接口开发完成" },
  ],
  [
    { title: "5月5日", description: "前后端联调对接" },
    { title: "5月6日", description: "功能走查、修边收尾" },
  ],
  [
    { title: "5月7日", description: "整体验收测试" },
    { title: "5月8日", description: "部署上线、交付完成" },
  ],
]

export default function TimeLine() {
  const [activeStep, setActiveStep] = React.useState(1)
  const [innerStep, setInnerStep] = React.useState(1)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const groupLength = dateSteps[activeStep - 1].length
    const timer = setTimeout(() => {
      if (innerStep < groupLength) {
        setInnerStep(innerStep + 1)
      } else {
        setInnerStep(1)
        setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1))
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [innerStep, activeStep])

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current
      if (!root) return

      const scroller =
        document.getElementById("page-scroll") ||
        (root.closest("[data-page-scroll]") as HTMLElement | null) ||
        undefined

      gsap.utils.toArray<HTMLElement>("[data-tl-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, scroller, start: "top 85%", once: true },
          }
        )
      })

      const glow = root.querySelector<HTMLElement>("[data-tl-glow]")
      if (glow) {
        gsap.to(glow, {
          rotate: 360,
          duration: 24,
          repeat: -1,
          ease: "none",
        })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-tl-glow
          className="absolute left-1/2 top-1/2 size-175 -translate-x-1/2 -translate-y-1/2 rounded-[42%] bg-linear-to-tr from-sky-400/15 via-fuchsia-400/15 to-amber-400/15 blur-3xl"
        />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-10 p-10">
        <div className="text-center">
          <div
            data-tl-reveal
            className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-foreground/70"
          >
            <Sparkles className="size-3.5 text-primary" />
            按"工期"交付 · 一天一反馈
          </div>
          <h1
            data-tl-reveal
            className="mt-5 font-heading text-3xl font-semibold tracking-tight md:text-5xl"
          >
            每一天的进度
            <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}都看得见
            </span>
          </h1>
        </div>

        <div
          data-tl-reveal
          className="w-full rounded-[36px] border border-foreground/8 bg-white/70 p-8 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)]"
        >
          <Stepper
            value={activeStep}
            onValueChange={setActiveStep}
            indicators={{
              completed: <Check className="size-4" />,
              loading: <LoaderCircleIcon className="size-4 animate-spin" />,
            }}
            className="space-y-8"
          >
            <StepperNav>
              {steps.map((step, index) => (
                <StepperItem
                  key={index}
                  step={index + 1}
                  className="relative"
                >
                  <StepperTrigger className="flex justify-start gap-1.5">
                    <StepperIndicator>{index + 1}</StepperIndicator>
                    <div className="flex flex-col items-start gap-0.5">
                      <StepperTitle>{step.title}</StepperTitle>
                      <StepperDescription>{step.description}</StepperDescription>
                    </div>
                  </StepperTrigger>

                  {steps.length > index + 1 && (
                    <StepperSeparator className="md:mx-2.5" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="text-sm mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="mx-auto max-w-150"
                >
                  <Stepper
                    value={innerStep}
                    indicators={{
                      completed: <Check className="size-4" />,
                      loading: (
                        <LoaderCircleIcon className="size-4 animate-spin" />
                      ),
                    }}
                    className="space-y-8"
                  >
                    <StepperNav>
                      {dateSteps[activeStep - 1].map((step, i) => (
                        <StepperItem
                          key={i}
                          step={i + 1}
                          className="relative"
                        >
                          <StepperTrigger className="flex justify-start gap-1.5">
                            <StepperIndicator>{i + 1}</StepperIndicator>
                            <div className="flex flex-col items-start gap-0.5">
                              <StepperTitle>{step.title}</StepperTitle>
                              <StepperDescription>
                                {step.description}
                              </StepperDescription>
                            </div>
                          </StepperTrigger>

                          {dateSteps[activeStep - 1].length > i + 1 && (
                            <StepperSeparator className="md:mx-2.5" />
                          )}
                        </StepperItem>
                      ))}
                    </StepperNav>
                  </Stepper>
                </motion.div>
              </AnimatePresence>
            </StepperPanel>
          </Stepper>
        </div>

        {/* Final CTA banner */}
        <div
          data-tl-reveal
          className="relative mt-10 w-full overflow-hidden rounded-[36px] border border-foreground/10 bg-linear-to-br from-foreground via-foreground to-foreground/90 px-8 py-12 text-background md:px-16"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-12 size-[360px] rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -right-12 size-[420px] rounded-full bg-fuchsia-400/25 blur-3xl" />
          </div>
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-3 py-1 text-[11px] text-background/85">
                <Sparkles className="size-3.5" />
                现在就开始
              </div>
              <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                把你下一个项目，
                <br className="hidden md:inline" />
                交给 AI 和爱开发。
              </h3>
              <p className="mt-3 max-w-xl text-sm text-background/70">
                无需注册立刻试用：让 AI 帮你拆解第一份需求，看看爱开发能给你什么。
              </p>
            </div>
            <button
              type="button"
              className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:scale-[1.03] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.4)]"
            >
              立刻体验
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
