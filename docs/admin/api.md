# 后台管理端 API

> 遵循 [通用约定](../shared/common.md)。所有接口需携带 `Authorization: Bearer <access_token>`，且 JWT `role` 字段必须为 `admin` 或 `cs`。鉴权接口见 [auth/](../auth/api.md)。

每个接口标注了所需权限：`admin`（管理员）、`cs`（客服）、`admin | cs`（两者均可）。

---

## 目录

- [1. 用户管理](#1-用户管理)
- [2. 项目管理](#2-项目管理)
- [3. 待对接客户（客服专属）](#3-待对接客户客服专属)
- [4. 财务管理](#4-财务管理)
- [5. 项目群消息](#5-项目群消息)
- [6. 争议管理](#6-争议管理)
- [7. 平台公告](#7-平台公告)
- [8. 通知推送](#8-通知推送)

---

## 1. 用户管理

权限：`admin`

### 1.1 获取用户列表

```http
GET /api/v1/admin/users?type=dev&status=active&query=陈&page=1&pageSize=20
```

| 查询参数 | 说明 |
|----------|------|
| `type` | `client`（客户）/ `dev`（开发者）/ `cs`（客服） |
| `status` | `active` / `suspended` |
| `query` | 搜索关键词（匹配名称、邮箱） |

**客户列表响应**：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "userId": "cli-001",
        "name": "上海·萌爪科技",
        "email": "ops@mengzhao.cn",
        "avatar": "…",
        "status": "active",
        "creditScore": 712,
        "projectsCount": 2,
        "totalSpent": 56400,
        "registeredAt": "2025-01-22T10:00:00+08:00"
      }
    ],
    "total": 15,
    "page": 1,
    "pageSize": 20
  }
}
```

**开发者列表响应**（额外字段）：

```json
{
  "list": [
    {
      "userId": "dev-001",
      "name": "陈工",
      "email": "chen.dev@lovedev.io",
      "status": "active",
      "level": "A",
      "finishedOrders": 18,
      "rating": 4.9,
      "skills": ["React Native", "Node.js"],
      "registeredAt": "2025-01-12T08:00:00+08:00"
    }
  ]
}
```

**客服列表响应**（额外字段）：

```json
{
  "list": [
    {
      "userId": "cs-001",
      "name": "客服·小张",
      "email": "zhang.cs@lovedev.io",
      "status": "active",
      "responsibleCount": 5,
      "pendingAssignments": 3,
      "registeredAt": "2025-03-01T09:00:00+08:00"
    }
  ]
}
```

### 1.2 获取用户详情

```http
GET /api/v1/admin/users/:id
```

### 1.3 创建用户

```http
POST /api/v1/admin/users
Content-Type: application/json

{
  "type": "cs",
  "name": "客服·小王",
  "email": "wang.cs@lovedev.io",
  "password": "TempPass123!"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `string` | ✓ | `client` / `dev` / `cs` |
| `name` | `string` | ✓ | |
| `email` | `string` | ✓ | |
| `password` | `string` | ✓ | |
| `level` | `string` | | 仅 `type=dev`：`C`（默认） |
| `skills` | `string[]` | | 仅 `type=dev` |

> 管理员账户通过数据库脚本或独立初始化流程创建，不在此接口中。

**响应** (201)：

```json
{
  "code": 0,
  "message": "创建成功",
  "data": {
    "userId": "cs-012"
  }
}
```

### 1.4 编辑用户

```http
PUT /api/v1/admin/users/:id
Content-Type: application/json

{
  "name": "陈工（更新）",
  "status": "active",
  "level": "A",
  "skills": ["React Native", "TypeScript", "Node.js", "GraphQL"]
}
```

### 1.5 启停用户

```http
PUT /api/v1/admin/users/:id/status
Content-Type: application/json

{
  "status": "suspended"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `status` | `string` | ✓ | `active` / `suspended` |

### 1.6 删除用户

```http
DELETE /api/v1/admin/users/:id
```

> 软删除：标记为已删除但保留数据关联。

### 1.7 调整开发者等级

```http
PUT /api/v1/admin/users/:id/level
Content-Type: application/json

{
  "level": "B",
  "reason": "经审核，该开发者满足 B 级升级条件"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `level` | `string` | ✓ | `A` / `B` / `C` |
| `reason` | `string` | ✓ | 调整原因，10-200 字，记录审计日志 |

> 权限：`admin`。手动调整会绕过自动升级规则并记录操作审计。降级时需填写具体违规事由。

---

## 2. 项目管理

权限：`admin | cs`（客服仅能看到自己负责的项目）

### 2.1 获取项目列表

```http
GET /api/v1/admin/projects?status=in-progress&level=B&query=宠物&page=1&pageSize=20
```

| 查询参数 | 说明 |
|----------|------|
| `status` | `pending-confirm` / `open` / `in-progress` / `review` / `settled` / `frozen` |
| `level` | `A` / `B` / `C` |
| `query` | 搜索项目名称或客户 |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "projectId": "restaurant-pos",
        "name": "餐厅点餐系统",
        "client": "上海·萌爪科技",
        "cs": "客服·小张",
        "dev": "李工",
        "level": "B",
        "status": "in-progress",
        "progress": 65,
        "budget": 15000,
        "paid": 6000,
        "unsettled": 9000,
        "createdAt": "2026-05-15T10:00:00+08:00"
      }
    ],
    "total": 28,
    "page": 1,
    "pageSize": 20
  }
}
```

### 2.2 获取项目详情

```http
GET /api/v1/admin/projects/:id
```

> 响应结构包含项目基本信息 + 里程碑 + 关联的群组 ID（如果有）。管理员可看到全量字段；客服只能看到自己负责的项目。

### 2.3 更新项目状态

```http
PUT /api/v1/admin/projects/:id/status
Content-Type: application/json

{
  "status": "frozen"
}
```

| `status` 可操作值 | 前置状态 | 说明 |
|-------------------|----------|------|
| `open` | `pending-confirm` | 发布到接单大厅 |
| `frozen` | 任意非终态 | 冻结项目，暂停资金流转 |
| `unfrozen` | `frozen` | 解冻，回到之前的正常状态 |

### 2.4 分配客服

```http
POST /api/v1/admin/projects/:id/assign-cs
Content-Type: application/json

{
  "csId": "cs-002"
}
```

权限：`admin`

### 2.5 分配开发者

```http
POST /api/v1/admin/projects/:id/assign-dev
Content-Type: application/json

{
  "devId": "dev-003"
}
```

权限：`admin | cs`

> 通常由抢单自动分配，此接口用于手动指定（如原开发者中途退出）。

---

## 3. 待对接客户（客服专属）

权限：`cs`

> 客户在 AI 对话中确认需求后，系统自动创建待对接任务。客服在此与客户沟通确认最终需求细节，确认后发布到接单大厅。

### 3.1 获取待对接列表

```http
GET /api/v1/admin/pending?page=1&pageSize=20
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "pendingId": "pend-001",
        "client": "上海·萌爪科技",
        "contactName": "李先生",
        "phone": "+86 139****1234",
        "contactEmail": "li@mengzhao.cn",
        "intent": "电商小程序开发",
        "channel": "AI 对话",
        "assignedAt": "2026-05-30T13:00:00+08:00",
        "csName": "客服·小张"
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3.2 获取待对接详情（含 AI 需求规格）

```http
GET /api/v1/admin/pending/:id
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "pendingId": "pend-001",
    "client": "上海·萌爪科技",
    "contactName": "李先生",
    "phone": "+86 139****1234",
    "contactEmail": "li@mengzhao.cn",
    "intent": "电商小程序开发",
    "aiSpec": {
      "projectName": "电商小程序",
      "budget": "¥ 8,000 – 12,000",
      "level": "B",
      "estimatedPrice": "¥ 10,800",
      "estimatedDuration": "21 天",
      "requirementsMd": "# 项目概述\n\n…",
      "phasesPrimary": [
        { "label": "一期 · 基础骨架", "range": "Day 1-7", "items": ["…"] }
      ],
      "phasesSecondary": [
        { "label": "里程碑款 · 30%", "range": "Day 7", "items": ["…"] }
      ]
    }
  }
}
```

### 3.3 获取对话记录

```http
GET /api/v1/admin/pending/:id/messages?page=1&pageSize=30
```

> 返回客服与客户在确认阶段的对话。消息格式与项目群消息一致，`authorRole` 为 `cs` 或 `client`。

### 3.4 发布到接单列表

```http
POST /api/v1/admin/pending/:id/publish
Content-Type: application/json

{
  "projectName": "电商小程序",
  "level": "B",
  "budget": 10800,
  "estimatedDuration": "21 天",
  "requirementsMd": "# 项目概述\n\n…（客服修订后的版本）",
  "phasesPrimary": [...],
  "phasesSecondary": [...]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `projectName` | `string` | ✓ | 项目名称 |
| `level` | `string` | ✓ | 难度等级 `A` / `B` / `C` |
| `budget` | `number` | ✓ | 项目预算（元） |
| `estimatedDuration` | `string` | ✓ | 预估工期 |
| `requirementsMd` | `string` | ✓ | Markdown 格式的完整需求描述 |
| `phasesPrimary` | `object[]` | ✓ | 开发阶段计划 |
| `phasesSecondary` | `object[]` | ✓ | 里程碑付款计划 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "项目已发布到接单大厅",
  "data": {
    "projectId": "ecom-miniapp",
    "status": "open"
  }
}
```

---

## 4. 财务管理

权限：`admin`

### 4.1 财务概览

```http
GET /api/v1/admin/finance/overview
```

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "totalIncome": 248600.00,
    "settled": 182400.00,
    "unsettled": 66200.00,
    "activeProjects": 12,
    "pendingConfirm": 4,
    "underReview": 3
  }
}
```

### 4.2 月度收入统计

```http
GET /api/v1/admin/finance/income?months=6
```

| 查询参数 | 说明 |
|----------|------|
| `months` | 最近 N 个月，默认 `12` |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "buckets": [
      { "month": "2026-01", "total": 42000.00, "settled": 38000.00, "unsettled": 4000.00 },
      { "month": "2026-02", "total": 38600.00, "settled": 35200.00, "unsettled": 3400.00 },
      { "month": "2026-03", "total": 45100.00, "settled": 40100.00, "unsettled": 5000.00 },
      { "month": "2026-04", "total": 39800.00, "settled": 36000.00, "unsettled": 3800.00 },
      { "month": "2026-05", "total": 43100.00, "settled": 33100.00, "unsettled": 10000.00 }
    ],
    "monthOnMonth": 3300.00,
    "momPercentage": 8.3
  }
}
```

### 4.3 已结算项目列表

```http
GET /api/v1/admin/finance/projects?page=1&pageSize=20
```

> 返回 `status=settled` 的项目，含结算金额、结算日期、开发者、客户信息。

### 4.4 平台交易流水

```http
GET /api/v1/admin/finance/transactions?type=topup&page=1&pageSize=20
```

| 查询参数 | 说明 |
|----------|------|
| `type` | `topup` / `freeze` / `release` / `withdraw` / `refund` |
| `userId` | 按用户过滤 |

---

## 5. 项目群消息

权限：`admin | cs`（客服仅自己负责的项目群）

### 5.1 获取项目群列表

```http
GET /api/v1/admin/groups?page=1&pageSize=20
```

> 管理员看到全平台项目群；客服仅看到自己负责的项目群。响应结构参考 [客户端 API](../client/api.md#61-获取项目群列表)。

### 5.2 获取历史消息

```http
GET /api/v1/admin/groups/:id/messages?page=1&pageSize=30
```

> 响应结构参考 [客户端 API](../client/api.md#63-获取历史消息)。管理端附加权限校验：客服只能访问自己负责的项目群。

---

## 6. 争议管理

权限：`admin`

> 客户发起争议后（`POST /api/v1/client/projects/:id/dispute`），管理员在此处理。

### 6.1 获取争议列表

```http
GET /api/v1/admin/disputes?status=open&page=1&pageSize=20
```

| 查询参数 | 说明 |
|----------|------|
| `status` | `open`（待处理）/ `resolved`（已解决） |

**响应** (200)：

```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "disputeId": "disp-001",
        "projectId": "restaurant-pos",
        "projectName": "餐厅点餐系统",
        "client": "上海·萌爪科技",
        "developer": "李工",
        "reason": "交付物与需求描述不一致",
        "detail": "第三期要求支持微信支付 V3，但实际接入的是 V2 接口…",
        "status": "open",
        "filedAt": "2026-05-30T15:00:00+08:00"
      }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 20
  }
}
```

### 6.2 获取争议详情

```http
GET /api/v1/admin/disputes/:id
```

> 响应含完整争议描述、关联项目状态、项目群最近 50 条消息、双方评价历史。

### 6.3 处理争议

```http
POST /api/v1/admin/disputes/:id/resolve
Content-Type: application/json

{
  "resolution": "refund",
  "refundAmount": 15000,
  "note": "经核实，开发者确实未按需求实现微信支付 V3，全额退款给客户。"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `resolution` | `string` | ✓ | `refund`（退款）/ `continue`（继续履约）/ `adjust`（调整要求） |
| `refundAmount` | `number` | `resolution=refund` 时必填 | 退款金额，不超过已付总额 |
| `note` | `string` | ✓ | 处理说明，记录审计日志 |

**响应** (200)：

```json
{
  "code": 0,
  "message": "争议已处理",
  "data": {
    "disputeId": "disp-001",
    "status": "resolved",
    "resolution": "refund",
    "projectStatus": "settled"
  }
}
```

> 退款后项目状态变为 `settled`，资金从托管账户原路退回客户钱包。

---

## 7. 平台公告

权限：`admin`

> 公告展示在开发者端接单大厅的活动/公告区域（见 [开发者端 API](../developer/api.md#45-获取活动--公告)）。

### 7.1 获取公告列表

```http
GET /api/v1/admin/announcements?page=1&pageSize=20
```

### 7.2 创建公告

```http
POST /api/v1/admin/announcements
Content-Type: application/json

{
  "eyebrow": "平台更新",
  "title": "结算周期升级为 T+1",
  "description": "项目阶段确认通过后，结算款将在下一个工作日打入平台余额。",
  "cta": "查看详情",
  "tone": "emerald",
  "publishNow": true
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `eyebrow` | `string` | ✓ | 公告标签 |
| `title` | `string` | ✓ | 标题 |
| `description` | `string` | ✓ | 正文 |
| `cta` | `string` | | 操作按钮文案 |
| `tone` | `string` | | 色调：`violet` / `amber` / `emerald` / `sky` |
| `publishNow` | `boolean` | | 是否立即发布（默认 `false`） |

### 7.3 编辑公告

```http
PUT /api/v1/admin/announcements/:id
```

### 7.4 删除公告

```http
DELETE /api/v1/admin/announcements/:id
```

---

## 8. 通知推送

权限：`admin`

> 管理员可向指定角色或单个用户推送平台通知。

### 8.1 推送通知

```http
POST /api/v1/admin/notifications/send
Content-Type: application/json

{
  "target": { "role": "developer" },
  "kind": "system",
  "title": "系统维护通知",
  "body": "平台将于 6 月 1 日凌晨 2:00-4:00 进行系统升级，届时暂停服务。"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | `object` | ✓ | `{ role: "client"|"developer"|"cs" }` 或 `{ userId: "dev-001" }` |
| `kind` | `string` | ✓ | `system`（系统通知）/ `promotion`（营销） |
| `title` | `string` | ✓ | 通知标题 |
| `body` | `string` | ✓ | 通知正文 |

**响应** (201)：

```json
{
  "code": 0,
  "message": "通知已推送",
  "data": {
    "recipientCount": 48
  }
}
```

> 推送通过 WebSocket 实时下发（见 [通知推送协议](../websocket/protocol.md#8-通知推送)），同时写入各用户的通知列表。
