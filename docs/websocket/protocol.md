# WebSocket 即时通讯协议

> 本文档定义「爱开发」项目群聊的 WebSocket 通信协议。群信息、历史消息等 REST 查询接口见各端文档。

---

## 1. 连接

### 1.1 连接地址

```
wss://ws.lovedev.cn/ws
```

开发环境：

```
ws://localhost:8080/ws
```

### 1.2 鉴权

连接建立后，客户端必须在 **5 秒内** 发送认证帧，否则服务端主动断开。

**发送**：

```json
{
  "type": "auth",
  "payload": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `token` | `string` | Access Token（与 REST 接口共用同一个 JWT） |

**成功响应**：

```json
{
  "type": "auth_ok",
  "payload": {
    "userId": "cli-abc123",
    "name": "Creteper",
    "role": "client"
  }
}
```

**失败响应**：

```json
{
  "type": "error",
  "payload": {
    "code": 401,
    "message": "认证失败，Token 无效或已过期"
  }
}
```

> 认证失败后服务端会断开连接。客户端应使用 `/api/v1/auth/{role}/refresh-token` 刷新 Token 后重连。

---

## 2. 心跳

客户端每 **30 秒** 发送 ping，服务端回复 pong。超过 **90 秒** 无心跳则服务端主动断开。

```
Client → Server:  { "type": "ping" }
Server → Client:  { "type": "pong" }
```

---

## 3. 消息格式

### 3.1 发送消息

```json
{
  "type": "message",
  "payload": {
    "groupId": "restaurant-pos",
    "content": {
      "kind": "text",
      "text": "今日进度截图已上传，请查看"
    },
    "clientMsgId": "local-uuid-12345"
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `groupId` | `string` | ✓ | 目标项目群 ID |
| `content` | `object` | ✓ | 消息内容，见下方消息类型 |
| `clientMsgId` | `string` | ✓ | 客户端生成的唯一 ID，用于去重和发送状态追踪 |
| `replyTo` | `string` | | 回复的消息 ID（可选） |

### 3.2 消息投递确认

服务端收到消息后，先返回投递确认：

```json
{
  "type": "ack",
  "payload": {
    "clientMsgId": "local-uuid-12345",
    "messageId": "msg-100",
    "timestamp": "2026-05-30T14:30:00+08:00"
  }
}
```

| 字段 | 说明 |
|------|------|
| `clientMsgId` | 客户端发来的去重 ID |
| `messageId` | 服务端分配的消息 ID（持久化后的全局唯一 ID） |
| `timestamp` | 服务端接收时间 |

### 3.3 消息广播

服务端处理完消息后，向**群内所有在线成员**广播（包括发送者自己，前端用 `messageId` 匹配 `clientMsgId` 更新状态）：

```json
{
  "type": "message_broadcast",
  "payload": {
    "messageId": "msg-100",
    "groupId": "restaurant-pos",
    "authorId": "dev-xyz789",
    "authorName": "李工",
    "authorRole": "dev",
    "authorAvatar": "https://cdn.lovedev.cn/avatars/xyz789.png",
    "content": {
      "kind": "text",
      "text": "今日进度截图已上传，请查看"
    },
    "timestamp": "2026-05-30T14:30:00+08:00"
  }
}
```

### 3.4 消息被 AI 拦截（仅发送者可见）

```json
{
  "type": "message_blocked",
  "payload": {
    "clientMsgId": "local-uuid-12345",
    "reason": "消息包含疑似第三方联系方式，已被 AI 审核拦截"
  }
}
```

> 此消息**仅发送给消息发送者**，群内其他成员不会收到。对应 REST 错误码 `1006`。

---

## 4. 消息类型

`content.kind` 定义消息的渲染类型：

### 4.1 `text` — 普通文本

```json
{
  "kind": "text",
  "text": "你好，请问这一期什么时候验收？"
}
```

### 4.2 `image` — 图片

```json
{
  "kind": "image",
  "src": "https://cdn.lovedev.cn/uploads/screenshot.png",
  "caption": "接口测试截图"
}
```

| 字段 | 说明 |
|------|------|
| `src` | 图片 URL（先通过 `POST /api/v1/upload` 上传） |
| `caption` | 可选说明 |

### 4.3 `system` — 系统消息

```json
{
  "kind": "system",
  "text": "李工 加入了群聊"
}
```

> 由服务端生成，客户端不可发送此类消息。用于入群通知、里程碑变更、状态流转等。

**系统消息触发场景**：

- 成员加入/退出群
- 项目阶段变更
- 里程碑完成/新建
- 支付事件（客户托管、开发者收款）

### 4.4 `progress-report` — 每日进度报告

```json
{
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
      { "src": "https://cdn.lovedev.cn/uploads/s1.png", "caption": "接口测试截图" }
    ],
    "note": "预计明天完成支付回调"
  }
}
```

> 仅 `authorRole: "dev"` 可发送。由 `POST /api/v1/developer/projects/:id/progress` 触发，WebSocket 仅负责推送。

### 4.5 `progress-review` — 进度审查反馈

```json
{
  "kind": "progress-review",
  "reportDate": "2026-05-30",
  "feedback": "接口联调进展正常，支付回调部分请优先处理"
}
```

> `authorRole: "cs"` 或 `authorRole: "client"` 发送。

### 4.6 `acceptance-pass` — 阶段验收通过

```json
{
  "kind": "acceptance-pass",
  "phase": "一期 · 应用骨架",
  "feedback": "功能正常，通过验收"
}
```

> `authorRole: "client"` 发送。触发后对应里程碑货款释放给开发者。

### 4.7 `deliverable` — 交付物

```json
{
  "kind": "deliverable",
  "files": [
    { "id": "f-001", "name": "source-code-v1.0.zip", "size": "2.0 MB", "kind": "zip", "src": "https://…" },
    { "id": "f-002", "name": "API 文档.pdf", "size": "1.2 MB", "kind": "doc", "src": "https://…" }
  ],
  "note": "第一版本交付，包含全部源码和部署文档"
}
```

| `kind` 取值 | 图标 | 说明 |
|-------------|------|------|
| `image` | 🖼 | 图片 |
| `doc` | 📄 | 文档 |
| `zip` | 📦 | 压缩包 |
| `other` | 📎 | 其他文件 |

> `authorRole: "dev"` 发送。

### 4.8 `spec-card` — 需求规格卡片

```json
{
  "kind": "spec-card",
  "spec": {
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
  },
  "variant": "ai"
}
```

| `variant` | 说明 |
|-----------|------|
| `ai` | AI 生成的初始规格（蓝色标识） |
| `cs` | 客服修订后的最终规格（绿色标识） |

---

## 5. 群组管理事件

### 5.1 加入群组

当用户被加入项目群时，服务端推送：

```json
{
  "type": "group_joined",
  "payload": {
    "groupId": "restaurant-pos",
    "groupName": "餐厅点餐系统",
    "members": [
      { "userId": "dev-xyz789", "name": "李工", "role": "dev" },
      { "userId": "cs-001", "name": "客服·小张", "role": "cs" },
      { "userId": "cli-abc123", "name": "Creteper", "role": "client" }
    ]
  }
}
```

### 5.2 群组信息更新

```json
{
  "type": "group_updated",
  "payload": {
    "groupId": "restaurant-pos",
    "changes": {
      "progress": 80,
      "stage": "待验收"
    }
  }
}
```

---

## 6. 在线状态

### 6.1 成员上线/下线

```json
{
  "type": "presence",
  "payload": {
    "groupId": "restaurant-pos",
    "userId": "dev-xyz789",
    "status": "online"
  }
}
```

| `status` | 说明 |
|----------|------|
| `online` | 刚刚连接 |
| `offline` | 断开连接 |
| `typing` | 正在输入（可选实现） |

---

## 7. 错误处理

```json
{
  "type": "error",
  "payload": {
    "code": 422,
    "message": "你不是该群组的成员",
    "clientMsgId": "local-uuid-12345"
  }
}
```

| 常见错误码 | 说明 |
|-----------|------|
| `401` | 未认证 |
| `403` | 无权操作（非群成员） |
| `422` | 消息格式错误 |
| `1006` | AI 审核拦截 |

---

## 8. 通知推送

服务端通过 WebSocket 连接向客户端推送业务通知，无需客户端订阅。

### 8.1 通知事件

```json
{
  "type": "notification",
  "payload": {
    "id": "notif-001",
    "kind": "milestone_due",
    "title": "里程碑即将到期",
    "body": "「餐厅点餐系统」一期验收截止时间为 6 月 2 日",
    "projectId": "restaurant-pos",
    "groupId": "restaurant-pos",
    "createdAt": "2026-05-30T14:00:00+08:00",
    "read": false
  }
}
```

| `kind` | 说明 | 接收方 |
|--------|------|--------|
| `milestone_due` | 里程碑即将到期提醒 | 开发者 |
| `milestone_completed` | 里程碑已被客户验收通过 | 开发者 |
| `payment_received` | 客户已托管项目全款 | 开发者 |
| `payment_released` | 阶段款项已释放到余额 | 开发者 |
| `new_message` | 群内有新消息（离线时） | 客户 / 开发者 / 客服 |
| `dispute_filed` | 客户发起了争议 | 开发者 / 客服 |
| `dispute_resolved` | 争议已解决 | 客户 / 开发者 |
| `project_assigned` | 项目已被开发者接单 | 客户 |
| `progress_reminder` | 今日尚未上传进度 | 开发者 |
| `level_upgraded` | 开发者等级已升级 | 开发者 |

### 8.2 通知已读

客户端可通过 REST 标记通知已读（见各端 API 的通知接口）。

---

## 9. 重连策略

| 项目 | 建议值 |
|------|--------|
| 初始重连间隔 | 1 秒 |
| 最大重连间隔 | 30 秒 |
| 退避算法 | 指数退避 × 1.5（1s → 1.5s → 2.25s → …） |
| 最大重试次数 | 无限（永久重试） |
| 页面不可见时 | 继续重连 |
| 重连成功后 | 重新发送 `auth` 帧 → 从最后收到的 `messageId` 开始拉 REST 历史消息补齐 |

**离线消息补齐流程**：

1. 重连成功、认证通过
2. 客户端取本地存储的最后一条 `messageId`
3. 调用 `GET /api/v1/{role}/groups/{groupId}/messages?after={lastMessageId}`（若服务端支持 `after` 游标；否则使用 `before` 反向拉取再翻转）
4. 将拉取的消息插入本地消息列表
5. WebSocket 新消息正常接收

---

## 10. 连接生命周期

```
Client                          Server
  |                                |
  |--- ws connect --------------->|
  |                                |
  |--- { type: "auth" } --------->|
  |<-- { type: "auth_ok" } -------|
  |                                |
  |--- { type: "ping" } --------->| (每 30s)
  |<-- { type: "pong" } ----------|
  |                                |
  |--- { type: "message" } ------>|
  |<-- { type: "ack" } -----------|
  |<-- { type: "message_broadcast" } (含自己)
  |                                |
  |--- (断开) --------------------|
  |--- ws reconnect ------------->|
  |--- { type: "auth" } --------->|
  |<-- { type: "auth_ok" } -------|
  |--- REST GET /messages ------->|
  |<-- 离线消息 ------------------|
```
