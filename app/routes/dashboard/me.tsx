import * as React from "react"
import { motion } from "motion/react"
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { TopupDialog } from "~/components/page-kits/dashboard/topup"

import type { Route } from "./+types/me";
import { Button } from "~/components/ui/button"

const user = {
  name: "Creteper",
  email: "mycreteper@gmail.com",
  phone: "+86 138 **** 8888",
  joinedAt: "2024 年 11 月",
  level: "信誉良好",
  creditScore: 650,
  avatar: "/assets/avatar%20(1).png",
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: `爱开发 - ${user.name}` },
    { name: "description", content: "爱开发，帮你实现想法" },
  ];
}

const wallet = {
  available: 128.0,
  unsettled: 36800.0,
  totalTopup: 52000.0,
}

const tintBg: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
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

export default function DashboardMe() {
  const [open, setOpen] = React.useState(false)

  return (
    <motion.main
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 md:p-8"
    >
      {/* Profile */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-7"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center">
          <Avatar className="size-20 rounded-full ring-4 ring-background shadow-sm">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full text-xl">CN</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <ShieldCheck className="size-3" />
                {user.level}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              加入「爱开发」· {user.joinedAt} · 信誉分{" "}
              <span className="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                {user.creditScore}
              </span>
            </p>
          </div>
          <Button variant={"destructive"}>退出登录</Button>
        </div>
      </motion.section>

      {/* Wallet */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-5 rounded-3xl border border-border/50 bg-card p-6 md:p-7"
      >
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold tracking-tight">我的钱包</h2>
            <span className="text-xs text-muted-foreground">平台全程托管 · 安全交付</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <ArrowDownToLine className="size-4" />
            充值
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <WalletStat
            icon={<Wallet className="size-4" />}
            tint="blue"
            label="可用余额"
            value={`¥${formatCurrency(wallet.available)}`}
            hint="可用于新项目托管"
          />
          <WalletStat
            icon={<TrendingUp className="size-4" />}
            tint="emerald"
            label="未结余额"
            value={`¥${formatCurrency(wallet.unsettled)}`}
            hint="项目验收后自动结算"
          />
          <WalletStat
            icon={<ArrowDownToLine className="size-4" />}
            tint="violet"
            label="累计充值"
            value={`¥${formatCurrency(wallet.totalTopup)}`}
            hint="历史总充值金额"
          />
        </div>
      </motion.section>

      {/* Account info */}
      <motion.section
        variants={itemVariants}
        className="flex flex-col gap-1 rounded-3xl border border-border/50 bg-card p-6 md:p-7"
      >
        <header className="mb-3 flex flex-col gap-0.5">
          <h2 className="text-base font-semibold tracking-tight">账户信息</h2>
          <span className="text-xs text-muted-foreground">注册时绑定的资料</span>
        </header>
        <DetailRow icon={<Mail className="size-4" />} label="邮箱" value={user.email} />
        <DetailRow icon={<Phone className="size-4" />} label="手机号" value={user.phone} />
        <DetailRow icon={<Calendar className="size-4" />} label="注册时间" value={user.joinedAt} />
        <DetailRow
          icon={<ShieldCheck className="size-4" />}
          label="信誉分"
          value={
            <span className="inline-flex items-center gap-2">
              <span className="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                {user.creditScore}
              </span>
              <span className="text-[11px] text-muted-foreground">≥ 650 可享分期支付</span>
            </span>
          }
          last
        />
      </motion.section>

      <TopupDialog open={open} onOpenChange={setOpen} />
    </motion.main>
  )
}

type WalletStatProps = {
  icon: React.ReactNode
  tint: string
  label: string
  value: string
  hint?: string
}

function WalletStat({ icon, tint, label, value, hint }: WalletStatProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-muted/40 p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex size-8 items-center justify-center rounded-full ${tintBg[tint] ?? tintBg.neutral
            }`}
        >
          {icon}
        </div>
        <span className="text-[11px] tracking-wide text-muted-foreground">{label}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? "" : "border-b border-border/40"}`}>
      <span className="flex size-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
        {icon}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-right text-sm">{value}</span>
    </div>
  )
}
