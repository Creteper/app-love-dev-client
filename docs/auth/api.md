# 鉴权接口

> 遵循 [通用约定](../shared/common.md)。鉴权接口 **无需携带** `Authorization` Header（注册/登录本身就是在获取 Token）。

---

## 路由说明

三端使用不同的路径前缀区分身份：

| 端 | 路径前缀 | 可注册角色 |
|----|----------|-----------|
| 客户端 | `/api/v1/auth/client` | 客户 |
| 开发者端 | `/api/v1/auth/developer` | 开发者 |
| 管理端 | `/api/v1/auth/admin` | 管理员 / 客服 |

三端接口的**请求/响应格式完全相同**，以下以客户端为例。其他两端替换路径前缀即可。

---

## 1. 注册（客户 / 开发者）

管理端不开放自主注册，由管理员在后台创建。

```http
POST /api/v1/auth/client/register
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "Abc123456!",
  "code": "8291"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | ✓ | 邮箱地址，需唯一 |
| `password` | `string` | ✓ | 密码，8-32 字符，至少包含大小写字母和数字 |
| `code` | `string` | ✓ | 邮箱验证码，有效期 5 分钟 |
| `name` | `string` | | 昵称，默认为邮箱前缀 |
| `skills` | `string[]` | | **仅开发者端**：擅长技能列表，如 `["React Native", "Node.js"]` |

**成功响应** (201)：

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": "cli-abc123",
    "email": "client@example.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 7200
  }
}
```

**错误示例** (409)：

```json
{
  "code": 409,
  "message": "该邮箱已注册"
}
```

---

## 2. 发送验证码

```http
POST /api/v1/auth/client/send-code
Content-Type: application/json

{
  "email": "client@example.com",
  "scene": "register"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | ✓ | 接收验证码的邮箱 |
| `scene` | `string` | ✓ | `register` / `login` / `reset-password` |

**限制**：同一邮箱同一场景 60 秒内只能发送一次。

**响应** (200)：

```json
{
  "code": 0,
  "message": "验证码已发送"
}
```

---

## 3. 登录

```http
POST /api/v1/auth/client/login
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "Abc123456!"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | ✓ | |
| `password` | `string` | ✓ | |

**管理端登录的特殊之处**：管理端不区分注册接口（管理员预创建账户），登录时响应中包含 `role` 字段：

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "userId": "admin-001",
    "email": "admin@lovedev.cn",
    "name": "张管理",
    "role": "admin",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 7200
  }
}
```

| `role` 取值 | 说明 |
|-------------|------|
| `admin` | 管理员（全部权限） |
| `cs` | 客服（仅自己负责的项目和待对接客户） |

**客户/开发者端登录响应**不含 `role` 字段（隐式为各自的角色）。

---

## 4. 退出登录

```http
POST /api/v1/auth/client/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `refreshToken` | `string` | ✓ | 需撤销的 Refresh Token |

**响应** (200)：

```json
{
  "code": 0,
  "message": "已退出登录"
}
```

> 后端会将此 Refresh Token 加入黑名单，Access Token 会自然过期。

---

## 5. 刷新 Token

```http
POST /api/v1/auth/client/refresh-token
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `refreshToken` | `string` | ✓ | |

**响应** (200)：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "bmV3IHJlZnJlc2ggdG9r...",
    "expiresIn": 7200
  }
}
```

> **并发刷新去重**：前端如果在短时间内发起多次刷新请求，后端应保证同一 `refreshToken` 只签发一次新的 Token pair。旧 `refreshToken` 在签发新 pair 后立即失效（Token 轮转）。

---

## 6. 获取当前用户信息

```http
GET /api/v1/auth/client/me
Authorization: Bearer <access_token>
```

**客户端响应** (200)：

```json
{
  "code": 0,
  "data": {
    "userId": "cli-abc123",
    "email": "client@example.com",
    "name": "Creteper",
    "phone": "+86 138****8888",
    "avatar": "https://cdn.lovedev.cn/avatars/abc123.png",
    "creditScore": 650,
    "realNameVerified": true,
    "registeredAt": "2024-11-15T10:00:00+08:00"
  }
}
```

**开发者端响应**（额外字段）：

```json
{
  "code": 0,
  "data": {
    "userId": "dev-xyz789",
    "email": "dev@example.com",
    "name": "陈工",
    "avatar": "https://cdn.lovedev.cn/avatars/xyz789.png",
    "level": "B",
    "skills": ["React Native", "TypeScript", "Node.js"],
    "rating": 4.7,
    "finishedOrders": 14,
    "registeredAt": "2025-01-12T08:00:00+08:00"
  }
}
```

**管理端响应**：

```json
{
  "code": 0,
  "data": {
    "userId": "admin-001",
    "email": "admin@lovedev.cn",
    "name": "张管理",
    "role": "admin",
    "avatar": null
  }
}
```

---

## 7. 修改密码

```http
PUT /api/v1/auth/client/password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "Abc123456!",
  "newPassword": "NewPass789!"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `oldPassword` | `string` | ✓ | |
| `newPassword` | `string` | ✓ | 8-32 字符，至少包含大小写字母和数字 |

**成功响应** (200)：

```json
{
  "code": 0,
  "message": "密码修改成功"
}
```

---

## 8. 重置密码

> 先调用 [发送验证码](#2-发送验证码) 获取 `reset-password` 场景的验证码，再调用此接口。

```http
POST /api/v1/auth/client/reset-password
Content-Type: application/json

{
  "email": "client@example.com",
  "code": "7823",
  "newPassword": "NewPass456!"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `string` | ✓ | 账户邮箱 |
| `code` | `string` | ✓ | 邮箱验证码（`scene=reset-password`） |
| `newPassword` | `string` | ✓ | 新密码，8-32 字符，至少包含大小写字母和数字 |

**成功响应** (200)：

```json
{
  "code": 0,
  "message": "密码重置成功，请重新登录"
}
```

> 重置成功后所有已签发的 Token 立即失效，需重新登录。

---

## JWT Payload 结构

Access Token 解码后的载荷：

```json
{
  "sub": "cli-abc123",
  "role": "client",
  "iat": 1717032000,
  "exp": 1717039200
}
```

| 字段 | 说明 |
|------|------|
| `sub` | 用户 ID |
| `role` | `client` / `developer` / `admin` / `cs` |
| `iat` | 签发时间（Unix timestamp） |
| `exp` | 过期时间（Unix timestamp） |

> 后端需为管理端用户区分 `admin` 和 `cs` 两种 `role`。客服登录成功后，除 `me` 接口外，其余管理端接口根据 `role` 做权限过滤（参考各接口的「权限」标注）。
