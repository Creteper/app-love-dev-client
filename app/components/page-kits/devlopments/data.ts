import {
  AppWindow,
  Bot,
  Boxes,
  Cpu,
  Globe,
  Layers,
  Palette,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

export type DevLevel = "A" | "B" | "C"

export type ActivitySlide = {
  id: string
  eyebrow: string
  title: string
  description: string
  cta: string
  tone: "violet" | "amber" | "emerald" | "sky"
}

export const activitySlides: ActivitySlide[] = [
  {
    id: "season-1",
    eyebrow: "本周精选",
    title: "高质量需求批量上架",
    description: "本周新入驻 18 个客户、累计需求总额 ¥ 86,400，A 级单仅限 A 级开发者可接。",
    cta: "立即查看",
    tone: "violet",
  },
  {
    id: "promo-1",
    eyebrow: "平台活动",
    title: "完单赢经验加成 · 升级更快一档",
    description: "活动期内每完成 1 单可获 1.5 倍经验值，连续完单 5 单额外奖励 ¥ 300。",
    cta: "了解规则",
    tone: "amber",
  },
  {
    id: "credit-1",
    eyebrow: "结算",
    title: "结算周期升级为 T+1",
    description: "项目阶段确认通过后，结算款将在下一个工作日打入平台余额。",
    cta: "查看政策",
    tone: "emerald",
  },
  {
    id: "skill-1",
    eyebrow: "技能",
    title: "新增 AI 应用 / Agent 分类",
    description: "已认证开发者可在「我的技能」中追加 AI 方向，匹配相关高价值需求。",
    cta: "去补充",
    tone: "sky",
  },
]

export type CategoryTone =
  | "sky"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "teal"
  | "indigo"
  | "slate"

export type Category = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  count: number
  tone: CategoryTone
}

export const categories: Category[] = [
  {
    id: "web",
    title: "Web 网站",
    description: "企业官网 · 后台 · 中后台",
    icon: Globe,
    count: 48,
    tone: "sky",
  },
  {
    id: "mobile",
    title: "移动应用",
    description: "iOS · Android · 跨端",
    icon: Smartphone,
    count: 27,
    tone: "violet",
  },
  {
    id: "miniapp",
    title: "小程序",
    description: "微信 · 抖音 · 支付宝",
    icon: AppWindow,
    count: 33,
    tone: "emerald",
  },
  {
    id: "ai",
    title: "AI 应用",
    description: "Agent · RAG · 模型微调",
    icon: Bot,
    count: 19,
    tone: "rose",
  },
  {
    id: "design",
    title: "设计",
    description: "UI · 品牌 · 插画",
    icon: Palette,
    count: 12,
    tone: "amber",
  },
  {
    id: "backend",
    title: "后端服务",
    description: "API · 数据库 · 部署",
    icon: Layers,
    count: 22,
    tone: "teal",
  },
  {
    id: "embedded",
    title: "嵌入式",
    description: "硬件 · IoT · 固件",
    icon: Cpu,
    count: 7,
    tone: "indigo",
  },
  {
    id: "other",
    title: "更多领域",
    description: "脚本 · 自动化 · 其它",
    icon: Boxes,
    count: 14,
    tone: "slate",
  },
]

export type OrderMilestoneStatus = "done" | "current" | "pending"

export type OrderMilestone = {
  title: string
  desc?: string
  date?: string
  status: OrderMilestoneStatus
}

export type OrderPhase = {
  label: string
  range: string
  items: string[]
}

export type OrderDetail = {
  requirementsMd: string
  milestones: OrderMilestone[]
  phasesPrimary: OrderPhase[]
  phasesSecondary: OrderPhase[]
}

export type Order = {
  id: string
  title: string
  summary: string
  category: string
  level: DevLevel
  budget: number
  duration: string
  postedAt: string
  bids: number
  client: string
  tags: string[]
  detail?: OrderDetail
}

export const orders: Order[] = [
  {
    id: "ORD-2403",
    title: "宠物社区 App · iOS + Android 跨端开发",
    summary:
      "包含动态时间线、宠物档案、同城匹配与商城模块。客户已确认设计稿，需要 4 周内完成首版交付。",
    category: "移动应用",
    level: "A",
    budget: 28000,
    duration: "4 周",
    postedAt: "2 分钟前",
    bids: 3,
    client: "上海 · 萌爪科技",
    tags: ["React Native", "云开发", "已付定金"],
    detail: {
      requirementsMd: `# 项目概述

面向都市养宠人群的轻社区 + 商城混合 App，跨 iOS 与 Android，首版以 \`React Native\` 实现。

## 核心模块

- **动态时间线**：图文 / 短视频混排，关注、推荐、同城三 Tab
- **宠物档案**：多宠绑定、疫苗 / 体检提醒、医疗记录
- **同城匹配**：定位、宠物画像、邀约见面（线下）
- **商城**：商品、SKU、购物车、微信支付与发货
- **消息**：私信 + 系统通知

## 技术与交付

- 前端：\`React Native\` 0.74 + \`TypeScript\`
- 后端：\`NestJS\` + \`PostgreSQL\`（沿用客户现有云服务）
- 支付：微信 / Apple IAP 双通道
- 设计稿：已由客户提供 Figma 主线，开发者可建议优化

## 验收标准

- 主流程冷启动 < 2.5s，列表滚动稳定 60 FPS
- 单元测试覆盖率 ≥ 70%
- 双端首版 TestFlight / 内部分发可装机`,
      milestones: [
        {
          title: "需求与报价确认",
          desc: "客户与客服已对齐核心模块与价格",
          date: "今日 09:14",
          status: "done",
        },
        {
          title: "项目上架接单大厅",
          desc: "定金 30% 已托管",
          date: "今日 10:02",
          status: "done",
        },
        {
          title: "等待开发者抢单",
          desc: "需要 A 级及以上开发者",
          status: "current",
        },
        { title: "签约与首期款释放", status: "pending" },
        { title: "一期 · 骨架与时间线", status: "pending" },
        { title: "二期 · 档案与同城", status: "pending" },
        { title: "三期 · 商城与支付", status: "pending" },
        { title: "上线验收与尾款结算", status: "pending" },
      ],
      phasesPrimary: [
        {
          label: "一期 · 应用骨架",
          range: "Day 1 – Day 8",
          items: [
            "脚手架与 CI",
            "导航与主题、Tab 框架",
            "动态流（关注 / 推荐 / 同城）",
          ],
        },
        {
          label: "二期 · 档案 & 匹配",
          range: "Day 9 – Day 18",
          items: [
            "宠物档案 CRUD",
            "疫苗 / 体检提醒",
            "同城匹配与地图",
          ],
        },
        {
          label: "三期 · 商城闭环",
          range: "Day 19 – Day 28",
          items: [
            "商品 / SKU / 购物车",
            "微信 + Apple IAP",
            "订单 / 物流 / 售后",
            "性能与上线",
          ],
        },
      ],
      phasesSecondary: [
        {
          label: "定金 · 30%",
          range: "项目立项已托管",
          items: ["客户 30% 款项已托管至平台"],
        },
        {
          label: "里程碑款 · 35%",
          range: "Day 18 验收通过",
          items: ["一期 & 二期联调验收", "TestFlight 可装机"],
        },
        {
          label: "尾款 · 35%",
          range: "上线交付",
          items: ["双端上架 / 内部分发", "30 天质保"],
        },
      ],
    },
  },
  {
    id: "ORD-2402",
    title: "面向中小餐饮的 SaaS 收银后台",
    summary:
      "现有 Vue2 老后台需升级为 Vue3 + TypeScript，包含订单、库存、报表三大模块的页面重构。",
    category: "Web 网站",
    level: "B",
    budget: 15600,
    duration: "3 周",
    postedAt: "8 分钟前",
    bids: 5,
    client: "杭州 · 拾味 SaaS",
    tags: ["Vue 3", "TypeScript", "ECharts"],
  },
  {
    id: "ORD-2401",
    title: "知识库问答 Agent · 私有部署",
    summary:
      "基于客户内部 1500 篇 Markdown 文档构建 RAG 问答，需要支持权限隔离与浏览记录回放。",
    category: "AI 应用",
    level: "A",
    budget: 32000,
    duration: "5 周",
    postedAt: "21 分钟前",
    bids: 2,
    client: "深圳 · 万象云",
    tags: ["LangChain", "向量库", "权限"],
    detail: {
      requirementsMd: `# 项目概述

为客户企业内部 \`1500\` 篇 Markdown 文档构建一套 **RAG 问答 Agent**，需要私有部署，禁止任何数据出网。

## 必备功能

- **多租户权限**：基于部门 / 项目的文档可见范围
- **检索召回**：BM25 + 向量混合召回，重排可调
- **会话与回放**：保留用户提问与引用片段，可逐条回看
- **审计**：所有问答有迹可循，可导出 CSV

## 技术栈建议

- 模型：客户已有 \`Qwen2.5-72B\` 内网部署，开发者可建议是否引入 reranker
- 向量库：\`Milvus\` / \`pgvector\` 二选一
- 编排：\`LangChain\` 或自研最小 Agent 框架
- 前端：\`React\` + \`Vite\`，单页面工具

## 验收标准

- 召回 Top5 命中率 ≥ 85%（客户提供评测集）
- 单次问答首 token < 1.5s
- 全部部署脚本与运维文档可移交`,
      milestones: [
        {
          title: "需求与报价确认",
          desc: "客户已签订保密协议",
          date: "今日 08:30",
          status: "done",
        },
        {
          title: "项目上架接单大厅",
          desc: "定金 30% 已托管",
          date: "今日 09:00",
          status: "done",
        },
        {
          title: "等待开发者抢单",
          desc: "需要 A 级开发者 · 有 RAG 经验优先",
          status: "current",
        },
        { title: "签约与首期款释放", status: "pending" },
        { title: "一期 · 索引与召回", status: "pending" },
        { title: "二期 · 权限与会话", status: "pending" },
        { title: "三期 · 评测与上线", status: "pending" },
        { title: "验收与尾款结算", status: "pending" },
      ],
      phasesPrimary: [
        {
          label: "一期 · 索引与召回",
          range: "Day 1 – Day 12",
          items: [
            "文档解析与切片策略",
            "BM25 + 向量召回管线",
            "在客户提供的评测集上调参",
          ],
        },
        {
          label: "二期 · 权限与会话",
          range: "Day 13 – Day 24",
          items: [
            "多租户权限模型",
            "会话存储与引用片段回放",
            "审计与导出",
          ],
        },
        {
          label: "三期 · 评测与上线",
          range: "Day 25 – Day 35",
          items: [
            "评测脚本与回归报告",
            "私有化部署脚本（Compose / Helm 二选一）",
            "运维文档与培训",
          ],
        },
      ],
      phasesSecondary: [
        {
          label: "定金 · 30%",
          range: "项目立项已托管",
          items: ["客户 30% 款项已托管至平台"],
        },
        {
          label: "里程碑款 · 40%",
          range: "Day 24 验收通过",
          items: ["权限 & 会话功能可演示", "评测集首轮 ≥ 80%"],
        },
        {
          label: "尾款 · 30%",
          range: "上线交付",
          items: ["客户内网部署完成", "30 天质保"],
        },
      ],
    },
  },
  {
    id: "ORD-2400",
    title: "微信小程序 · 线下活动报名与签到",
    summary:
      "需求清晰：报名表单 + 现场二维码签到 + 数据看板，需要支持企业微信扫码。",
    category: "小程序",
    level: "C",
    budget: 4200,
    duration: "10 天",
    postedAt: "33 分钟前",
    bids: 11,
    client: "成都 · 川渝活动联合",
    tags: ["微信小程序", "Taro", "标准化需求"],
  },
  {
    id: "ORD-2399",
    title: "硬件巡检 PDA 程序",
    summary:
      "手持终端上的巡检 App，扫码 → 抓拍 → 上传 → 离线缓存。客户提供接口文档。",
    category: "嵌入式",
    level: "B",
    budget: 9800,
    duration: "2 周",
    postedAt: "1 小时前",
    bids: 4,
    client: "苏州 · 工正智造",
    tags: ["Android", "蓝牙", "离线优先"],
  },
  {
    id: "ORD-2398",
    title: "品牌官网重做 · 含一套 VI",
    summary:
      "客户希望走 Apple 极简风格，需要包含 Hero、产品、新闻、招聘等 6 个页面，并附带 Logo 简化版本。",
    category: "Web 网站",
    level: "B",
    budget: 12800,
    duration: "3 周",
    postedAt: "2 小时前",
    bids: 6,
    client: "北京 · 沐光科技",
    tags: ["品牌", "Next.js", "动效"],
  },
  {
    id: "ORD-2397",
    title: "教育类小程序 · 错题本",
    summary:
      "拍照识别题目 → 生成错题集 → 知识点串联。客户已购买 OCR 接口，需开发者集成。",
    category: "小程序",
    level: "B",
    budget: 7600,
    duration: "2 周",
    postedAt: "3 小时前",
    bids: 9,
    client: "西安 · 习思教育",
    tags: ["OCR", "微信小程序"],
  },
  {
    id: "ORD-2396",
    title: "Node 服务端定时任务调度面板",
    summary:
      "现有 cron 调度系统加一个可视化管理后台：任务列表、运行历史、失败重试。",
    category: "后端服务",
    level: "C",
    budget: 5400,
    duration: "10 天",
    postedAt: "今日上午",
    bids: 7,
    client: "南京 · 浩源数据",
    tags: ["Node", "BullMQ", "Admin"],
  },
  {
    id: "ORD-2395",
    title: "B 端表单中台 · 低代码编辑器",
    summary:
      "拖拽生成表单、流程审批、字段权限。客户希望迭代 6 周后上线第一版。",
    category: "Web 网站",
    level: "A",
    budget: 36800,
    duration: "6 周",
    postedAt: "今日上午",
    bids: 2,
    client: "广州 · 凡途软件",
    tags: ["React", "DSL", "权限"],
  },
  {
    id: "ORD-2394",
    title: "插画接单 · 6 张系列宣传图",
    summary:
      "国潮风 + 节气主题，6 张成品 + 3 轮修改，提供文案与色卡。",
    category: "设计",
    level: "C",
    budget: 3200,
    duration: "12 天",
    postedAt: "昨天",
    bids: 14,
    client: "杭州 · 茶语行旅",
    tags: ["插画", "国潮", "系列"],
  },
  {
    id: "ORD-2393",
    title: "电子签到屏 · 树莓派部署",
    summary:
      "展会现场用，扫码后大屏滚动展示头像与公司名，需要兼容老旧投影分辨率。",
    category: "嵌入式",
    level: "C",
    budget: 2800,
    duration: "1 周",
    postedAt: "昨天",
    bids: 8,
    client: "上海 · 会展易",
    tags: ["树莓派", "Electron", "现场部署"],
  },
  {
    id: "ORD-2392",
    title: "智能客服 Agent · 多渠道接入",
    summary:
      "接入企业微信、抖音私信、网页客服三端，自动分流给人工。",
    category: "AI 应用",
    level: "A",
    budget: 42000,
    duration: "6 周",
    postedAt: "昨天",
    bids: 1,
    client: "上海 · 客小二",
    tags: ["Agent", "多模态", "高优"],
  },
]

export type RecentMessage = {
  id: string
  group: string
  preview: string
  time: string
  unread?: number
}

export const recentMessages: RecentMessage[] = [
  {
    id: "msg-1",
    group: "宠物社区 App 项目群",
    preview: "客服 Lily：客户已确认第一阶段交付时间。",
    time: "刚刚",
    unread: 2,
  },
  {
    id: "msg-2",
    group: "知识库 Agent 项目群",
    preview: "客户：能否在周五上午演示一下检索效果？",
    time: "12 分钟前",
    unread: 1,
  },
  {
    id: "msg-3",
    group: "拾味 SaaS 后台项目群",
    preview: "你：今天已经把订单模块联调完成。",
    time: "1 小时前",
  },
  {
    id: "msg-4",
    group: "平台公告",
    preview: "5 月 30 日将进行结算系统升级，预计 30 分钟。",
    time: "今日 9:12",
  },
]

function synthDetail(order: Order): OrderDetail {
  const requirementsMd = `# 项目概述

${order.summary}

## 关键信息

- **分类**：${order.category}
- **难度等级**：${order.level} 级
- **客户**：${order.client}
- **预估工期**：${order.duration}

## 技术关键词

${order.tags.map((t) => `- ${t}`).join("\n")}

## 验收要点

- 阶段交付前需提交进度截图与说明
- 上线前完成核心链路回归
- 完结后 30 天质保`

  const milestones: OrderMilestone[] = [
    {
      title: "需求与报价确认",
      desc: "客户与客服已对齐核心模块",
      status: "done",
    },
    {
      title: "项目上架接单大厅",
      desc: "定金已托管",
      status: "done",
    },
    {
      title: "等待开发者抢单",
      desc: `当前 ${order.bids} 人查看意向，${order.postedAt}发布`,
      status: "current",
    },
    { title: "签约与首期款释放", status: "pending" },
    { title: "阶段开发与每日进度", status: "pending" },
    { title: "客户验收", status: "pending" },
    { title: "尾款结算", status: "pending" },
  ]

  const phasesPrimary: OrderPhase[] = [
    {
      label: "一期 · 骨架与核心链路",
      range: `${order.duration} · 前 1/3`,
      items: ["脚手架与基础页面", "核心数据模型与接口", "联调主流程"],
    },
    {
      label: "二期 · 模块完善",
      range: `${order.duration} · 中段`,
      items: ["细分功能开发", "异常路径与权限", "数据校验"],
    },
    {
      label: "三期 · 交付与上线",
      range: `${order.duration} · 末段`,
      items: ["性能优化", "回归测试", "上线 / 部署"],
    },
  ]

  const phasesSecondary: OrderPhase[] = [
    {
      label: "定金 · 30%",
      range: "项目立项已托管",
      items: ["客户 30% 款项已托管至平台"],
    },
    {
      label: "里程碑款 · 40%",
      range: "中段验收通过",
      items: ["阶段功能演示", "可用 Demo 交付"],
    },
    {
      label: "尾款 · 30%",
      range: "上线交付",
      items: ["验收通过", "30 天质保"],
    },
  ]

  return { requirementsMd, milestones, phasesPrimary, phasesSecondary }
}

export function getOrderById(
  id: string | undefined
): { order: Order; detail: OrderDetail } | undefined {
  if (!id) return undefined
  const order = orders.find((o) => o.id === id)
  if (!order) return undefined
  return { order, detail: order.detail ?? synthDetail(order) }
}