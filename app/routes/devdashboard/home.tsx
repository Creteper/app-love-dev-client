import { Link } from "react-router"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"

export function meta() {
  return [
    { title: "爱开发 - 开发者仪表盘" },
    { name: "description", content: "开发者端 · 接单情况与收入" },
  ]
}

const balance = {
  available: 1280.0,
  pending: 12400.0,
  monthIncome: 8800.0,
  totalIncome: 56300.0,
}

const myOrders = [
  {
    id: "ORD-2403",
    name: "宠物社区 App",
    client: "上海 · 萌爪科技",
    progress: 22,
    stage: "开发中",
    stageTone: "blue",
    nextMilestone: "一期 · 应用骨架",
    eta: "3 天后",
  },
  {
    id: "ORD-2401",
    name: "知识库问答 Agent",
    client: "深圳 · 万象云",
    progress: 8,
    stage: "刚签约",
    stageTone: "amber",
    nextMilestone: "需求 deep-dive",
    eta: "明天",
  },
  {
    id: "ORD-2392",
    name: "智能客服 Agent",
    client: "上海 · 客小二",
    progress: 95,
    stage: "待验收",
    stageTone: "green",
    nextMilestone: "客户验收中",
    eta: "今天",
  },
]

const todos = [
  {
    text: "宠物社区 App · 今日需上传开发进度",
    project: "ORD-2403",
    deadline: "今天 22:00 前",
    accent: "rose",
  },
  {
    text: "知识库 Agent · 与客户对齐评测集",
    project: "ORD-2401",
    deadline: "明天 14:00",
    accent: "amber",
  },
  {
    text: "智能客服 · 跟进客户验收反馈",
    project: "ORD-2392",
    deadline: "本周内",
    accent: "emerald",
  },
]

const stageTone: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  neutral: "bg-muted text-muted-foreground",
}

const tintBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
}

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
}

function formatCurrency(n: number) {
  return n.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function DevDashboardHome() {
  return (
    <motion.main
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:gap-6 md:p-8"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 md:p-9"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
              欢迎回来
            </span>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              你正在交付 <span className="text-primary">3</span> 个项目，最近 30 天收入{" "}
              ¥{formatCurrency(balance.monthIncome)}
            </h1>
            <p className="text-sm text-muted-foreground">
              手速够快还能再接一单 — 现在去看看接单大厅。
            </p>
          </div>
          <Link
            to="/devlopments"
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <Sparkles className="size-4" />
            去接单大厅
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard
          icon={<Wallet className="size-4" />}
          tint="blue"
          label="可提现"
          value={`¥${formatCurrency(balance.available)}`}
          hint="结算后自动到账"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          tint="emerald"
          label="待结算"
          value={`¥${formatCurrency(balance.pending)}`}
          hint="项目阶段验收中"
        />
        <StatCard
          icon={<Briefcase className="size-4" />}
          tint="violet"
          label="进行中"
          value="3"
          hint="正在交付"
          unit="单"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          tint="amber"
          label="累计完单"
          value="14"
          hint={`累计收入 ¥${formatCurrency(balance.totalIncome)}`}
          unit="单"
        />
      </motion.section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">
                我的项目
              </h2>
              <span className="text-xs text-muted-foreground">
                {myOrders.length} 单进行中
              </span>
            </div>
            <Link
              to="/devdashboard/messages"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              全部项目
            </Link>
          </header>

          <motion.ul
            variants={sectionVariants}
            className="flex flex-col gap-2"
          >
            {myOrders.map((p) => (
              <motion.li
                key={p.id}
                variants={itemVariants}
                className="group flex flex-col gap-3 rounded-2xl border border-transparent bg-muted/30 p-4 transition-all hover:border-border/60 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/group-avatar.png"
                    alt={p.name}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium tracking-tight">
                        {p.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          stageTone[p.stageTone] ?? stageTone.neutral
                        }`}
                      >
                        {p.stage}
                      </span>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {p.client} · {p.nextMilestone}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-sm font-semibold tabular-nums tracking-tight">
                      {p.progress}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {p.eta}
                    </span>
                  </div>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground/70 transition-all"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">
                今日待办
              </h2>
              <span className="text-xs text-muted-foreground">
                每天的进度回报关乎你的等级
              </span>
            </div>
            <Clock className="size-4 text-muted-foreground" />
          </header>

          <motion.ol variants={sectionVariants} className="flex flex-col gap-1">
            {todos.map((t, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-muted/50"
              >
                <span
                  className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${
                    tintBg[t.accent] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock className="size-3.5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="line-clamp-2 text-xs leading-relaxed">
                    {t.text}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="truncate font-mono">{t.project}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="shrink-0">{t.deadline}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>

          <div className="mt-auto flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border/60 p-3 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            <span>每日完单经验值上线后自动累计</span>
          </div>
        </motion.section>
      </div>
    </motion.main>
  )
}

type StatCardProps = {
  icon: React.ReactNode
  tint: string
  label: string
  value: string
  hint?: string
  unit?: string
}

function StatCard({ icon, tint, label, value, hint, unit }: StatCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group flex min-w-0 flex-col gap-3 rounded-3xl border border-border/50 bg-card p-4 transition-all hover:border-border/80 hover:shadow-sm md:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
            tintBg[tint] ?? "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <span className="truncate text-[11px] tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="min-w-0 truncate text-xl font-semibold tabular-nums tracking-tight md:text-2xl">
          {value}
        </span>
        {unit && <span className="shrink-0 text-xs text-muted-foreground">{unit}</span>}
      </div>
      {hint && (
        <span className="truncate text-[11px] text-muted-foreground">
          {hint}
        </span>
      )}
    </motion.div>
  )
}
