export type ChatStatusTone = "amber" | "blue" | "green" | "neutral"

export type ProjectPhase = {
  label: string
  range: string
  items: string[]
}

export type ProjectSpec = {
  projectName: string
  budget: string
  level: "C" | "B" | "A"
  estimatedPrice: string
  estimatedDuration: string
  requirementsMd: string
  phasesPrimary: ProjectPhase[]
  phasesSecondary: ProjectPhase[]
}

export type ChatItem = {
  id: string
  title: string
  status: string
  statusTone: ChatStatusTone
  estimate: string
  teaser: string
  time: string
  spec?: ProjectSpec
}

const ecomSpec: ProjectSpec = {
  projectName: "电商小程序",
  budget: "¥ 8,000 – 12,000",
  level: "B",
  estimatedPrice: "¥ 10,800",
  estimatedDuration: "21 天",
  requirementsMd: `# 项目概述

面向中小商家的微信小程序电商系统，覆盖商品上架、订单管理、微信支付与物流追踪。

## 核心模块

- **商品中心**：分类、SKU、库存、上下架管理
- **订单系统**：购物车、下单、支付、售后
- **会员体系**：注册登录、积分、优惠券、地址簿
- **营销工具**：满减、限时折扣、分享有礼
- **数据看板**：销售额、订单量、复购率

## 技术方案

- 前端：\`Taro\` + \`React\`（一套代码兼容微信 / 抖音小程序）
- 后端：\`Node.js\` + \`NestJS\`，数据库 \`PostgreSQL\`
- 支付：微信支付 V3，回调走平台中转
- 部署：阿里云 ECS + OSS 静态资源

## 验收标准

- 商家可独立完成商品上架与订单处理流程
- 支付成功率 ≥ 99%，秒级回调
- 首屏加载 < 1.5s，核心接口 P95 < 300ms
`,
  phasesPrimary: [
    {
      label: "一期 · 基础骨架",
      range: "Day 1 – Day 7",
      items: [
        "技术选型 & 项目脚手架",
        "登录注册 / 用户中心",
        "商品列表 & 详情页",
        "购物车与下单流程",
      ],
    },
    {
      label: "二期 · 交易闭环",
      range: "Day 8 – Day 14",
      items: [
        "微信支付 V3 接入",
        "订单管理与售后",
        "商家后台 - 商品管理",
        "优惠券 & 满减规则",
      ],
    },
    {
      label: "三期 · 数据与上线",
      range: "Day 15 – Day 21",
      items: [
        "数据看板与统计",
        "性能优化 & 灰度测试",
        "ICP 备案 & 正式发布",
      ],
    },
  ],
  phasesSecondary: [
    {
      label: "里程碑款 · 30%",
      range: "Day 7 验收通过",
      items: ["脚手架交付", "基础页面 Demo"],
    },
    {
      label: "里程碑款 · 40%",
      range: "Day 14 验收通过",
      items: ["支付链路打通", "商家后台可用"],
    },
    {
      label: "尾款 · 30%",
      range: "Day 21 上线交付",
      items: ["上线验收", "30 天质保"],
    },
  ],
}

export const chats: ChatItem[] = [
  {
    id: "ecom-miniapp",
    title: "电商小程序开发",
    status: "需求中",
    statusTone: "amber",
    estimate: "¥8,000 – 12,000",
    teaser: "我已根据你的描述梳理出核心模块：商品管理、订单系统、微信支付集成…",
    time: "刚刚",
    spec: ecomSpec,
  },
  {
    id: "restaurant-pos",
    title: "餐厅点餐系统",
    status: "已转客服",
    statusTone: "blue",
    estimate: "¥15,000",
    teaser: "已为你匹配资深开发者，客服小张正在协助你确认最终交付细节。",
    time: "2 小时前",
  },
  {
    id: "corp-site",
    title: "企业官网重构",
    status: "草稿",
    statusTone: "neutral",
    estimate: "待评估",
    teaser: "方便描述一下当前网站存在的问题，以及你期望改进的方向吗？",
    time: "昨天",
  },
  {
    id: "data-dashboard",
    title: "数据分析后台",
    status: "已确认",
    statusTone: "green",
    estimate: "¥22,000",
    teaser: "需求已确认，项目已上架接单列表，正在等待程序员接单。",
    time: "3 天前",
  },
]

export function getChatById(id: string | undefined): ChatItem | undefined {
  if (!id) return undefined
  return chats.find((c) => c.id === id)
}
