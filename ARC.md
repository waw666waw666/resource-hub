# ResourceHub 架构设计

## 1. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App                       │
│  ┌─────────────────┐    ┌─────────────────────────┐    │
│  │   Client Layer   │    │      Server Layer        │    │
│  │  (React Components)│   │   (API Routes / RSC)    │    │
│  └────────┬─────────┘    └───────────┬─────────────┘    │
│           │                          │                  │
│  ┌────────▼──────────────────────────▼─────────────┐   │
│  │              State Management / Hooks             │   │
│  │         (useAuth, useResources, etc.)             │   │
│  └─────────────────────┬───────────────────────────┘   │
│                        │                                │
│  ┌─────────────────────▼───────────────────────────┐   │
│  │                  API Client                      │   │
│  │              (fetch with JWT)                    │   │
│  └─────────────────────┬───────────────────────────┘   │
└────────────────────────┼────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    Vercel Edge                           │
│              (Serverless Functions)                     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Neon PostgreSQL                       │
│              (Prisma ORM + Connection Pool)             │
└─────────────────────────────────────────────────────────┘
```

## 2. 目录结构

```
resource-hub/
├── prisma/
│   └── schema.prisma          # 数据模型定义
├── src/
│   ├── app/
│   │   ├── api/               # API 路由
│   │   │   └── auth/
│   │   │       ├── register/
│   │   │       ├── login/
│   │   │       ├── logout/
│   │   │       └── session/
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx          # 根布局
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ResourceCard.tsx
│   │   └── CommentItem.tsx
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── lib/                    # 工具库
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── auth.ts            # 认证工具
│   │   └── api.ts             # API 响应工具
│   └── types/                  # TypeScript 类型
│       └── index.ts
├── public/                     # 静态资源
├── .env.example               # 环境变量示例
├── package.json
└── SPEC.md                    # 规范文档
```

## 3. 数据模型

### User
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| email | String (unique) | 邮箱 |
| username | String (unique) | 用户名 |
| password | String | bcrypt 加密 |
| avatar | String? | 头像 URL |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Resource
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| title | String | 标题 |
| description | String? | 描述 |
| content | String | 内容 (Markdown) |
| coverImage | String? | 封面图 |
| tags | String[] | 标签数组 |
| authorId | String | 作者 ID (FK) |
| deleted | Boolean | 软删除标记 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Comment
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| content | String | 评论内容 |
| authorId | String | 作者 ID (FK) |
| resourceId | String | 资源 ID (FK) |
| parentId | String? | 父评论 ID (自关联) |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Like
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (CUID) | 主键 |
| userId | String | 用户 ID (FK) |
| resourceId | String | 资源 ID (FK) |
| createdAt | DateTime | 创建时间 |
| **Unique** | [userId, resourceId] | 防止重复点赞 |

## 4. API 设计

### 认证 API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| POST | /api/auth/logout | 用户登出 | 是 |
| GET | /api/auth/session | 获取会话 | 是 |

### 资源 API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/resources | 获取资源列表 | 否 |
| GET | /api/resources/[id] | 获取单个资源 | 否 |
| POST | /api/resources | 创建资源 | 是 |
| PUT | /api/resources/[id] | 更新资源 | 是 (作者) |
| DELETE | /api/resources/[id] | 删除资源 | 是 (作者) |

### 互动 API

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/resources/[id]/comments | 获取评论 | 否 |
| POST | /api/resources/[id]/comments | 添加评论 | 是 |
| POST | /api/resources/[id]/like | 切换点赞 | 是 |
| GET | /api/resources/[id]/likes | 获取点赞数 | 否 |

## 5. 认证流程

```
注册流程:
用户输入 (email, username, password)
  → 前端验证
  → POST /api/auth/register
  → 后端验证唯一性
  → bcrypt.hash(password, 12)
  → 创建 User 记录
  → createToken({userId, email, username})
  → setAuthCookie(token)
  → 返回用户信息

登录流程:
用户输入 (email, password)
  → 前端验证
  → POST /api/auth/login
  → 后端查找 User
  → bcrypt.compare(password, hashed)
  → createToken()
  → setAuthCookie()
  → 返回用户信息

请求认证:
请求携带 Cookie
  → getSession()
  → verifyToken(token)
  → 返回 JWTPayload 或 null
```

## 6. 异常处理策略

| 场景 | 处理方式 |
|------|----------|
| 网络错误 | 返回 500 + 友好错误信息 |
| 参数缺失 | 返回 400 + 具体缺失字段 |
| 未登录 | 返回 401 + 提示登录 |
| 无权限 | 返回 403 + 提示权限不足 |
| 资源不存在 | 返回 404 + 提示不存在 |
| 重复注册 | 返回 409 + 提示已存在 |
| 验证码失败 | 返回 401 + 提示凭证无效 |

## 7. 安全措施

- **密码**: bcrypt 12轮加密
- **SQL注入**: Prisma 参数化查询
- **XSS**: React 自动转义
- **CSRF**: SameSite Cookie
- **Rate Limit**: Vercel 内置限流
