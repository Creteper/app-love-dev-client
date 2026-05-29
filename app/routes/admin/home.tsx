import { Link } from "react-router"
import { motion } from "motion/react"
import {
  ArrowUpRight,
  Banknote,
  Briefcase,
  CheckCircle2,
  Clock,
  Inbox,
  TrendingUp,
  Users,
} from "lucide-react"
import { useAdminAuth, roleLabel } from "~/components/page-kits/admin/admin-auth-context"
import {
  adminProjects,
  assignedClients,
  formatCNY,
  incomeBuckets,
  pendingAssignmentsForCs,
  projectsForCs,
  statusLabel,
  statusTone,
  sumIncome,
} from "~/components/page-kits/admin/data"
import {
  DevLevelBars,
  ProjectStatusDonut,
} from "~/components/page-kits/admin/charts"
import { cn } from "~/lib/utils"

export function meta() {
  return [{ title: "爱开发 - 后台" }]
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

export default function AdminHome() {
  const { user } = useAdminAuth()
  if (user?.role === "cs") return <CsWorkbench csName={user.name} />
  return <AdminOverview />
}

function AdminOverview() {
  const totals = sumIncome(incomeBuckets)
  const inProgress = adminProjects.filter((p) => p.status === "in-progress").length
  const pendingConfirm = adminProjects.filter((p) => p.status === "pending-confirm").length
  const review = adminProjects.filter((p) => p.status === "review").length

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
              后台概览
            </span>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              进行中 <span className="text-primary">{inProgress}</span> 单，待验收{" "}
              <span className="text-primary">{review}</span> 单
            </h1>
            <p className="text-sm text-muted-foreground">
              累计平台总收入 ¥ {formatCNY(totals.total)}（其中未结算 ¥{" "}
              {formatCNY(totals.unsettled)}）
            </p>
          </div>
          <Link
            to="/admin/finance"
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
          >
            <Banknote className="size-4" />
            财务详情
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard
          icon={<Briefcase className="size-4" />}
          tint="blue"
          label="进行中"
          value={inProgress.toString()}
          unit="单"
        />
        <StatCard
          icon={<Clock className="size-4" />}
          tint="amber"
          label="待确认"
          value={pendingConfirm.toString()}
          unit="单"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          tint="violet"
          label="待验收"
          value={review.toString()}
          unit="单"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          tint="emerald"
          label="未结算金额"
          value={`¥${formatCNY(totals.unsettled)}`}
        />
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">
                项目状态分布
              </h2>
              <span className="text-xs text-muted-foreground">
                全平台项目按当前状态聚合
              </span>
            </div>
          </header>
          <ProjectStatusDonut />
        </motion.section>

        <motion.section
          variants={itemVariants}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
        >
          <header className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-base font-semibold tracking-tight">
                开发者等级分布
              </h2>
              <span className="text-xs text-muted-foreground">
                A 级可接 ≥ A 级单 · B 级 ≥ B · C 级仅 C
              </span>
            </div>
          </header>
          <DevLevelBars />
        </motion.section>
      </div>

      <motion.section
        variants={itemVariants}
        className="flex min-w-0 flex-col gap-4 rounded-3xl border border-border/50 bg-card p-4 md:p-6"
      >
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-semibold tracking-tight">最近项目</h2>
            <span className="text-xs text-muted-foreground">
              最近活跃的 4 个项目 · 全部项目去「项目」页查看
            </span>
          </div>
          <Link
            to="/admin/projects"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            全部项目
          </Link>
        </header>
        <motion.ul variants={sectionVariants} className="flex flex-col gap-2">
          {adminProjects.slice(0, 4).map((p) => (
            <motion.li
              key={p.id}
              variants={itemVariants}
              className="group flex items-center gap-3 rounded-2xl border border-transparent bg-muted/30 p-4 transition-all hover:border-border/60 hover:bg-muted/50"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium tracking-tight">
                    {p.name}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      statusTone[p.status]
                    )}
                  >
                    {statusLabel[p.status]}
                  </span>
                </div>
                <span className="truncate text-xs text-muted-foreground">
                  {p.client} · {p.cs}
                  {p.dev ? ` · ${p.dev}` : ""}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-sm font-semibold tabular-nums tracking-tight">
                  ¥{formatCNY(p.budget)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {p.progress}%
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.main>
  )
}

function CsWorkbench({ csName }: { csName: string }) {
  const myProjects = projectsForCs(csName)
  const myPending = pendingAssignmentsForCs(csName)
  const totalBudget = myProjects.reduce((acc, p) => acc + p.budget, 0)

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
        <div className="relative flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            {roleLabel.cs} · 工作台
          </span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            你好，{csName}
          </h1>
          <p className="text-sm text-muted-foreground">
            目前负责 {myProjects.length} 个项目，{myPending.length} 个客户等待你确认需求。
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatCard
          icon={<Briefcase className="size-4" />}
          tint="blue"
          label="我的项目"
          value={myProjects.length.toString()}
          unit="单"
        />
        <StatCard
          icon={<Inbox className="size-4" />}
          tint="amber"
          label="待对接"
          value={myPending.length.toString()}
          unit="人"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          tint="emerald"
          label="覆盖预算"
          value={`¥${formatCNY(totalBudget)}`}
        />
        <StatCard
          icon={<Users className="size-4" />}
          tint="violet"
          label="服务客户"
          value={Array.from(new Set(myProjects.map((p) => p.client))).length.toString()}
          unit="家"
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
                我负责的项目
              </h2>
              <span className="text-xs text-muted-foreground">
                点击进入项目详情
              </span>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              全部
            </Link>
          </header>
          <motion.ul variants={sectionVariants} className="flex flex-col gap-2">
            {myProjects.map((p) => (
              <motion.li
                key={p.id}
                variants={itemVariants}
                className="group flex flex-col gap-3 rounded-2xl border border-transparent bg-muted/30 p-4 transition-all hover:border-border/60 hover:bg-muted/50"
              >
                <Link to={`/admin/projects/${p.id}`} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium tracking-tight">
                          {p.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            statusTone[p.status]
                          )}
                        >
                          {statusLabel[p.status]}
                        </span>
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {p.client} · {p.nextMilestone}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums tracking-tight">
                      {p.progress}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground/70 transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </Link>
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
                待对接客户
              </h2>
              <span className="text-xs text-muted-foreground">
                已分配 · 等你确认需求
              </span>
            </div>
            <Link
              to="/admin/pending"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              查看
            </Link>
          </header>
          <ul className="flex flex-col gap-2">
            {myPending.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                目前没有待对接的客户
              </li>
            ) : (
              myPending.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-1 rounded-2xl bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium tracking-tight">
                      {a.client}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {a.assignedAt}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {a.intent}
                  </p>
                </li>
              ))
            )}
          </ul>
        </motion.section>
      </div>
    </motion.main>
  )
}

const tintBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
}

function StatCard({
  icon,
  tint,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode
  tint: string
  label: string
  value: string
  unit?: string
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group flex min-w-0 flex-col gap-3 rounded-3xl border border-border/50 bg-card p-4 transition-all hover:border-border/80 hover:shadow-sm md:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            tintBg[tint] ?? "bg-muted text-muted-foreground"
          )}
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
        {unit ? <span className="shrink-0 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
    </motion.div>
  )
}
