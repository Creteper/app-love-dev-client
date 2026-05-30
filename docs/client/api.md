# 客户端 API

> 遵循 [通用约定](../shared/common.md)。所有接口需携带 `Authorization: Bearer <access_token>`（鉴权接口除外，见 [auth/](../auth/api.md)）。

---

## 目录

- [1. 用户信息](#1-用户信息)
- [2. 实名认证](#2-实名认证)
- [3. 钱包](#3-钱包)
- [4. AI 对话](#4-ai-对话)
- [5. 项目管理](#5-项目管理)
- [6. 项目群消息](#6-项目群消息)
- [7. 通知](#7-通知)
- [8. 评价开发者](#8-评价开发者)

---

## 1. 用户信息

### 1.1 获取个人信息

```http
GET /api/v1/client/profile
```

权限：`client`

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "userId": "cli-abc123",
    "name": "Creteper",
    "email": "mycreteper@gmail.com",
    "phone": "+86 138****8888",
    "avatar": "https://cdn.lovedev.cn/avatars/abc123.png",
    "creditScore": 650,
    "realNameVerified": true,
    "registeredAt": "2024-11-15T10:00:00+08:00"
  }
}
```

### 1.2 更新个人信息

```http
PUT /api/v1/client/profile
Content-Type: application/json

{
  "name": "Creteper",
  "phone": "+86 13900001111",
  "avatar": "https://cdn.lovedev.cn/avatars/new.png"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | | 昵称 |
| `phone` | `string` | | 手机号 |
| `avatar` | `string` | | 头像 URL（先上传后提交 URL） |

---

## 2. 实名认证

### 2.1 提交实名认证

```http
POST /api/v1/client/real-name
Content-Type: application/json

{
  "realName": "张三",
  "idNumber": "310101199001011234"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `realName` | `string` | ✓ | 真实姓名 |
| `idNumber` | `string` | ✓ | 身份证号，后端做格式校验 |

**响应** (201)：

```json
{
  "code": 0,
  "message": "实名认证提交成功"
}
```

### 2.2 查询实名认证状态

```http
GET /api/v1/client/real-name
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "verified": true,
    "realName": "张*",
    "idNumber": "310101********1234",
    "verifiedAt": "2025-01-20T15:00:00+08:00"
  }
}
```

> 未实名时 `verified` 为 `false`，`realName` 和 `idNumber` 为 `null`。

---

## 3. 钱包

### 3.1 查询钱包

```http
GET /api/v1/client/wallet
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "available": 128.00,
    "frozen": 36800.00,
    "totalTopup": 52000.00
  }
}
```

| 字段 | 说明 |
|------|------|
| `available` | 可用余额，可用于新项目托管 |
| `frozen` | 冻结余额，项目托管中的资金 |
| `totalTopup` | 历史累计充值总额 |

### 3.2 充值

```http
POST /api/v1/client/wallet/topup
Content-Type: application/json

{
  "amount": 500,
  "method": "wechat"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `amount` | `number` | ✓ | 充值金额（元），最低 `10` |
| `method` | `string` | ✓ | 支付方式：`wechat` / `alipay` / `bank` |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "orderId": "TOP-20260530-0001",
    "amount": 500,
    "method": "wechat",
    "payUrl": "weixin://wxpay/bizpayurl?pr=abc123",
    "expiresAt": "2026-05-30T14:35:00+08:00"
  }
}
```

> `payUrl`：微信/支付宝返回支付链接；对公汇款 (`bank`) 返回银行账户信息。

### 3.3 交易记录

```http
GET /api/v1/client/wallet/transactions?page=1&pageSize=20&type=topup
```

| 查询参数 | 类型 | 说明 |
|----------|------|------|
| `type` | `string` | `topup`（充值）/ `freeze`（冻结托管）/ `release`（释放到开发者）/ `refund`（退款） |
| `page` | `number` | 页码 |
| `pageSize` | `number` | 每页条数 |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "TXN-001",
        "type": "topup",
        "amount": 500,
        "balanceBefore": 128.00,
        "balanceAfter": 628.00,
        "description": "微信充值 ¥500.00",
        "createdAt": "2026-05-30T14:00:00+08:00"
      }
    ],
    "total": 12,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3.4 交易详情

```http
GET /api/v1/client/wallet/transactions/:id
```

### 3.5 查询充值订单状态

```http
GET /api/v1/client/wallet/topup/:orderId
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "orderId": "TOP-20260530-0001",
    "amount": 500,
    "method": "wechat",
    "status": "paid",
    "paidAt": "2026-05-30T14:02:00+08:00",
    "expiresAt": "2026-05-30T14:35:00+08:00"
  }
}
```

| `status` 取值 | 说明 |
|---------------|------|
| `pending` | 等待支付 |
| `paid` | 已支付，余额已到账 |
| `expired` | 已过期，需重新发起充值 |
| `closed` | 已关闭（用户取消） |

> 前端发起充值后应轮询此接口（间隔 3 秒），直到 `status` 变为 `paid` 或 `expired`。

### 3.6 查询分期支付方案

> 信誉分 ≥ 650 的客户可使用分期支付。

```http
GET /api/v1/client/wallet/installment-plan?projectId=restaurant-pos
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "eligible": true,
    "creditScore": 712,
    "plans": [
      { "stages": 3, "amountPerStage": 5000.00, "fee": 0 },
      { "stages": 6, "amountPerStage": 2500.00, "fee": 150.00 }
    ]
  }
}
```

> `eligible=false` 时（信誉分 < 650）返回 `1007`。

### 3.7 发起分期托管

```http
POST /api/v1/client/wallet/installment
Content-Type: application/json

{
  "projectId": "restaurant-pos",
  "stages": 3
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `projectId` | `string` | ✓ | 关联项目 ID |
| `stages` | `number` | ✓ | 分期期数，`3` 或 `6` |

**响应** (201)：

```json
{
  "code": 0,
  "data": {
    "installmentId": "INST-20260530-001",
    "totalAmount": 15000,
    "stages": 3,
    "paidStages": 1,
    "nextPaymentDue": "2026-06-30T00:00:00+08:00"
  }
}
```

---

## 4. AI 对话

### 4.1 创建 AI 对话

```http
POST /api/v1/client/ai-chats
Content-Type: application/json

{
  "title": "电商小程序开发"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | | 对话标题，不传则从首条消息自动生成 |

**响应** (201)：

```json
{
  "code": 0,
  "data": {
    "chatId": "ecom-miniapp",
    "title": "电商小程序开发",
    "status": "draft",
    "createdAt": "2026-05-30T14:00:00+08:00"
  }
}
```

| `status` 取值 | 说明 |
|---------------|------|
| `draft` | 草稿（AI 正在理解需求） |
| `spec_generated` | 需求规格已生成 |
| `confirmed` | 客户已确认，已转人工客服 |
| `closed` | 对话已关闭 |

### 4.2 获取 AI 对话列表

```http
GET /api/v1/client/ai-chats?page=1&pageSize=20
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "chatId": "ecom-miniapp",
        "title": "电商小程序开发",
        "status": "spec_generated",
        "estimate": "¥8,000 – 12,000",
        "lastMessage": "我已根据你的描述梳理出核心模块…",
        "updatedAt": "2026-05-30T14:30:00+08:00"
      }
    ],
    "total": 4,
    "page": 1,
    "pageSize": 20
  }
}
```

### 4.3 获取 AI 对话详情（含需求规格）

```http
GET /api/v1/client/ai-chats/:id
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "chatId": "ecom-miniapp",
    "title": "电商小程序开发",
    "status": "spec_generated",
    "spec": {
      "projectName": "电商小程序",
      "budget": "¥ 8,000 – 12,000",
      "level": "B",
      "estimatedPrice": "¥ 10,800",
      "estimatedDuration": "21 天",
      "requirementsMd": "# 项目概述\n\n面向中小商家的微信小程序…",
      "phasesPrimary": [
        {
          "label": "一期 · 基础骨架",
          "range": "Day 1 – Day 7",
          "items": ["技术选型 & 项目脚手架", "登录注册 / 用户中心", "…"]
        }
      ],
      "phasesSecondary": [
        {
          "label": "里程碑款 · 30%",
          "range": "Day 7 验收通过",
          "items": ["脚手架交付", "基础页面 Demo"]
        }
      ]
    },
    "createdAt": "2026-05-30T14:00:00+08:00"
  }
}
```

### 4.4 发送消息（流式响应）

```http
POST /api/v1/client/ai-chats/:id/messages
Content-Type: application/json

{
  "content": "我需要一个支持微信支付的小程序"
}
```

**响应**：Server-Sent Events (SSE)，`Content-Type: text/event-stream`

```
data: {"type":"thinking","content":"正在分析你的需求…"}

data: {"type":"token","content":"好"}

data: {"type":"token","content":"的"}

data: {"type":"token","content":"，"}

data: {"type":"spec_update","spec":{...}}

data: {"type":"done","chatId":"ecom-miniapp","status":"spec_generated"}
```

| event `type` | 说明 |
|--------------|------|
| `thinking` | AI 正在思考，展示状态文本 |
| `token` | 流式文本片段 |
| `spec_update` | 需求规格增量更新（前端实时渲染卡片） |
| `done` | 流结束 |

### 4.5 获取历史消息

```http
GET /api/v1/client/ai-chats/:id/messages?page=1&pageSize=50
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "msg-001",
        "role": "user",
        "content": "我需要一个支持微信支付的小程序",
        "createdAt": "2026-05-30T14:01:00+08:00"
      },
      {
        "id": "msg-002",
        "role": "assistant",
        "content": "好的，为了更好地梳理需求，请告诉我…",
        "createdAt": "2026-05-30T14:01:05+08:00"
      }
    ],
    "total": 8,
    "page": 1,
    "pageSize": 50
  }
}
```

### 4.6 确认需求（转人工客服）

```http
POST /api/v1/client/ai-chats/:id/confirm
Content-Type: application/json
```

**响应** (200)：

```json
{
  "code": 0,
  "message": "需求已确认，客服将尽快与你联系",
  "data": {
    "chatId": "ecom-miniapp",
    "status": "confirmed"
  }
}
```

> 确认后对话状态变为 `confirmed`，系统自动创建待对接任务分配给客服。

---

## 5. 项目管理

### 5.1 获取我的项目列表

```http
GET /api/v1/client/projects?status=in-progress&page=1&pageSize=20
```

| 查询参数 | 说明 |
|----------|------|
| `status` | `pending-confirm` / `in-progress` / `review` / `settled` |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "projectId": "restaurant-pos",
        "name": "餐厅点餐系统",
        "status": "in-progress",
        "progress": 65,
        "stage": "开发中",
        "developer": "李工",
        "budget": 15000,
        "nextMilestone": "第三期 · 后台接口联调",
        "nextMilestoneEta": "2026-06-02",
        "groupId": "restaurant-pos"
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 20
  }
}
```

### 5.2 获取项目详情

```http
GET /api/v1/client/projects/:id
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "projectId": "restaurant-pos",
    "name": "餐厅点餐系统",
    "status": "in-progress",
    "progress": 65,
    "budget": 15000,
    "paid": 6000,
    "developer": "李工",
    "cs": "客服·小张",
    "milestones": [
      {
        "title": "需求确认",
        "desc": "梳理菜品/订单/支付核心模块",
        "date": "2026-05-20",
        "status": "done"
      },
      {
        "title": "开发与联调",
        "desc": "点餐主流程 / 厨房打印 / 报表",
        "date": "2026-06-05",
        "status": "current"
      },
      {
        "title": "尾款结算",
        "desc": "验收通过后释放剩余 60%",
        "status": "pending"
      }
    ],
    "groupId": "restaurant-pos",
    "createdAt": "2026-05-15T10:00:00+08:00"
  }
}
```

### 5.3 验收里程碑

```http
POST /api/v1/client/projects/:id/accept-milestone
Content-Type: application/json

{
  "milestoneTitle": "开发与联调",
  "feedback": "功能正常，通过验收"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `milestoneTitle` | `string` | ✓ | 里程碑标题 |
| `feedback` | `string` | | 验收反馈 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "里程碑验收通过，对应款项将释放给开发者"
}
```

### 5.4 发起争议

```http
POST /api/v1/client/projects/:id/dispute
Content-Type: application/json

{
  "reason": "交付物与需求描述不一致",
  "detail": "第三期要求支持微信支付 V3，但实际接入的是 V2 接口…"
}
```

**响应** (201)：

```json
{
  "code": 0,
  "message": "争议已提交，客服将在 24 小时内介入处理"
}
```

> 发起争议后项目状态变为 `frozen`，资金暂停流转。

---

## 6. 项目群消息

> 即时通讯的核心通过 WebSocket 实现，详见 [websocket/](../websocket/protocol.md)。以下 REST 接口用于获取历史数据和群信息。

### 6.1 获取项目群列表

```http
GET /api/v1/client/groups?page=1&pageSize=20
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "groupId": "restaurant-pos",
        "name": "餐厅点餐系统",
        "avatar": "https://cdn.lovedev.cn/groups/pos.png",
        "progress": 65,
        "stage": "开发中",
        "lastMessage": "今日进度截图已上传，请查看",
        "lastSender": "李工",
        "unread": 2,
        "updatedAt": "2026-05-30T13:45:00+08:00",
        "members": [
          { "name": "李工", "role": "dev" },
          { "name": "客服·小张", "role": "cs" },
          { "name": "你", "role": "client" }
        ]
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 20
  }
}
```

### 6.2 获取群详情

```http
GET /api/v1/client/groups/:id
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "groupId": "restaurant-pos",
    "name": "餐厅点餐系统",
    "avatar": "https://cdn.lovedev.cn/groups/pos.png",
    "progress": 65,
    "stage": "开发中",
    "members": [
      { "name": "李工", "role": "dev", "avatar": "…" },
      { "name": "客服·小张", "role": "cs", "avatar": "…" },
      { "name": "你", "role": "client", "avatar": "…" }
    ],
    "milestones": [
      { "title": "需求确认", "status": "done", "date": "2026-05-20" },
      { "title": "开发与联调", "status": "current", "date": "2026-06-05" },
      { "title": "尾款结算", "status": "pending" }
    ]
  }
}
```

### 6.3 获取历史消息

```http
GET /api/v1/client/groups/:id/messages?page=1&pageSize=30&before=msg-100
```

| 查询参数 | 说明 |
|----------|------|
| `before` | 游标：获取此消息 ID 之前的消息（用于上拉加载更多） |
| `after` | 游标：获取此消息 ID 之后的消息（用于断线重连补齐） |
| `page` | 页码 |
| `pageSize` | 每页条数 |

> `before` 和 `after` 互斥，不可同时使用。`after` 主要用于 WebSocket 断线重连时的消息补齐（见 [websocket 重连策略](../websocket/protocol.md#9-重连策略)）。

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "msg-099",
        "authorName": "李工",
        "authorRole": "dev",
        "authorAvatar": "…",
        "time": "13:45",
        "date": "2026-05-30",
        "content": {
          "kind": "progress-report",
          "report": {
            "reportId": "RPT-001",
            "date": "2026-05-30",
            "title": "5 月 30 日进度",
            "summary": "完成后台接口联调 80%",
            "steps": [
              { "title": "订单接口完成", "done": true },
              { "title": "支付回调调试中", "done": false }
            ],
            "screenshots": [
              { "src": "https://cdn.lovedev.cn/uploads/screenshot1.png", "caption": "接口测试截图" }
            ]
          }
        }
      },
      {
        "id": "msg-098",
        "authorName": "客服·小张",
        "authorRole": "cs",
        "authorAvatar": "…",
        "time": "10:28",
        "content": {
          "kind": "text",
          "text": "第二期款项已审核通过，可领取"
        }
      }
    ],
    "total": 256,
    "page": 1,
    "pageSize": 30
  }
}
```

**消息内容类型（`content.kind`）**：

| `kind` | 结构 | 说明 |
|--------|------|------|
| `text` | `{ text: string }` | 普通文本消息 |
| `image` | `{ src: string, caption?: string }` | 图片消息 |
| `system` | `{ text: string }` | 系统消息（入群、状态变更等） |
| `progress-report` | `{ report: ProgressReport }` | 开发者上传的每日进度报告 |
| `progress-review` | `{ reportDate: string, feedback?: string }` | 客户/客服对进度的审查反馈 |
| `acceptance-pass` | `{ phase: string, feedback?: string }` | 阶段验收通过 |
| `deliverable` | `{ files: File[], note?: string }` | 交付物（文件列表） |
| `spec-card` | `{ spec: SpecPayload, variant: "ai"|"cs" }` | 需求规格卡片 |

### 6.4 标记群消息已读

```http
POST /api/v1/client/groups/:id/read
Content-Type: application/json

{
  "lastReadMessageId": "msg-099"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `lastReadMessageId` | `string` | ✓ | 标记该消息及之前所有消息为已读 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "success"
}
```

---

## 7. 通知

> 通知通过 WebSocket 实时推送（详见 [websocket 通知推送](../websocket/protocol.md#8-通知推送)），以下 REST 接口用于获取历史通知和标记已读。

### 7.1 获取通知列表

```http
GET /api/v1/client/notifications?page=1&pageSize=20&unreadOnly=true
```

| 查询参数 | 说明 |
|----------|------|
| `unreadOnly` | `true` 仅返回未读通知 |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "notif-001",
        "kind": "milestone_completed",
        "title": "里程碑验收通过",
        "body": "「餐厅点餐系统」需求确认阶段已验收通过",
        "projectId": "restaurant-pos",
        "groupId": "restaurant-pos",
        "createdAt": "2026-05-30T14:00:00+08:00",
        "read": false
      },
      {
        "id": "notif-002",
        "kind": "project_assigned",
        "title": "项目已被接单",
        "body": "李工 已接下「企业官网重构」",
        "projectId": "corp-site",
        "groupId": "corp-site",
        "createdAt": "2026-05-29T10:00:00+08:00",
        "read": true
      }
    ],
    "total": 8,
    "unreadCount": 3,
    "page": 1,
    "pageSize": 20
  }
}
```

### 7.2 标记通知已读

```http
POST /api/v1/client/notifications/read
Content-Type: application/json

{
  "notificationIds": ["notif-001", "notif-002"]
}
```

> 传空数组或 `"all"` 标记全部已读。

### 7.3 获取未读通知数

```http
GET /api/v1/client/notifications/unread-count
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "count": 3
  }
}
```

---

## 8. 评价开发者

> 项目状态为 `settled` 后，客户可对开发者进行评价。

### 8.1 提交评价

```http
POST /api/v1/client/projects/:id/review
Content-Type: application/json

{
  "rating": 5,
  "tags": ["沟通及时", "代码质量高"],
  "comment": "李工非常专业，提前完成了所有里程碑，代码质量超出预期。"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rating` | `number` | ✓ | 评分 1-5 |
| `tags` | `string[]` | | 评价标签，最多 5 个 |
| `comment` | `string` | | 文字评价，最多 500 字 |

**响应** (201)：

```json
{
  "code": 0,
  "message": "评价已提交"
}
```

> 每个项目只能评价一次，重复提交返回 `409`。

### 8.2 查看已提交的评价

```http
GET /api/v1/client/projects/:id/review
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "rating": 5,
    "tags": ["沟通及时", "代码质量高"],
    "comment": "李工非常专业…",
    "createdAt": "2026-05-30T16:00:00+08:00"
  }
}
```
