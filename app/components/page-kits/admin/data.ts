// Mock data for the admin app. Mirrors the entities described in project.md.

export type DevLevel = "A" | "B" | "C"

export type AdminAccount = {
  id: string
  name: string
  email: string
  avatar?: string
  registeredAt: string
  status: "active" | "suspended"
}

export type DevAccount = AdminAccount & {
  level: DevLevel
  finishedOrders: number
  rating: number
  skills: string[]
}

export type ClientAccount = AdminAccount & {
  creditScore: number
  projectsCount: number
  totalSpent: number
}

export type CsAccount = AdminAccount & {
  responsibleCount: number
  pendingAssignments: number
}

export type AdminProjectStatus =
  | "pending-confirm" // 客户与客服正在确认
  | "open" // 已上架接单大厅
  | "in-progress" // 已被开发者接单 · 开发中
  | "review" // 待客户验收
  | "settled" // 已结算完成
  | "frozen" // 冻结/争议

export type AdminProject = {
  id: string
  name: string
  client: string
  cs: string
  dev?: string
  level: DevLevel
  status: AdminProjectStatus
  progress: number
  budget: number
  paid: number
  unsettled: number
  createdAt: string
  nextMilestone?: string
  /** Chat group id in `dashboard/messages/data` (linking to the project conversation). */
  groupId?: string
}

export type AssignedClient = {
  id: string
  client: string
  contactEmail: string
  intent: string
  channel: string
  assignedAt: string
  csName: string
  /** AI-generated initial requirement card from the client's chat with the AI. */
  aiSpec: PendingSpec
}

export type PendingPhase = {
  label: string
  range: string
  items: string[]
}

export type PendingSpec = {
  projectName: string
  budget: string
  level: DevLevel
  estimatedPrice: string
  estimatedDuration: string
  requirementsMd: string
  phasesPrimary: PendingPhase[]
  phasesSecondary: PendingPhase[]
}

export type PendingMessageAuthor = "cs" | "client"

export type PendingMessage = {
  id: string
  author: PendingMessageAuthor
  time: string
  text: string
}

export type PendingThread = {
  pendingId: string
  messages: PendingMessage[]
}

export type IncomeBucket = {
  month: string
  total: number
  unsettled: number
  settled: number
}

export const devAccounts: DevAccount[] = [
  {
    id: "dev-001",
    name: "陈工",
    email: "chen.dev@lovedev.io",
    registeredAt: "2025-01-12",
    status: "active",
    level: "A",
    finishedOrders: 18,
    rating: 4.9,
    skills: ["React Native", "Node.js", "微信支付"],
  },
  {
    id: "dev-002",
    name: "李工",
    email: "li.dev@lovedev.io",
    registeredAt: "2025-02-05",
    status: "active",
    level: "B",
    finishedOrders: 14,
    rating: 4.7,
    skills: ["Vue 3", "TypeScript", "BullMQ"],
  },
  {
    id: "dev-003",
    name: "王工",
    email: "wang.dev@lovedev.io",
    registeredAt: "2024-12-23",
    status: "active",
    level: "B",
    finishedOrders: 9,
    rating: 4.6,
    skills: ["Next.js", "动效", "品牌"],
  },
  {
    id: "dev-004",
    name: "周工",
    email: "zhou.dev@lovedev.io",
    registeredAt: "2025-03-18",
    status: "suspended",
    level: "C",
    finishedOrders: 3,
    rating: 4.2,
    skills: ["微信小程序", "Taro"],
  },
]

export const clientAccounts: ClientAccount[] = [
  {
    id: "cli-001",
    name: "上海·萌爪科技",
    email: "ops@mengzhao.cn",
    registeredAt: "2025-01-22",
    status: "active",
    creditScore: 712,
    projectsCount: 2,
    totalSpent: 56400,
  },
  {
    id: "cli-002",
    name: "杭州·拾味 SaaS",
    email: "biz@shiwei.co",
    registeredAt: "2025-02-09",
    status: "active",
    creditScore: 668,
    projectsCount: 1,
    totalSpent: 15600,
  },
  {
    id: "cli-003",
    name: "深圳·万象云",
    email: "tech@wxcloud.com",
    registeredAt: "2024-11-30",
    status: "active",
    creditScore: 781,
    projectsCount: 3,
    totalSpent: 92000,
  },
  {
    id: "cli-004",
    name: "成都·川渝活动联合",
    email: "info@cy-events.cn",
    registeredAt: "2025-03-02",
    status: "active",
    creditScore: 598,
    projectsCount: 1,
    totalSpent: 4200,
  },
]

export const csAccounts: CsAccount[] = [
  {
    id: "cs-001",
    name: "客服·小张",
    email: "zhang.cs@lovedev.io",
    registeredAt: "2024-09-12",
    status: "active",
    responsibleCount: 6,
    pendingAssignments: 1,
  },
  {
    id: "cs-002",
    name: "客服·小李",
    email: "li.cs@lovedev.io",
    registeredAt: "2024-10-21",
    status: "active",
    responsibleCount: 4,
    pendingAssignments: 2,
  },
  {
    id: "cs-003",
    name: "客服·Lily",
    email: "lily.cs@lovedev.io",
    registeredAt: "2025-02-04",
    status: "active",
    responsibleCount: 3,
    pendingAssignments: 0,
  },
]

export const adminProjects: AdminProject[] = [
  {
    id: "PRJ-2403",
    name: "宠物社区 App",
    client: "上海·萌爪科技",
    cs: "客服·小张",
    dev: "陈工",
    level: "A",
    status: "in-progress",
    progress: 22,
    budget: 28000,
    paid: 8400,
    unsettled: 19600,
    createdAt: "2026-05-26",
    nextMilestone: "一期 · 应用骨架",
  },
  {
    id: "PRJ-2402",
    name: "餐厅点餐系统",
    client: "杭州·拾味 SaaS",
    cs: "客服·小张",
    dev: "李工",
    level: "B",
    status: "in-progress",
    progress: 65,
    budget: 15000,
    paid: 9000,
    unsettled: 6000,
    createdAt: "2026-05-01",
    nextMilestone: "三期 · 后台接口联调",
    groupId: "restaurant-pos",
  },
  {
    id: "PRJ-2401",
    name: "知识库问答 Agent",
    client: "深圳·万象云",
    cs: "客服·小李",
    dev: "陈工",
    level: "A",
    status: "open",
    progress: 0,
    budget: 32000,
    paid: 9600,
    unsettled: 22400,
    createdAt: "2026-05-29",
    nextMilestone: "等待开发者抢单",
  },
  {
    id: "PRJ-2400",
    name: "微信小程序 · 线下报名签到",
    client: "成都·川渝活动联合",
    cs: "客服·Lily",
    level: "C",
    status: "pending-confirm",
    progress: 0,
    budget: 4200,
    paid: 0,
    unsettled: 4200,
    createdAt: "2026-05-29",
    nextMilestone: "等待客户确认需求",
  },
  {
    id: "PRJ-2399",
    name: "企业官网重构",
    client: "北京·沐光科技",
    cs: "客服·小李",
    dev: "王工",
    level: "B",
    status: "review",
    progress: 85,
    budget: 12800,
    paid: 7680,
    unsettled: 5120,
    createdAt: "2026-05-08",
    nextMilestone: "首页交互验收中",
    groupId: "corp-site",
  },
  {
    id: "PRJ-2398",
    name: "数据分析后台",
    client: "上海·萌爪科技",
    cs: "客服·小李",
    dev: "陈工",
    level: "A",
    status: "settled",
    progress: 100,
    budget: 22000,
    paid: 22000,
    unsettled: 0,
    createdAt: "2026-03-12",
    nextMilestone: "已结算",
    groupId: "data-dashboard",
  },
  {
    id: "PRJ-2397",
    name: "电商小程序",
    client: "杭州·拾味 SaaS",
    cs: "客服·小张",
    dev: "陈工",
    level: "B",
    status: "in-progress",
    progress: 30,
    budget: 15000,
    paid: 6000,
    unsettled: 9000,
    createdAt: "2026-05-20",
    nextMilestone: "前端开发 · 组件库与页面骨架",
    groupId: "ecom-miniapp",
  },
]

const warehouseSpec: PendingSpec = {
  projectName: "仓储扫码盘点小程序",
  budget: "¥ 8,000 – 14,000",
  level: "B",
  estimatedPrice: "¥ 11,200",
  estimatedDuration: "18 天",
  requirementsMd: `# 项目概述

为城市仓配前置点位提供一套微信小程序，扫码识别 SKU → 自动盘点 → 异常上报。

## 核心模块

- **扫码盘点**：调用相机识别 SKU 条码，按区位 / 货架统计差异
- **任务编排**：日盘 / 周盘 / 月盘，自动派单
- **异常上报**：拍照 + 文字 + 位置上传
- **数据看板**：库存差异率、盘点完成率

## 技术建议

- 前端：\`Taro\` + \`React\`
- 后端复用客户现有的 ERP API`,
  phasesPrimary: [
    {
      label: "一期 · 扫码主流程",
      range: "Day 1 – 7",
      items: ["脚手架与登录", "扫码识别", "盘点提交"],
    },
    {
      label: "二期 · 任务编排",
      range: "Day 8 – 14",
      items: ["任务派单", "进度同步", "异常上报"],
    },
    {
      label: "三期 · 看板与上线",
      range: "Day 15 – 18",
      items: ["数据看板", "灰度试运行"],
    },
  ],
  phasesSecondary: [
    { label: "定金 · 30%", range: "签约托管", items: ["立项托管"] },
    { label: "里程碑款 · 40%", range: "Day 14 验收通过", items: ["主流程演示"] },
    { label: "尾款 · 30%", range: "上线交付", items: ["验收 / 30 天质保"] },
  ],
}

const cafeSpec: PendingSpec = {
  projectName: "海风咖啡多门店点单 + 会员",
  budget: "¥ 18,000 – 24,000",
  level: "A",
  estimatedPrice: "¥ 21,600",
  estimatedDuration: "32 天",
  requirementsMd: `# 项目概述

10 家门店统一点单 + 储值卡 + 会员等级。
门店切换需流畅，库存与价格按门店独立。

## 必备功能

- 微信小程序点单 + 自取 / 配送两种
- 储值卡 + 优惠券 + 会员等级
- 商户后台：门店、商品、库存、订单
- 数据看板：客单价、复购率、新老顾客

## 技术建议

- 前端：\`uni-app\`（小程序 + H5）
- 后端：\`NestJS\` + \`PostgreSQL\``,
  phasesPrimary: [
    {
      label: "一期 · 点单与会员",
      range: "Day 1 – 12",
      items: ["脚手架", "门店切换", "下单/支付", "会员体系"],
    },
    {
      label: "二期 · 商户后台",
      range: "Day 13 – 22",
      items: ["商品/库存", "订单管理", "门店权限"],
    },
    {
      label: "三期 · 看板与上线",
      range: "Day 23 – 32",
      items: ["数据看板", "灰度试运营", "正式发布"],
    },
  ],
  phasesSecondary: [
    { label: "定金 · 25%", range: "签约托管", items: ["立项托管"] },
    { label: "里程碑款 · 45%", range: "Day 22 验收", items: ["商户后台可用"] },
    { label: "尾款 · 30%", range: "上线交付", items: ["验收 / 30 天质保"] },
  ],
}

const eduSpec: PendingSpec = {
  projectName: "成人考研学习平台（Web + 小程序）",
  budget: "¥ 26,000 – 34,000",
  level: "A",
  estimatedPrice: "¥ 30,800",
  estimatedDuration: "42 天",
  requirementsMd: `# 项目概述

成人考研学习平台，Web 用于深度学习，小程序用于碎片化复习与社区。

## 模块

- 课程目录 / 视频播放 / 进度同步
- 题库 + 错题本 + 模拟卷
- 学习社区 + 学伴匹配
- 后台：课程管理、订单、内容审核

## 验收

- 视频播放 P95 首帧 < 1.5s
- 同账号 Web / 小程序进度互通`,
  phasesPrimary: [
    {
      label: "一期 · 课程与播放",
      range: "Day 1 – 18",
      items: ["脚手架", "课程目录", "视频播放", "进度同步"],
    },
    {
      label: "二期 · 题库与社区",
      range: "Day 19 – 32",
      items: ["题库", "错题本", "社区"],
    },
    {
      label: "三期 · 后台与上线",
      range: "Day 33 – 42",
      items: ["内容后台", "审核流", "上线"],
    },
  ],
  phasesSecondary: [
    { label: "定金 · 25%", range: "签约托管", items: ["立项托管"] },
    { label: "里程碑款 · 40%", range: "Day 32 验收", items: ["社区可用"] },
    { label: "尾款 · 35%", range: "上线交付", items: ["验收 / 60 天质保"] },
  ],
}

export const assignedClients: AssignedClient[] = [
  {
    id: "asg-1",
    client: "深圳·智慧仓储",
    contactEmail: "ops@zhihui-warehouse.cn",
    intent: "想做一个仓库扫码盘点的小程序，希望 2 周内试用",
    channel: "AI 入口 · 抖音广告",
    assignedAt: "今天 10:12",
    csName: "客服·小张",
    aiSpec: warehouseSpec,
  },
  {
    id: "asg-2",
    client: "厦门·海风咖啡",
    contactEmail: "boss@haifeng.coffee",
    intent: "10 家门店点单 + 会员系统",
    channel: "AI 入口 · 官方搜索",
    assignedAt: "今天 09:30",
    csName: "客服·小张",
    aiSpec: cafeSpec,
  },
  {
    id: "asg-3",
    client: "济南·儒慕教育",
    contactEmail: "li@rumu-edu.com",
    intent: "成人考研课程学习平台 Web + 小程序",
    channel: "AI 入口 · 公众号文章",
    assignedAt: "昨天 17:45",
    csName: "客服·小李",
    aiSpec: eduSpec,
  },
]

export const pendingThreads: Record<string, PendingMessage[]> = {
  "asg-1": [
    {
      id: "asg-1-m1",
      author: "client",
      time: "10:12",
      text: "你好，我们这边有 6 个前置仓，现在每周盘点都靠纸质表格，能不能做一个小程序扫码盘点？",
    },
    {
      id: "asg-1-m2",
      author: "cs",
      time: "10:15",
      text: "你好，我看到了 AI 帮你整理的需求初稿。这边有几个问题想确认：货架编码是已经统一了吗？打算让现场员工用自己手机还是 PDA？",
    },
    {
      id: "asg-1-m3",
      author: "client",
      time: "10:21",
      text: "货架编码统一了，分仓-货架-层位三级。员工自己手机就行，公司装企业微信。",
    },
  ],
  "asg-2": [
    {
      id: "asg-2-m1",
      author: "client",
      time: "09:30",
      text: "想做一套点单系统，10 家门店，要会员储值卡。",
    },
    {
      id: "asg-2-m2",
      author: "cs",
      time: "09:32",
      text: "你好，预算大概想控制在多少？需要先做小程序还是同时要 App？",
    },
    {
      id: "asg-2-m3",
      author: "client",
      time: "09:36",
      text: "2 万左右，先小程序，App 后面再说。希望尽快上线。",
    },
  ],
  "asg-3": [
    {
      id: "asg-3-m1",
      author: "client",
      time: "昨天 17:45",
      text: "成人考研课程，想要 Web 和小程序两端，能否做？",
    },
    {
      id: "asg-3-m2",
      author: "cs",
      time: "昨天 17:50",
      text: "可以。请问课程视频走第三方点播还是想自建？预算大概什么范围？",
    },
  ],
}

export const incomeBuckets: IncomeBucket[] = [
  { month: "11", total: 56000, unsettled: 12000, settled: 44000 },
  { month: "12", total: 71000, unsettled: 18000, settled: 53000 },
  { month: "01", total: 64000, unsettled: 14000, settled: 50000 },
  { month: "02", total: 82000, unsettled: 21000, settled: 61000 },
  { month: "03", total: 92000, unsettled: 24000, settled: 68000 },
  { month: "04", total: 106000, unsettled: 33000, settled: 73000 },
  { month: "05", total: 124000, unsettled: 47000, settled: 77000 },
]

export const statusTone: Record<AdminProjectStatus, string> = {
  "pending-confirm":
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  open: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "in-progress":
    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  review: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  settled:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  frozen: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
}

export const statusLabel: Record<AdminProjectStatus, string> = {
  "pending-confirm": "待确认",
  open: "已上架",
  "in-progress": "开发中",
  review: "待验收",
  settled: "已结算",
  frozen: "冻结",
}

// Helpers ----

export function projectsForCs(csName: string): AdminProject[] {
  return adminProjects.filter((p) => p.cs === csName)
}

export function pendingAssignmentsForCs(csName: string): AssignedClient[] {
  return assignedClients.filter((a) => a.csName === csName)
}

export function sumIncome(buckets: IncomeBucket[]) {
  return buckets.reduce(
    (acc, b) => {
      acc.total += b.total
      acc.unsettled += b.unsettled
      acc.settled += b.settled
      return acc
    },
    { total: 0, unsettled: 0, settled: 0 }
  )
}

export function formatCNY(n: number): string {
  return n.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

// -------------------- chart aggregations --------------------

export type ProjectStatusBucket = {
  status: AdminProjectStatus
  label: string
  count: number
  fill: string
}

export const projectStatusFill: Record<AdminProjectStatus, string> = {
  "pending-confirm": "var(--chart-4)",
  open: "var(--chart-1)",
  "in-progress": "var(--chart-2)",
  review: "var(--chart-3)",
  settled: "var(--chart-5)",
  frozen: "var(--destructive)",
}

export function projectStatusDistribution(): ProjectStatusBucket[] {
  const counts = new Map<AdminProjectStatus, number>()
  for (const p of adminProjects)
    counts.set(p.status, (counts.get(p.status) ?? 0) + 1)
  const statuses: AdminProjectStatus[] = [
    "open",
    "pending-confirm",
    "in-progress",
    "review",
    "settled",
    "frozen",
  ]
  return statuses
    .map((s) => ({
      status: s,
      label: statusLabel[s],
      count: counts.get(s) ?? 0,
      fill: projectStatusFill[s],
    }))
    .filter((b) => b.count > 0)
}

export type DevLevelBucket = {
  level: DevLevel
  count: number
  fill: string
}

export function devLevelDistribution(): DevLevelBucket[] {
  const counts: Record<DevLevel, number> = { A: 0, B: 0, C: 0 }
  for (const d of devAccounts) counts[d.level]++
  return (
    [
      { level: "A" as const, color: "var(--chart-3)" },
      { level: "B" as const, color: "var(--chart-2)" },
      { level: "C" as const, color: "var(--chart-1)" },
    ]
  ).map(({ level, color }) => ({ level, count: counts[level], fill: color }))
}
