# 前端缺失功能清单

> 本文档对照已完善的 API 文档，逐端梳理前端尚未实现的功能。
> 每项标注 **严重度**（P0/P1/P2）和 **预估工作量**（人天）。

---

## 一、客户端（`/dashboard`）

### P0 · 关键阻塞

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 1 | **密码重置** | `POST /api/v1/auth/client/reset-password` | 登录页无"忘记密码"入口；无重置密码页面 | 1.5d |
| 2 | **充值状态轮询** | `GET /api/v1/client/wallet/topup/:orderId` | `TopupDialog` 用 `setTimeout` 模拟支付成功，无真实轮询 | 1d |
| 3 | **通知中心** | `GET /api/v1/client/notifications` + WebSocket 推送 | 无通知 Bell 图标、无通知列表、无未读计数 | 3d |
| 4 | **评价开发者** | `POST /api/v1/client/projects/:id/review` | 项目完结后无评分弹窗/表单 | 2d |

### P1 · 重要缺失

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 5 | **分期支付** | `GET .../installment-plan` + `POST .../installment` | `project.md` 提到信誉分 650+ 可分期，前端完全没有分期入口 | 2d |
| 6 | **消息游标补全** | `after` 参数 | 历史消息只支持 `before`（上拉加载），不支持 WebSocket 断线重连时的 `after` 向前补齐 | 0.5d |
| 7 | **消息搜索** | 无（建议新增） | 群内消息无法搜索历史关键词 | 2d |
| 8 | **修改密码** | `PUT /api/v1/auth/client/password` | `/dashboard/me` 页面无修改密码入口 | 0.5d |

### P2 · 体验优化

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 9 | **交易记录详情** | `GET /api/v1/client/wallet/transactions/:id` | 只有列表，无单条详情页 | 1d |
| 10 | **项目履历** | `GET /api/v1/client/projects?status=settled` | dashboard 只展示进行中项目，已完结项目无汇总视图 | 1d |

---

## 二、程序员端（`/devdashboard` + `/devlopments`）

### P0 · 关键阻塞

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 1 | **实名认证** | `POST /api/v1/developer/real-name` | `/devdashboard/me` 显示"B 级 · 已认证"但无认证流程入口；`WithdrawDialog` 无实名校验 | 2d |
| 2 | **提现账户管理** | `GET/POST/DELETE /api/v1/developer/wallet/accounts` | 提现时没有已保存账户选择，每次手动输入；无绑定/解绑界面 | 2d |
| 3 | **通知中心** | `GET /api/v1/developer/notifications` + WebSocket 推送 | 无通知入口，开发者看不到里程碑到期、款项释放等关键提醒 | 3d |
| 4 | **评价客户** | `POST /api/v1/developer/projects/:id/review-client` | 项目完结后无评价入口 | 2d |

### P1 · 重要缺失

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 5 | **退出项目** | `POST /api/v1/developer/projects/:id/quit` | 接单后无法主动退出 | 1.5d |
| 6 | **`bids` 字段语义修复** | — | 接单列表 `Order` 类型含 `bids: number`，但业务是"先到先得"抢单而非竞价；应移除或改为 `viewedCount` | 0.5d |
| 7 | **消息游标补全** | `after` 参数 | 同客户端 | 0.5d |

### P2 · 体验优化

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 8 | **接单历史** | `GET /api/v1/developer/projects?status=settled` | 只展示进行中项目，无历史订单查看 | 1d |
| 9 | **分类 `other` 缺失** | API 返回 8 个分类，前端 `categories` 数组含 `other` 但接单列表 API 文档未列 `other` | 0.25d |

---

## 三、后台管理端（`/admin`）

### P0 · 关键阻塞

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 1 | **争议管理** | `GET /admin/disputes` 系列 | 客户端可发起争议，但管理端无争议列表、详情、处理页面 | 3d |
| 2 | **退款处理** | `POST /api/v1/admin/disputes/:id/resolve` | 无退款操作界面，争议处理流程断链 | 2d |

### P1 · 重要缺失

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 3 | **开发者等级手动调整** | `PUT /api/v1/admin/users/:id/level` | 用户编辑页面无等级调整按钮 | 1d |
| 4 | **平台公告管理** | 公告 CRUD | 无公告创建/编辑/删除页面；开发者端已有公告读取 UI | 2d |
| 5 | **通知推送** | `POST /api/v1/admin/notifications/send` | 无向用户或角色群发通知的界面 | 1.5d |
| 6 | **交易流水筛选** | `GET /api/v1/admin/finance/transactions?userId=…` | 财务页面只展示图表概览，无交易明细表 | 1d |

### P2 · 体验优化

| # | 功能 | API | 现状 | 工作量 |
|---|------|-----|------|--------|
| 7 | **项目分配客服流程** | `POST /api/v1/admin/projects/:id/assign-cs` | 目前 mock 数据直接绑定客服，无分配操作界面 | 1d |
| 8 | **用户详情页** | `GET /api/v1/admin/users/:id` | 只有列表，无单用户详情视图（含交易历史、项目列表） | 1.5d |
| 9 | **财务导出** | 无（建议新增） | 财务统计无导出 CSV/Excel 功能 | 1d |

---

## 四、全局缺失

| # | 功能 | 说明 | 影响 | 工作量 |
|---|------|------|------|--------|
| 1 | **WebSocket 客户端** | 三端的群聊当前使用 mock 数据，未接入真实 WebSocket；无心跳、重连、离线消息补齐逻辑 | 群聊不可用 | 5d |
| 2 | **文件上传** | `POST /api/v1/upload` — 进度上传截图、交付物上传等需要先调上传接口获取 URL，当前直接写死 CDN URL | 图片/文件上传不可用 | 2d |
| 3 | **SSE 流式 AI 对话** | `POST /api/v1/client/ai-chats/:id/messages` 返回 SSE，前端无 EventSource 消费逻辑 | AI 对话不可用 | 3d |
| 4 | **401 自动刷新 Token** | `POST /api/v1/auth/{role}/refresh-token` — 文档要求前端拦截器 401 自动刷新，当前无实现 | Token 过期即掉线 | 1.5d |
| 5 | **表单校验** | 登录/注册/充值/提现等表单缺少与 API 文档一致的客户端校验（如密码复杂度、金额下限） | 错误信息延迟到服务端返回 | 1d |
| 6 | **i18n / 多语言** | 当前硬编码中文文案 | 不支持国际化 | — |
| 7 | **无障碍（a11y）** | 缺少 `aria-label`、键盘导航、焦点管理 | 可访问性差 | 2d |

---

## 五、建议优先级排序

```
第一优先级（阻塞核心业务流程）：
  客户端 P0: 充值状态轮询、通知中心、评价开发者
  程序员端 P0: 实名认证、提现账户管理、通知中心
  管理端 P0: 争议管理、退款处理
  全局: WebSocket 客户端、SSE AI 对话、Token 刷新

第二优先级（完善业务闭环）：
  客户端 P1: 分期支付、消息游标、修改密码
  程序员端 P1: 退出项目、bids 修复、评价客户、消息游标
  管理端 P1: 等级调整、公告管理、通知推送
  全局: 文件上传

第三优先级（体验与运营）：
  各端 P2: 历史记录、详情页、导出等
  全局: a11y、表单校验
```

---

> 最后更新：2026-05-30
> 对照 API 文档版本：`docs/client/api.md` / `docs/developer/api.md` / `docs/admin/api.md`
