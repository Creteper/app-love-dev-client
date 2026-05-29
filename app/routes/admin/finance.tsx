import { motion } from "motion/react"
import { Navigate } from "react-router"
import { ArrowDownRight, ArrowUpRight, Banknote } from "lucide-react"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import {
  adminProjects,
  formatCNY,
  incomeBuckets,
  sumIncome,
} from "~/components/page-kits/admin/data"
import {
  MonthlyIncomeStackedBars,
  MonthlyIncomeTrend,
} from "~/components/page-kits/admin/charts"
import { cn } from "~/lib/utils"

export function meta() {
  return [{ title: "爱开发 - 后台财务" }]
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

export default function AdminFinance() {
  const { user } = useAdminAuth()
  if (user?.role !== "admin") return <Navigate to="/admin" replace />

  const totals = sumIncome(incomeBuckets)
  const monthOnMonth =
    incomeBuckets.length >= 2
      ? incomeBuckets[incomeBuckets.length - 1].total -
        incomeBuckets[incomeBuckets.length - 2].total
      : 0
  const momPct =
    incomeBuckets.length >= 2
      ? (monthOnMonth / incomeBuckets[incomeBuckets.length - 2].total) * 100
      : 0

  const settledProjects = adminProjects.filter((p) => p.status === "settled")

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
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            平台总收入
          </span>
          <h1 className="flex items-baseline gap-2 text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">
            <span className="text-base text-muted-foreground">¥</span>
            {formatCNY(totals.total)}
          </h1>
          <p className="text-sm text-muted-foreground">
            最近 {incomeBuckets.length} 个月累计 · 含未结算 ¥{" "}
            {formatCNY(totals.unsettled)}
          </p>
          <div
            className={cn(
              "mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              monthOnMonth >= 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            )}
          >
            {monthOnMonth >= 0 ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {monthOnMonth >= 0 ? "+" : "-"}¥{formatCNY(Math.abs(monthOnMonth))}（{
              momPct.toFixed(1)
            }% MoM）
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionVariants} className="grid gap-4 md:grid-cols-3">
        <StatBox
          tint="emerald"
          label="已结算"
          value={`¥${formatCNY(totals.settled)}`}
          hint="按阶段释放给开发者"
        />
        <StatBox
          tint="amber"
          label="未结算"
          value={`¥${formatCNY(totals.unsettled)}`}
          hint="客户已托管 · 等待验收"
        />
        <StatBox
          tint="violet"
          label="累计完单"
          value={`${settledProjects.length}`}
          hint={`覆盖 ${
            Array.from(new Set(settledProjects.map((p) => p.client))).length
          } 家客户`}
        />
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="rounded-3xl border border-border/50 bg-card p-5 md:p-7"
      >
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight">
              月度收入分布
            </h2>
            <p className="text-xs text-muted-foreground">
              已结算 + 未结算 = 总收入 · hover 查看每月明细
            </p>
          </div>
          <Banknote className="size-4 text-muted-foreground" />
        </header>

        <div className="mt-6">
          <MonthlyIncomeStackedBars />
        </div>
      </motion.section>

      <motion.section
        variants={itemVariants}
        className="rounded-3xl border border-border/50 bg-card p-5 md:p-7"
      >
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight">
              总收入趋势
            </h2>
            <p className="text-xs text-muted-foreground">
              最近 {incomeBuckets.length} 个月 · 含未结算
            </p>
          </div>
          <Banknote className="size-4 text-muted-foreground" />
        </header>

        <div className="mt-4">
          <MonthlyIncomeTrend />
        </div>
      </motion.section>
    </motion.main>
  )
}

const tintBg: Record<string, string> = {
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
}

function StatBox({
  tint,
  label,
  value,
  hint,
}: {
  tint: string
  label: string
  value: string
  hint?: string
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col gap-2 rounded-3xl border border-border/50 bg-card p-4 md:p-5"
    >
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full",
          tintBg[tint] ?? "bg-muted text-muted-foreground"
        )}
      >
        <Banknote className="size-3.5" />
      </span>
      <span className="text-[11px] tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-xl font-semibold tabular-nums tracking-tight">
        {value}
      </span>
      {hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </motion.div>
  )
}
