# 程序员端 API

> 遵循 [通用约定](../shared/common.md)。所有接口需携带 `Authorization: Bearer <access_token>`。鉴权接口见 [auth/](../auth/api.md)。

---

## 目录

- [1. 用户信息](#1-用户信息)
- [2. 实名认证](#2-实名认证)
- [3. 钱包](#3-钱包)
- [4. 接单大厅](#4-接单大厅)
- [5. 项目管理](#5-项目管理)
- [6. 项目群消息](#6-项目群消息)
- [7. 通知](#7-通知)
- [8. 评价客户](#8-评价客户)

---

## 1. 用户信息

### 1.1 获取个人信息

```http
GET /api/v1/developer/profile
```

权限：`developer`

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "userId": "dev-xyz789",
    "name": "陈工",
    "email": "dev@example.com",
    "avatar": "https://cdn.lovedev.cn/avatars/xyz789.png",
    "level": "B",
    "skills": ["React Native", "TypeScript", "Node.js"],
    "rating": 4.7,
    "finishedOrders": 14,
    "registeredAt": "2025-01-12T08:00:00+08:00"
  }
}
```

### 1.2 更新个人信息

```http
PUT /api/v1/developer/profile
Content-Type: application/json

{
  "name": "陈工",
  "avatar": "https://cdn.lovedev.cn/avatars/new.png",
  "skills": ["React Native", "TypeScript", "Node.js", "RAG"]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | `string` | | 昵称 |
| `avatar` | `string` | | 头像 URL |
| `skills` | `string[]` | | 技能标签，最多 10 个 |

### 1.3 查询等级与升级进度

```http
GET /api/v1/developer/level
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "currentLevel": "B",
    "nextLevel": "A",
    "finishedOrders": 8,
    "requiredOrders": 14,
    "rating": 4.7,
    "requiredRating": 4.8,
    "progress": 57
  }
}
```

> 等级规则：C 级（注册默认）→ B 级（完单 ≥ 7 单 + 评价 ≥ 4.5）→ A 级（完单 ≥ 14 单 + 评价 ≥ 4.8）。A 级可接所有等级的单，B 级可接 ≤ B 级的单，C 级只能接 C 级单。

### 1.4 统计数据

```http
GET /api/v1/developer/statistics
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "activeProjects": 3,
    "completedOrders": 14,
    "totalIncome": 56300.00,
    "monthIncome": 8800.00,
    "availableBalance": 1280.00,
    "pendingBalance": 12400.00
  }
}
```

---

## 2. 实名认证

> 开发者需完成实名认证后才能提现。接口与客户端实名认证共享同一套后端校验逻辑。

### 2.1 提交实名认证

```http
POST /api/v1/developer/real-name
Content-Type: application/json

{
  "realName": "陈工",
  "idNumber": "320501199005051234"
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
GET /api/v1/developer/real-name
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "verified": true,
    "realName": "陈*",
    "idNumber": "320501********1234",
    "verifiedAt": "2025-02-10T10:00:00+08:00"
  }
}
```

> 未实名时 `verified=false`，提现接口返回 `1013`。

---

## 3. 钱包

### 3.1 查询钱包

```http
GET /api/v1/developer/wallet
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "available": 1280.00,
    "pending": 12400.00,
    "withdrawn": 45020.00,
    "totalIncome": 56300.00
  }
}
```

| 字段 | 说明 |
|------|------|
| `available` | 可提现余额（已完成结算、可随时提取） |
| `pending` | 待结算余额（项目阶段验收中，暂不可提） |
| `withdrawn` | 累计已提现金额 |
| `totalIncome` | 累计总收入 |

### 3.2 申请提现

```http
POST /api/v1/developer/wallet/withdraw
Content-Type: application/json

{
  "amount": 500,
  "method": "wechat",
  "account": "wxid_abc123"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `amount` | `number` | ✓ | 提现金额（元），最低 `50`，不超过可用余额 |
| `method` | `string` | ✓ | 提现方式：`wechat` / `alipay` / `bank` |
| `account` | `string` | ✓ | 收款账户标识 |

> 微信/支付宝提现为实时到账；银行卡提现为 1-3 个工作日。

**响应** (200)：

```json
{
  "code": 0,
  "message": "提现申请已提交",
  "data": {
    "orderId": "WTD-20260530-0001",
    "amount": 500,
    "status": "processing",
    "estimatedArrival": "2026-05-30T15:00:00+08:00"
  }
}
```

### 3.3 交易记录

```http
GET /api/v1/developer/wallet/transactions?page=1&pageSize=20&type=withdraw
```

| 查询参数 | 说明 |
|----------|------|
| `type` | `income`（收入）/ `withdraw`（提现）/ `refund`（退款） |

### 3.4 提现账户管理

> 开发者需先绑定提现账户才能发起提现。

#### 获取已绑定的提现账户

```http
GET /api/v1/developer/wallet/accounts
```

**响应** (200)：

```json
{
  "code": 0,
  "data": [
    {
      "id": "acc-001",
      "method": "wechat",
      "account": "wxid_abc123",
      "label": "微信零钱",
      "isDefault": true
    },
    {
      "id": "acc-002",
      "method": "alipay",
      "account": "138****8888",
      "label": "支付宝",
      "isDefault": false
    }
  ]
}
```

#### 绑定提现账户

```http
POST /api/v1/developer/wallet/accounts
Content-Type: application/json

{
  "method": "bank",
  "account": "6222021234567890123",
  "label": "招商银行储蓄卡",
  "bankName": "招商银行",
  "accountHolder": "陈工"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `method` | `string` | ✓ | `wechat` / `alipay` / `bank` |
| `account` | `string` | ✓ | 收款账户标识 |
| `label` | `string` | | 账户备注名 |
| `bankName` | `string` | `method=bank` 时必填 | 开户行名称 |
| `accountHolder` | `string` | `method=bank` 时必填 | 开户人姓名（需与实名认证一致） |

#### 删除提现账户

```http
DELETE /api/v1/developer/wallet/accounts/:accountId
```

---

## 4. 接单大厅

### 4.1 获取接单列表

```http
GET /api/v1/developer/orders?page=1&pageSize=20&category=mobile&level=B
```

| 查询参数 | 说明 |
|----------|------|
| `category` | 分类：`web` / `mobile` / `miniapp` / `ai` / `design` / `backend` / `embedded` |
| `level` | 难度等级：`A` / `B` / `C` |
| `sort` | 排序：`latest`（最新）/ `budget_desc`（预算从高到低） |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "orderId": "ORD-2403",
        "title": "宠物社区 App · iOS + Android 跨端开发",
        "summary": "包含动态时间线、宠物档案、同城匹配与商城模块…",
        "category": "移动应用",
        "level": "A",
        "budget": 28000,
        "duration": "4 周",
        "client": "上海 · 萌爪科技",
        "tags": ["React Native", "云开发", "已付定金"],
        "postedAt": "2026-05-30T12:00:00+08:00"
      }
    ],
    "total": 48,
    "page": 1,
    "pageSize": 20
  }
}
```

> 接单列表只返回**已上架** (`status=open`) 且 **开发者等级 ≥ 需求等级** 的单子。

### 4.2 获取订单详情

```http
GET /api/v1/developer/orders/:id
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "orderId": "ORD-2403",
    "title": "宠物社区 App",
    "summary": "…",
    "category": "移动应用",
    "level": "A",
    "budget": 28000,
    "duration": "4 周",
    "client": "上海 · 萌爪科技",
    "tags": ["React Native"],
    "postedAt": "2026-05-30T12:00:00+08:00",
    "detail": {
      "requirementsMd": "# 项目概述\n\n…",
      "milestones": [
        { "title": "应用骨架搭建", "desc": "基础导航、网络层", "status": "pending", "date": "Day 1-7" },
        { "title": "核心功能", "desc": "动态、宠物档案", "status": "pending", "date": "Day 8-21" },
        { "title": "测试与上线", "status": "pending", "date": "Day 22-28" }
      ],
      "phasesPrimary": [
        { "label": "一期", "range": "Day 1-7", "items": ["…"] }
      ],
      "phasesSecondary": [
        { "label": "里程碑款 · 30%", "range": "Day 7", "items": ["…"] }
      ]
    }
  }
}
```

### 4.3 抢单

```http
POST /api/v1/developer/orders/:id/accept
```

> **并发安全**：此接口需保证原子性——只有第一个到达的有效请求成功，后续请求返回 `409`。

**成功响应** (200)：

```json
{
  "code": 0,
  "message": "抢单成功，请等待客服确认",
  "data": {
    "orderId": "ORD-2403",
    "status": "assigned"
  }
}
```

**失败响应** (409)：

```json
{
  "code": 1005,
  "message": "该单已被其他开发者抢走"
}
```

**等级不足** (422)：

```json
{
  "code": 1002,
  "message": "你的等级为 C 级，无法接取 A 级需求，请先升级"
}
```

### 4.4 获取分类列表

```http
GET /api/v1/developer/orders/categories
```

**响应** (200)：

```json
{
  "code": 0,
  "data": [
    { "id": "web", "title": "Web 网站", "count": 48 },
    { "id": "mobile", "title": "移动应用", "count": 27 },
    { "id": "miniapp", "title": "小程序", "count": 33 },
    { "id": "ai", "title": "AI 应用", "count": 19 },
    { "id": "design", "title": "设计", "count": 12 },
    { "id": "backend", "title": "后端服务", "count": 22 },
    { "id": "embedded", "title": "嵌入式", "count": 7 }
  ]
}
```

### 4.5 获取活动 / 公告

```http
GET /api/v1/developer/orders/activities
```

**响应** (200)：

```json
{
  "code": 0,
  "data": [
    {
      "id": "season-1",
      "eyebrow": "本周精选",
      "title": "高质量需求批量上架",
      "description": "本周新入驻 18 个客户、累计需求总额 ¥ 86,400…",
      "cta": "立即查看",
      "tone": "violet"
    }
  ]
}
```

---

## 5. 项目管理

### 5.1 获取我的项目列表

```http
GET /api/v1/developer/projects?status=in-progress&page=1&pageSize=20
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "projectId": "ORD-2403",
        "name": "宠物社区 App",
        "client": "上海 · 萌爪科技",
        "status": "in-progress",
        "progress": 22,
        "stage": "开发中",
        "nextMilestone": "一期 · 应用骨架",
        "nextMilestoneEta": "2026-06-02",
        "groupId": "ORD-2403-group"
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
GET /api/v1/developer/projects/:id
```

> 与客户端 `GET /api/v1/client/projects/:id` 共享同一个项目实体。响应结构参考 [客户端 API](../client/api.md#52-获取项目详情)，开发者端额外返回：
> - `todayProgressUploaded`：今天是否已上传进度（`boolean`）
> - `paymentMilestones`：里程碑对应的付款金额和状态

### 5.3 上传每日进度

```http
POST /api/v1/developer/projects/:id/progress
Content-Type: application/json

{
  "title": "5 月 30 日进度",
  "summary": "完成后台接口联调 80%，支付回调调试中",
  "steps": [
    { "title": "订单接口完成", "done": true },
    { "title": "支付回调调试中", "done": false }
  ],
  "screenshots": [
    { "src": "https://cdn.lovedev.cn/uploads/s1.png", "caption": "接口测试截图" }
  ]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | ✓ | 进度标题 |
| `summary` | `string` | ✓ | 进度摘要 |
| `steps` | `object[]` | | 步骤列表，每项含 `title` 和 `done` |
| `screenshots` | `object[]` | ✓ | 截图列表，每项含 `src`（URL）和可选 `caption`；截图先通过 `POST /api/v1/upload` 上传 |

> **每天限一次**：同一项目同一天上传第二次时返回 `1004`。

**响应** (201)：

```json
{
  "code": 0,
  "message": "进度已上传",
  "data": {
    "reportId": "RPT-20260530-001"
  }
}
```

### 5.4 获取进度记录

```http
GET /api/v1/developer/projects/:id/progress?page=1&pageSize=20
```

### 5.5 上传交付物

```http
POST /api/v1/developer/projects/:id/deliverable
Content-Type: application/json

{
  "files": [
    {
      "url": "https://cdn.lovedev.cn/uploads/source.zip",
      "name": "source-code-v1.0.zip",
      "size": 2048000,
      "kind": "zip"
    }
  ],
  "note": "第一版本交付，包含全部源码和部署文档"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `files` | `object[]` | ✓ | 文件列表，每项含 `url`、`name`、`size`、`kind`（`image`/`doc`/`zip`/`other`） |
| `note` | `string` | | 交付说明 |

### 5.6 请求阶段验收

```http
POST /api/v1/developer/projects/:id/request-review
Content-Type: application/json

{
  "milestoneTitle": "一期 · 应用骨架"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `milestoneTitle` | `string` | ✓ | 请求验收的里程碑标题 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "验收请求已发送，等待客户确认"
}
```

### 5.7 退出项目

```http
POST /api/v1/developer/projects/:id/quit
Content-Type: application/json

{
  "reason": "个人时间安排冲突，无法继续交付"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `reason` | `string` | ✓ | 退出原因，10-500 字 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "已申请退出，等待管理员审核"
}
```

> 退出后项目状态变为 `open`，重新上架接单大厅。已完成的阶段款项不会退还。频繁退出可能影响开发者等级评价。

---

## 6. 项目群消息

> 即时通讯核心通过 WebSocket，详见 [websocket/](../websocket/protocol.md)。

### 6.1 获取项目群列表

```http
GET /api/v1/developer/groups?page=1&pageSize=20
```

> 响应结构与客户端一致，参考 [客户端 API](../client/api.md#61-获取项目群列表)。

### 6.2 获取历史消息

```http
GET /api/v1/developer/groups/:id/messages?page=1&pageSize=30&after=msg-050
```

| 查询参数 | 说明 |
|----------|------|
| `before` | 获取此消息 ID 之前的消息（上拉加载更多） |
| `after` | 获取此消息 ID 之后的消息（断线重连补齐） |
| `page` | 页码 |
| `pageSize` | 每页条数 |

> `before` 和 `after` 互斥。响应结构与客户端一致，参考 [客户端 API](../client/api.md#63-获取历史消息)。

---

## 7. 通知

> 通知通过 WebSocket 实时推送。REST 接口用于获取历史通知和标记已读。

### 7.1 获取通知列表

```http
GET /api/v1/developer/notifications?page=1&pageSize=20&unreadOnly=true
```

> 响应结构与客户端一致（见 [客户端通知接口](../client/api.md#71-获取通知列表)），开发者端额外接收以下 `kind`：`milestone_due`、`payment_received`、`payment_released`、`dispute_filed`、`progress_reminder`、`level_upgraded`。

### 7.2 标记通知已读

```http
POST /api/v1/developer/notifications/read
Content-Type: application/json

{
  "notificationIds": ["notif-001"]
}
```

### 7.3 获取未读通知数

```http
GET /api/v1/developer/notifications/unread-count
```

---

## 8. 评价客户

> 项目状态为 `settled` 后，开发者可对客户进行评价。评价影响客户的信誉分 (`creditScore`)。

### 8.1 提交评价

```http
POST /api/v1/developer/projects/:id/review-client
Content-Type: application/json

{
  "rating": 5,
  "tags": ["需求明确", "反馈及时"],
  "comment": "萌爪科技的需求文档非常清晰，沟通效率高。"
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
GET /api/v1/developer/projects/:id/review-client
```
