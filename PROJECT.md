# ResourceHub 项目进度追踪

> 最后更新: 2026-04-16

## 项目概览

**项目名称**: ResourceHub - 资源分享平台
**项目类型**: 全栈 Web 应用 (Next.js + PostgreSQL)
**目标用户**: 内容创作者、资源分享者，普通浏览者

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
- [x] 资源 CRUD API
- [x] 点赞评论 API
- [x] 前端 UI 组件
- [x] 前端页面
- [x] Git 首次提交

### 待开始 ⏳

- [ ] Neon 数据库配置
- [ ] 部署到 Vercel

---

## 功能清单

### 用户认证 ✅
- [x] 用户注册 (POST /api/auth/register)
- [x] 用户登录 (POST /api/auth/login)
- [x] 用户登出 (POST /api/auth/logout)
- [x] 会话获取 (GET /api/auth/session)

### 资源管理 ✅
- [x] 获取资源列表 (GET /api/resources)
- [x] 获取单个资源 (GET /api/resources/[id])
- [x] 创建资源 (POST /api/resources)
- [x] 更新资源 (PUT /api/resources/[id])
- [x] 删除资源 (DELETE /api/resources/[id])

### 互动功能 ✅
- [x] 获取评论列表 (GET /api/resources/[id]/comments)
- [x] 添加评论 (POST /api/resources/[id]/comments)
- [x] 切换点赞 (POST /api/resources/[id]/like)
- [x] 获取点赞数 (GET /api/resources/[id]/likes)

### 前端页面 ✅
- [x] 首页 (资源列表)
- [x] 资源详情页
- [x] 发布资源页
- [x] 登录页
- [x] 注册页
- [x] 个人主页

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

部署前需配置：
```env
DATABASE_URL=postgresql://...    # Neon 数据库连接
JWT_SECRET=your-secret-key       # JWT 密钥（随机字符串）
NEXTAUTH_URL=http://localhost:3000  # 开发环境
```

---

## 快速开始

```bash
cd resource-hub

# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 DATABASE_URL

# 3. 初始化数据库
npx prisma db push
npx prisma generate

# 4. 启动开发服务器
npm run dev
```

---

## 部署到 Vercel + Neon

### 1. 创建 Neon 数据库
1. 访问 https://neon.tech 注册
2. 创建新项目 "resource-hub"
3. 复制连接字符串到 DATABASE_URL

### 2. 部署到 Vercel
1. GitHub 创建仓库并推送代码
2. 访问 https://vercel.com 导入项目
3. 配置环境变量：
   - DATABASE_URL
   - JWT_SECRET
4. 部署

### 3. 配置生产环境
在 Vercel 设置 NEXTAUTH_URL 为你的 Vercel 域名

---

## 项目结构

```
resource-hub/
├── prisma/schema.prisma     # 数据模型
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API 路由
│   │   ├── login/           # 登录页
│   │   ├── register/        # 注册页
│   │   ├── create/          # 发布资源页
│   │   ├── resources/[id]/  # 资源详情页
│   │   └── profile/[username]/ # 个人主页
│   ├── components/          # React 组件
│   ├── hooks/               # 自定义 Hooks
│   ├── lib/                 # 工具库
│   └── types/               # TypeScript 类型
├── SPEC.md                  # 规范文档
├── ARC.md                   # 架构文档
├── TASK.md                  # 任务清单
└── PROJECT.md               # 项目进度
```

---

## 备注

- 项目根目录: `d:\VsCodeProjects\resource-hub`
- 使用 Notion 风格设计系统
- 支持游客浏览，登录后可发布/评论/点赞
- Git 仓库已初始化并完成首次提交
