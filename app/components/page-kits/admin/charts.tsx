"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"
import {
  devLevelDistribution,
  formatCNY,
  incomeBuckets,
  projectStatusDistribution,
  statusLabel,
  sumIncome,
  type AdminProjectStatus,
} from "./data"

// ---------- Project status distribution (donut) ----------

const statusChartConfig = {
  count: { label: "项目数" },
  open: { label: statusLabel.open, color: "var(--chart-1)" },
  "pending-confirm": {
    label: statusLabel["pending-confirm"],
    color: "var(--chart-4)",
  },
  "in-progress": {
    label: statusLabel["in-progress"],
    color: "var(--chart-2)",
  },
  review: { label: statusLabel.review, color: "var(--chart-3)" },
  settled: { label: statusLabel.settled, color: "var(--chart-5)" },
  frozen: { label: statusLabel.frozen, color: "var(--destructive)" },
} satisfies ChartConfig

export function ProjectStatusDonut() {
  const data = React.useMemo(() => projectStatusDistribution(), [])
  const total = data.reduce((acc, b) => acc + b.count, 0)

  return (
    <ChartContainer
      config={statusChartConfig}
      className="mx-auto aspect-square w-full max-w-[260px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              nameKey="status"
              labelFormatter={(_, payload) => {
                const status = payload?.[0]?.payload?.status as
                  | AdminProjectStatus
                  | undefined
                return status ? statusLabel[status] : ""
              }}
            />
          }
        />
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={50}
          outerRadius={72}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox))
                return null
              const cx = viewBox.cx ?? 0
              const cy = viewBox.cy ?? 0
              return (
                <g>
                  <text
                    x={cx}
                    y={cy - 50}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-foreground text-2xl font-semibold tabular-nums"
                  >
                    {total}
                  </text>
                  <text
                    x={cx}
                    y={cy - 30}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-muted-foreground text-[11px]"
                  >
                    项目总数
                  </text>
                </g>
              )
            }}
          />
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          className="mt-2 flex-wrap gap-2 [&>*]:basis-[calc(50%-0.5rem)] [&>*]:justify-start"
        />
      </PieChart>
    </ChartContainer>
  )
}

// ---------- Dev level distribution (bar) ----------

const levelChartConfig = {
  count: { label: "开发者数" },
  A: { label: "A 级", color: "var(--chart-3)" },
  B: { label: "B 级", color: "var(--chart-2)" },
  C: { label: "C 级", color: "var(--chart-1)" },
} satisfies ChartConfig

export function DevLevelBars() {
  const data = React.useMemo(() => devLevelDistribution(), [])

  return (
    <ChartContainer config={levelChartConfig} className="h-56 w-full">
      <BarChart data={data} barCategoryGap={32}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="level" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="count" hideLabel />}
        />
        <Bar dataKey="count" radius={[8, 8, 4, 4]}>
          {data.map((entry) => (
            <Cell key={entry.level} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

// ---------- Finance: monthly stacked bar (settled / unsettled) ----------

const monthlyConfig = {
  settled: { label: "已结算", color: "var(--chart-2)" },
  unsettled: { label: "未结算", color: "var(--chart-4)" },
} satisfies ChartConfig

export function MonthlyIncomeStackedBars() {
  const data = React.useMemo(
    () =>
      incomeBuckets.map((b) => ({
        month: `${b.month} 月`,
        settled: b.settled,
        unsettled: b.unsettled,
      })),
    []
  )

  return (
    <ChartContainer config={monthlyConfig} className="h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()
          }
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          content={
            <ChartTooltipContent
              formatter={(value, name, item) => {
                const numeric =
                  typeof value === "number" ? value : Number(value)
                return (
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block size-2 rounded-sm"
                        style={{
                          background: item.color,
                        }}
                      />
                      <span className="text-muted-foreground">
                        {monthlyConfig[name as keyof typeof monthlyConfig]?.label ??
                          name}
                      </span>
                    </div>
                    <span className="font-mono font-medium tabular-nums">
                      ¥{formatCNY(numeric)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="settled"
          stackId="income"
          fill="var(--color-settled)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="unsettled"
          stackId="income"
          fill="var(--color-unsettled)"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

// ---------- Finance: total income trend (area) ----------

const trendConfig = {
  total: { label: "总收入", color: "var(--chart-2)" },
} satisfies ChartConfig

export function MonthlyIncomeTrend() {
  const data = React.useMemo(
    () =>
      incomeBuckets.map((b) => ({
        month: `${b.month} 月`,
        total: b.total,
      })),
    []
  )

  return (
    <ChartContainer config={trendConfig} className="h-56 w-full">
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="adminIncomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-total)"
              stopOpacity={0.5}
            />
            <stop
              offset="95%"
              stopColor="var(--color-total)"
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tickFormatter={(v) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()
          }
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-mono font-medium tabular-nums">
                  ¥{formatCNY(typeof value === "number" ? value : Number(value))}
                </span>
              )}
            />
          }
        />
        <Area
          dataKey="total"
          type="monotone"
          stroke="var(--color-total)"
          strokeWidth={2}
          fill="url(#adminIncomeFill)"
        />
      </AreaChart>
    </ChartContainer>
  )
}

// ---------- Helpers ----------

export function useIncomeTotals() {
  return React.useMemo(() => sumIncome(incomeBuckets), [])
}
