# ResourceHub 项目进度追踪

> 最后更新: 2026-04-16

## 项目概览

**项目名称**: ResourceHub - 资源分享平台
**项目类型**: 全栈 Web 应用 (Next.js + PostgreSQL)
**目标用户**: 内容创作者、资源分享者、普通浏览者

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 后端 | Next.js API Routes |
| 数据库 | Neon PostgreSQL (免费) |
| ORM | Prisma |
| 认证 | JWT (jose) |
| 样式 | Tailwind CSS |
| 图标 | Lucide React |
| 部署 | Vercel |

---

## 设计规范

参考 Notion 的温暖中性风格：
- 主色调: #0075de (Notion Blue)
- 背景: #ffffff / #f6f5f4 (暖白交替)
- 文字: rgba(0,0,0,0.95) (温暖近黑)
- 边框: rgba(0,0,0,0.1)

---

## 进度追踪

### 已完成 ✅

- [x] SPEC.md 规范文档
- [x] 项目结构初始化
- [x] Prisma Schema 定义
- [x] 认证 API (注册/登录/登出/会话)
- [x] 基础库文件 (prisma, auth, api)

### 进行中 🔄

- [ ] 资源 CRUD API
- [ ] 点赞评论 API
- [ ] 前端 UI 组件
- [ ] 前端页面

### 待开始 ⏳

- [ ] Neon 数据库配置
- [ ] 部署到 Vercel

---

## 功能清单

### 用户认证
- [x] 用户注册 (POST /api/auth/register)
- [x] 用户登录 (POST /api/auth/login)
- [x] 用户登出 (POST /api/auth/logout)
- [x] 会话获取 (GET /api/auth/session)

### 资源管理
- [ ] 获取资源列表 (GET /api/resources)
- [ ] 获取单个资源 (GET /api/resources/[id])
- [ ] 创建资源 (POST /api/resources)
- [ ] 更新资源 (PUT /api/resources/[id])
- [ ] 删除资源 (DELETE /api/resources/[id])

### 互动功能
- [ ] 获取评论列表 (GET /api/resources/[id]/comments)
- [ ] 添加评论 (POST /api/resources/[id]/comments)
- [ ] 切换点赞 (POST /api/resources/[id]/like)
- [ ] 获取点赞数 (GET /api/resources/[id]/likes)

### 前端页面
- [ ] 首页 (资源列表)
- [ ] 资源详情页
- [ ] 发布资源页
- [ ] 登录页
- [ ] 注册页
- [ ] 个人主页

---

## 数据库模型

```
User ─────┬───── Resource (1:N)
           ├───── Comment (1:N)
           └───── Like (1:N, unique with Resource)

Resource ─┼───── Comment (1:N)
           └───── Like (1:N, unique with User)
```

---

## 环境变量

```env
DATABASE_URL=postgresql://...    # Neon 数据库连接
JWT_SECRET=...                   # JWT 密钥
NEXTAUTH_URL=http://localhost:3000
```

---

## 备注

- 项目根目录: `d:\VsCodeProjects\resource-hub`
- 使用 Notion 风格设计系统
- 支持游客浏览，登录后可发布/评论/点赞
