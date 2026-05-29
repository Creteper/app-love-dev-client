import * as React from "react"
import { motion } from "motion/react"
import {
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  Settings,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { WithdrawDialog } from "~/components/page-kits/devdashboard/withdraw"

export function meta() {
  return [
    { title: "爱开发 - 我的" },
    { name: "description", content: "开发者账户与设置" },
  ]
}

const skills = ["React Native", "TypeScript", "Node.js", "RAG", "WeChat 支付"]

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
}

function formatCNY(n: number) {
  return n.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function DevDashboardMe() {
  const [available, setAvailable] = React.useState(1280)
  const [pending] = React.useState(12400)
  const [withdrawn, setWithdrawn] = React.useState(45020)
  const [open, setOpen] = React.useState(false)

  return (
    <motion.main
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:gap-6 md:p-8"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 md:p-8"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar className="size-20 rounded-2xl">
            <AvatarImage src="/assets/avatar%20(2).png" alt="开发者头像" />
            <AvatarFallback className="rounded-2xl text-lg">DV</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                爱开发·开发者
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <ShieldCheck className="size-3" />
                B 级 · 已认证
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              mydeveloper@gmail.com · 注册于 2025·02
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <Button size="sm" variant="outline" className="shrink-0">
            <Settings className="size-3.5" />
            编辑资料
          </Button>
        </div>
      </motion.section>

      {/* Wallet hero card with withdraw CTA */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-emerald-500/12 via-emerald-500/4 to-transparent p-5 md:p-7"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-12 size-44 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
              <Wallet className="size-3.5" />
              可提现余额
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">¥</span>
              <span className="text-4xl font-semibold tabular-nums tracking-tight md:text-5xl">
                {formatCNY(available)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                待结算 ¥{formatCNY(pending)}
              </span>
              <span>累计已提现 ¥{formatCNY(withdrawn)}</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setOpen(true)}
            disabled={available <= 0}
            className="shrink-0"
          >
            <Wallet className="size-4" />
            提现
          </Button>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-3 gap-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4"
        >
          <Briefcase className="size-4 text-muted-foreground" />
          <div className="text-lg font-semibold tabular-nums tracking-tight">3</div>
          <div className="text-[11px] text-muted-foreground">进行中</div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4"
        >
          <CheckCircle2 className="size-4 text-muted-foreground" />
          <div className="text-lg font-semibold tabular-nums tracking-tight">14</div>
          <div className="text-[11px] text-muted-foreground">累计完单</div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4"
        >
          <Wallet className="size-4 text-muted-foreground" />
          <div className="text-lg font-semibold tabular-nums tracking-tight">
            ¥56,300
          </div>
          <div className="text-[11px] text-muted-foreground">累计收入</div>
        </motion.div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-3 rounded-3xl border border-border/50 bg-card p-5 md:p-6"
      >
        <header className="flex items-center gap-2">
          <Award className="size-4 text-amber-500" />
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold tracking-tight">升级到 A 级</h2>
            <p className="text-xs text-muted-foreground">
              还差 6 单 / 评价 ≥ 4.8 即可解锁更高客单价的需求
            </p>
          </div>
        </header>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: "57%" }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>当前 B 级</span>
          <span className="tabular-nums">8 / 14 单 · 评价 4.7</span>
          <span>下一级 A 级</span>
        </div>
      </motion.section>

      <WithdrawDialog
        open={open}
        onOpenChange={setOpen}
        available={available}
        onSuccess={(amount) => {
          setAvailable((v) => Math.max(0, v - amount))
          setWithdrawn((v) => v + amount)
        }}
      />
    </motion.main>
  )
}
