export type GroupTint = "orange" | "blue" | "violet" | "emerald"

export type MilestoneStatus = "done" | "current" | "pending"

export type Milestone = {
  title: string
  desc?: string
  date?: string
  status: MilestoneStatus
}

export type Group = {
  id: string
  name: string
  avatar: string
  tint: GroupTint
  progress: number
  stage: string
  lastSender: string
  lastMsg: string
  time: string
  unread: number
  members: GroupMember[]
  milestones: Milestone[]
}

export type GroupMember = {
  name: string
  role: "dev" | "cs" | "client"
  avatar?: string
  initial: string
  tint: GroupTint
}

export type MessageItem = {
  id: string
  authorName: string
  authorRole: "dev" | "cs" | "client"
  authorInitial: string
  authorAvatar?: string
  authorTint: GroupTint
  time: string
  date?: string
  content: MessageContent
}

export const AVATAR_BY_ROLE: Record<"dev" | "cs" | "client", string> = {
  dev: "/assets/avatar%20(3).png",
  cs: "/assets/avatar%20(2).png",
  client: "/assets/avatar%20(1).png",
}

export const GROUP_AVATAR = "/assets/group-avatar.png"

export type ProgressStep = {
  title: string
  desc?: string
  done: boolean
  time?: string
}

export type ProgressShot = {
  src: string
  caption?: string
}

export type ProgressReport = {
  reportId: string
  date: string
  title: string
  summary: string
  steps: ProgressStep[]
  screenshots: ProgressShot[]
  note?: string
}

export type DeliverableFileKind = "image" | "doc" | "zip" | "other"

export type DeliverableFile = {
  id: string
  name: string
  size: string
  kind: DeliverableFileKind
  src?: string
}

export type SpecPhase = {
  label: string
  range: string
  items: string[]
}

export type SpecPayload = {
  projectName: string
  budget: string
  level: "C" | "B" | "A"
  estimatedPrice: string
  estimatedDuration: string
  requirementsMd: string
  phasesPrimary: SpecPhase[]
  phasesSecondary: SpecPhase[]
}

export type SpecCardVariant = "ai" | "cs"

export type MessageContent =
  | { kind: "text"; text: string }
  | { kind: "image"; src: string; caption?: string }
  | { kind: "system"; text: string }
  | { kind: "progress-report"; report: ProgressReport }
  | { kind: "progress-review"; reportDate: string; feedback?: string }
  | { kind: "acceptance-pass"; phase: string; feedback?: string }
  | { kind: "deliverable"; files: DeliverableFile[]; note?: string }
  | { kind: "spec-card"; spec: SpecPayload; variant: SpecCardVariant }

export const groups: Group[] = [
  {
    id: "restaurant-pos",
    name: "餐厅点餐系统",
    avatar: GROUP_AVATAR,
    tint: "orange",
    progress: 65,
    stage: "开发中",
    lastSender: "李工",
    lastMsg: "今日进度截图已上传，请查看",
    time: "刚刚",
    unread: 2,
    members: [
      { name: "李工", role: "dev", initial: "李", tint: "orange", avatar: AVATAR_BY_ROLE.dev },
      { name: "客服·小张", role: "cs", initial: "客", tint: "blue", avatar: AVATAR_BY_ROLE.cs },
      { name: "你", role: "client", initial: "我", tint: "violet", avatar: AVATAR_BY_ROLE.client },
    ],
    milestones: [
      { title: "需求确认", desc: "梳理菜品/订单/支付核心模块", date: "12月02日", status: "done" },
      { title: "合同与首期款", desc: "签订合同并托管 40% 款项", date: "12月05日", status: "done" },
      { title: "开发与联调", desc: "点餐主流程 / 厨房打印 / 报表", date: "12月15日", status: "current" },
      { title: "测试与验收", desc: "上线前回归测试与试运营", status: "pending" },
      { title: "尾款结算", desc: "验收通过后释放剩余 60%", status: "pending" },
    ],
  },
  {
    id: "ecom-miniapp",
    name: "电商小程序",
    avatar: GROUP_AVATAR,
    tint: "blue",
    progress: 30,
    stage: "开发中",
    lastSender: "客服·小张",
    lastMsg: "第二期款项已审核通过，可领取",
    time: "10:28",
    unread: 5,
    members: [
      { name: "陈工", role: "dev", initial: "陈", tint: "blue", avatar: AVATAR_BY_ROLE.dev },
      { name: "客服·小张", role: "cs", initial: "客", tint: "blue", avatar: AVATAR_BY_ROLE.cs },
      { name: "你", role: "client", initial: "我", tint: "violet", avatar: AVATAR_BY_ROLE.client },
    ],
    milestones: [
      { title: "需求确认", desc: "明确 SKU / 营销 / 支付路径", date: "11月20日", status: "done" },
      { title: "UI 设计", desc: "首页 / 分类 / 详情 / 购物车", date: "11月28日", status: "done" },
      { title: "前端开发", desc: "组件库与页面骨架搭建", date: "12月12日", status: "current" },
      { title: "接入微信支付", status: "pending" },
      { title: "测试与上线", status: "pending" },
    ],
  },
  {
    id: "corp-site",
    name: "企业官网重构",
    avatar: GROUP_AVATAR,
    tint: "violet",
    progress: 85,
    stage: "待验收",
    lastSender: "王工",
    lastMsg: "首页交互已完成，请验收",
    time: "昨天",
    unread: 0,
    members: [
      { name: "王工", role: "dev", initial: "王", tint: "violet", avatar: AVATAR_BY_ROLE.dev },
      { name: "客服·小李", role: "cs", initial: "客", tint: "blue", avatar: AVATAR_BY_ROLE.cs },
      { name: "你", role: "client", initial: "我", tint: "orange", avatar: AVATAR_BY_ROLE.client },
    ],
    milestones: [
      { title: "需求评估", desc: "页面盘点与改版策略", date: "10月18日", status: "done" },
      { title: "视觉与原型", date: "11月03日", status: "done" },
      { title: "前端切图与开发", date: "12月10日", status: "done" },
      { title: "客户验收", desc: "首页 / 关于 / 案例", status: "current" },
      { title: "上线与备案", status: "pending" },
    ],
  },
  {
    id: "data-dashboard",
    name: "数据分析后台",
    avatar: GROUP_AVATAR,
    tint: "emerald",
    progress: 10,
    stage: "等待接单",
    lastSender: "客服·小李",
    lastMsg: "项目已立项，等待程序员接单",
    time: "周三",
    unread: 0,
    members: [
      { name: "客服·小李", role: "cs", initial: "客", tint: "blue", avatar: AVATAR_BY_ROLE.cs },
      { name: "你", role: "client", initial: "我", tint: "emerald", avatar: AVATAR_BY_ROLE.client },
    ],
    milestones: [
      { title: "需求收集", date: "12月20日", status: "done" },
      { title: "项目立项", desc: "已上架接单列表，等待接单", status: "current" },
      { title: "签订合同", status: "pending" },
      { title: "开发与交付", status: "pending" },
    ],
  },
]

export function getGroupById(id: string | undefined): Group | undefined {
  if (!id) return undefined
  return groups.find((g) => g.id === id)
}

export const messagesByGroup: Record<string, MessageItem[]> = {
  "restaurant-pos": [
    {
      id: "m1",
      authorName: "客服·小张",
      authorRole: "cs",
      authorInitial: "客",
      authorAvatar: AVATAR_BY_ROLE.cs,
      authorTint: "blue",
      content: { kind: "system", text: "项目已立项，李工将负责本次开发交付" },
      date: "今天",
      time: "09:12",
    },
    {
      id: "m2",
      authorName: "李工",
      authorRole: "dev",
      authorInitial: "李",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "orange",
      content: {
        kind: "text",
        text: "你好，已经看完了需求文档，今天会先把点餐主流程的接口跑通，下午同步进度。",
      },
      time: "09:18",
    },
    {
      id: "m3",
      authorName: "你",
      authorRole: "client",
      authorInitial: "我",
      authorAvatar: AVATAR_BY_ROLE.client,
      authorTint: "violet",
      content: {
        kind: "text",
        text: "好的，期待今天的进展。另外厨房打印机的接入，能在这一期就考虑吗？",
      },
      time: "09:22",
    },
    {
      id: "m4",
      authorName: "李工",
      authorRole: "dev",
      authorInitial: "李",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "orange",
      content: {
        kind: "text",
        text: "可以，我把打印机模块挪到第二期开头。这是今天点餐主流程跑通后的截图：",
      },
      time: "14:46",
    },
    {
      id: "m5",
      authorName: "李工",
      authorRole: "dev",
      authorInitial: "李",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "orange",
      content: {
        kind: "image",
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
        caption: "点餐主流程联调截图",
      },
      time: "14:46",
    },
    {
      id: "m6",
      authorName: "李工",
      authorRole: "dev",
      authorInitial: "李",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "orange",
      time: "14:58",
      content: {
        kind: "progress-report",
        report: {
          reportId: "rp-1215",
          date: "12月15日",
          title: "今日开发进度",
          summary: "点餐主流程已全部跑通，明天将开始接入微信支付与厨房打印模块。",
          steps: [
            { title: "完成菜品分类接口", desc: "支持多级分类与标签筛选", done: true, time: "09:30" },
            { title: "完成订单创建接口", desc: "含库存校验与并发锁", done: true, time: "11:15" },
            { title: "联调点餐主流程", desc: "从下单到出单链路验证", done: true, time: "14:00" },
            { title: "单元测试覆盖率 ≥ 80%", desc: "订单与支付模块为主", done: false },
          ],
          screenshots: [
            {
              src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop",
              caption: "点餐主流程联调截图",
            },
            {
              src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
              caption: "后台订单监控页",
            },
          ],
          note: "如果今晚发现紧急问题，会在群里同步补丁；否则明早 9 点继续。",
        },
      },
    },
    {
      id: "m6b",
      authorName: "客服·小张",
      authorRole: "cs",
      authorInitial: "客",
      authorAvatar: AVATAR_BY_ROLE.cs,
      authorTint: "blue",
      content: { kind: "system", text: "第二期款项已托管至平台，验收后自动结算给李工" },
      time: "15:02",
    },
    {
      id: "m7",
      authorName: "你",
      authorRole: "client",
      authorInitial: "我",
      authorAvatar: AVATAR_BY_ROLE.client,
      authorTint: "violet",
      content: { kind: "text", text: "👌 收到，进度很赞，辛苦了。" },
      time: "15:08",
    },
  ],
  "ecom-miniapp": [
    {
      id: "e1",
      authorName: "客服·小张",
      authorRole: "cs",
      authorInitial: "客",
      authorAvatar: AVATAR_BY_ROLE.cs,
      authorTint: "blue",
      content: { kind: "system", text: "第二期款项已审核通过，可领取" },
      date: "今天",
      time: "10:28",
    },
    {
      id: "e2",
      authorName: "陈工",
      authorRole: "dev",
      authorInitial: "陈",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "blue",
      content: { kind: "text", text: "首页和分类页基本完成，等你方确认 UI 后我开始接入支付。" },
      time: "10:34",
    },
  ],
  "corp-site": [
    {
      id: "c1",
      authorName: "王工",
      authorRole: "dev",
      authorInitial: "王",
      authorAvatar: AVATAR_BY_ROLE.dev,
      authorTint: "violet",
      content: { kind: "text", text: "首页交互已经完成，请验收，有任何细节问题随时反馈。" },
      date: "昨天",
      time: "18:42",
    },
    {
      id: "c2",
      authorName: "你",
      authorRole: "client",
      authorInitial: "我",
      authorAvatar: AVATAR_BY_ROLE.client,
      authorTint: "violet",
      content: {
        kind: "acceptance-pass",
        phase: "第二期 · 首页交互",
        feedback: "整体体验流畅，可以进入下一期",
      },
      date: "今天",
      time: "09:20",
    },
  ],
  "data-dashboard": [
    {
      id: "d1",
      authorName: "客服·小李",
      authorRole: "cs",
      authorInitial: "客",
      authorAvatar: AVATAR_BY_ROLE.cs,
      authorTint: "blue",
      content: { kind: "system", text: "项目已立项，正在为你匹配合适的开发者" },
      date: "周三",
      time: "16:00",
    },
  ],
}

// -------------------- Deliverables (产物) store --------------------

export type Deliverable = {
  id: string
  groupId: string
  uploadedBy: string
  time: string
  files: DeliverableFile[]
  note?: string
}

const initialArtifacts: Deliverable[] = [
  {
    id: "seed-ecom-1",
    groupId: "ecom-miniapp",
    uploadedBy: "陈工",
    time: "刚刚",
    files: [
      {
        id: "f-ecom-1",
        name: "首页 UI 设计稿_v2.fig",
        size: "12.4 MB",
        kind: "image",
      },
    ],
  },
  {
    id: "seed-pos-1",
    groupId: "restaurant-pos",
    uploadedBy: "李工",
    time: "昨天",
    files: [
      {
        id: "f-pos-1",
        name: "今日进度截图.zip",
        size: "4.1 MB",
        kind: "zip",
      },
    ],
  },
  {
    id: "seed-pos-2",
    groupId: "restaurant-pos",
    uploadedBy: "李工",
    time: "2 天前",
    files: [
      {
        id: "f-pos-2",
        name: "后端接口文档.md",
        size: "156 KB",
        kind: "doc",
      },
    ],
  },
  {
    id: "seed-dashboard-1",
    groupId: "data-dashboard",
    uploadedBy: "客服·小李",
    time: "3 天前",
    files: [
      {
        id: "f-dash-1",
        name: "数据库设计.pdf",
        size: "2.3 MB",
        kind: "doc",
      },
    ],
  },
]

let deliverableStore: Deliverable[] = [...initialArtifacts]
const deliverableListeners = new Set<() => void>()

export function getDeliverables(): Deliverable[] {
  return deliverableStore
}

export function appendDeliverable(d: Deliverable) {
  deliverableStore = [d, ...deliverableStore]
  for (const listener of deliverableListeners) listener()
}

export function subscribeDeliverables(cb: () => void): () => void {
  deliverableListeners.add(cb)
  return () => {
    deliverableListeners.delete(cb)
  }
}

export function detectFileKind(filename: string): DeliverableFileKind {
  const lower = filename.toLowerCase()
  if (/\.(png|jpe?g|gif|webp|svg|bmp|heic)$/.test(lower)) return "image"
  if (/\.(zip|rar|7z|tar|gz)$/.test(lower)) return "zip"
  if (/\.(pdf|md|markdown|txt|docx?|xlsx?|pptx?|csv|json|ya?ml|fig)$/.test(lower))
    return "doc"
  return "other"
}

export function humanFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export const tintBg: Record<GroupTint, string> = {
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
}

export function getLatestReport(groupId: string): ProgressReport | undefined {
  const list = messagesByGroup[groupId] ?? []
  for (let i = list.length - 1; i >= 0; i--) {
    const m = list[i]
    if (m.content.kind === "progress-report") return m.content.report
  }
  return undefined
}

export const roleBadge: Record<MessageItem["authorRole"], { label: string; cls: string }> = {
  dev: {
    label: "开发者",
    cls: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  },
  cs: {
    label: "客服",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
  client: {
    label: "我",
    cls: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  },
}