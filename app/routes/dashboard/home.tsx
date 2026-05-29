import * as React from "react"
import { Link } from "react-router"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageCircle,
  Plus,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"
import type { Route } from "./+types/home";
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 仪表盘" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ];
}

const balance = {
  available: 128.0,
  unsettled: 36800.0,
  inProgress: 3,
  completed: 5,
}

const projects = [
  {
    name: "餐厅点餐系统",
    tint: "orange",
    progress: 65,
    stage: "开发中",
    stageTone: "blue",
    owner: "李工",
    nextMilestone: "第三期 · 后台接口联调",
    eta: "3 天后",
  },
  {
    name: "电商小程序",
    tint: "blue",
    progress: 30,
    stage: "开发中",
    stageTone: "blue",
    owner: "客服·小张",
    nextMilestone: "第二期款项已审核通过",
    eta: "可领取",
  },
  {
    name: "企业官网重构",
    tint: "violet",
    progress: 85,
    stage: "待验收",
    stageTone: "amber",
    owner: "王工",
    nextMilestone: "首页交互完成，等待你验收",
    eta: "今天",
  },
  {
    name: "数据分析后台",
    tint: "emerald",
    progress: 10,
    stage: "等待接单",
    stageTone: "neutral",
    owner: "客服·小李",
    nextMilestone: "已上架接单列表",
    eta: "—",
  },
]

const messages = [
  {
    title: "李工上传了今日进度截图",
    project: "餐厅点餐系统",
    time: "刚刚",
    tint: "orange",
    avatar: "/assets/avatar%20(3).png",
  },
  {
    title: "第二期款项审核通过，可领取",
    project: "电商小程序",
    time: "2 小时前",
    tint: "blue",
    avatar: "/assets/avatar%20(2).png",
  },
  {
    title: "首页交互完成，请验收",
    project: "企业官网重构",
    time: "昨天",
    tint: "violet",
    avatar: "/assets/avatar%20(3).png",
  },
  {
    title: "客服·小张 已为你匹配资深开发者",
    project: "数据分析后台",
    time: "昨天",
    tint: "emerald",
    avatar: "/assets/avatar%20(2).png",
  },
]

const tintBg: Record<string, string> = {
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
}

const stageTone: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  neutral: "bg-muted text-muted-foreground",
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
  return n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function DashBoardHome() {
  return (
    <motion.main
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:gap-6 md:p-8"
    >
      {/* Hero */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 md:p-9"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
              下午好
            </span>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Creteper，今天有 <span className="text-primary">3</span> 个项目正在开发中
            </h1>
            <p className="text-sm text-muted-foreground">
              有新点子？让 AI 帮你梳理需求，几分钟就能上架接单。
            </p>
          </div>
          <Link
            to="/dashboard/chats"
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <Plus className="size-4" />
            我有新需求
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.section>

      {/* Stat cards */}
      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard
          icon={<Wallet className="size-4" />}
          tint="blue"
          label="可用余额"
          value={`¥${formatCurrency(balance.available)}`}
          hint="可随时充值或提取"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          tint="emerald"
          label="未结余额"
          value={`¥${formatCurrency(balance.unsettled)}`}
          hint="项目验收后自动结算"
        />
        <StatCard
          icon={<Briefcase className="size-4" />}
          tint="violet"
          label="进行中"
          value={balance.inProgress.toString()}
          hint="开发者正在交付"
          unit="个项目"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          tint="amber"
          label="已完成"
          value={balance.completed.toString()}
          hint="累计交付"
          unit="个项目"
        />
      </motion.section>

      {/* Main grid */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.6fr_1fr]">
        {/* Project status */}
        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">项目状态</h2>
              <span className="text-xs text-muted-foreground">{projects.length} 个项目 · 实时同步</span>
            </div>
            <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              查看全部
            </button>
          </header>

          <motion.ul
            variants={sectionVariants}
            className="flex flex-col gap-2"
          >
            {projects.map((p) => (
              <motion.li
                key={p.name}
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
                      <span className="truncate text-sm font-medium tracking-tight">{p.name}</span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          stageTone[p.stageTone] ?? stageTone.neutral
                        }`}
                      >
                        {p.stage}
                      </span>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                      {p.owner} · {p.nextMilestone}
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span className="text-sm font-semibold tabular-nums tracking-tight">
                      {p.progress}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">{p.eta}</span>
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

        {/* Latest messages */}
        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">最新消息</h2>
              <span className="text-xs text-muted-foreground">来自项目群与客服</span>
            </div>
            <Link
              to="/dashboard/messages"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              全部消息
            </Link>
          </header>

          <motion.ol variants={sectionVariants} className="flex flex-col gap-1">
            {messages.map((m, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-muted/50"
              >
                <img
                  src={m.avatar}
                  alt={m.project}
                  className="size-8 shrink-0 rounded-full object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="line-clamp-2 text-xs leading-relaxed">{m.title}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="truncate">{m.project}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="shrink-0">{m.time}</span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>

          <div className="mt-auto flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border/60 p-3 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            <span>开发过程中所有沟通都在平台内留痕</span>
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
        <span className="truncate text-[11px] tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="min-w-0 truncate text-xl font-semibold tabular-nums tracking-tight md:text-2xl">{value}</span>
        {unit && (
          <span className="shrink-0 text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
      {hint && <span className="truncate text-[11px] text-muted-foreground">{hint}</span>}
    </motion.div>
  )
}