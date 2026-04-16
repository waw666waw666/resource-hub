# ResourceHub - 资源分享平台

## 1. Concept & Vision

ResourceHub 是一个温暖、简洁的资源分享平台，融合 Notion 的温暖中性美学与现代极简主义。平台允许用户以登录或游客身份浏览、点赞、评论资源，同时支持认证用户发布和管理自己的资源与文章。整体氛围如同在一个高品质的笔记本上翻阅他人的智慧结晶——温暖而不冰冷，简洁而不简陋。

## 2. Design Language

### 美学方向
参考 Notion 的温暖中性风格：淡米白色背景、暖灰色调、近黑色文字，创造如同纸质笔记本般温暖的阅读体验。

### 调色板
```
Primary Background:    #ffffff (纯白页面背景)
Warm Background Alt:   #f6f5f4 (暖米色，用于区块交替)
Primary Text:          rgba(0,0,0,0.95) (温暖近黑，非纯黑)
Secondary Text:        #615d59 (暖灰500)
Muted Text:           #a39e98 (暖灰300)
Brand Accent:          #0075de (Notion Blue - 主要CTA)
Success:              #1aae39 (成功状态)
Warning:              #dd5b00 (警告状态)
Border Whisper:       rgba(0,0,0,0.1) (细线分割线)
Shadow Soft:          rgba(0,0,0,0.04) (柔和阴影)
```

### 字体
- 主字体：`Inter` (Google Fonts)，回退 `-apple-system, system-ui, Segoe UI`
- 字重：400(正文)、500(UI元素)、600(导航)、700(标题)
- 字间距：显示尺寸负间距 (-2.125px at 64px)，正文 normal

### 空间系统
- 基础单位：8px
- 间距刻度：2px, 4px, 6px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px
- 卡片圆角：12px (标准卡片), 16px (特色卡片)
- 按钮圆角：4px

### 动效哲学
- 微妙的淡入淡出 (opacity 0→1, 300ms ease-out)
- 按钮悬停缩放 scale(1.02)，点击 scale(0.98)
- 卡片悬停阴影轻微增强
- 页面切换使用平滑过渡
- 尊重 `prefers-reduced-motion`

### 视觉资产
- 图标：Lucide React (线性、简洁)
- 图片：用户上传，支持 WebP 格式
- 头像：用户生成或默认 Gravatar 风格

## 3. Layout & Structure

### 页面结构
```
┌─────────────────────────────────────────────────────┐
│  Header: Logo | Nav Links | Auth Buttons            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Main Content Area                                  │
│  - 首页：资源卡片网格 (Hero + 筛选)                 │
│  - 详情页：资源完整内容 + 评论                       │
│  - 发布页：编辑器                                   │
│  - 个人页：用户发布的资源                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer: 版权 | 链接                                │
└─────────────────────────────────────────────────────┘
```

### 响应式策略
- Desktop (>1024px)：3列资源网格，侧边导航
- Tablet (768-1024px)：2列网格
- Mobile (<768px)：单列堆叠，底部导航

## 4. Features & Interactions

### 核心功能

#### 4.1 用户认证
- **注册**：邮箱 + 密码 + 用户名，实时验证
- **登录**：邮箱 + 密码，JWT Token 认证
- **游客浏览**：无需登录即可浏览所有公开资源
- **登出**：清除 Token，返回首页

#### 4.2 资源发布（需登录）
- **创建资源**：标题、描述、内容、标签、封面图
- **编辑资源**：仅作者可编辑自己的资源
- **删除资源**：软删除，仅作者可操作

#### 4.3 点赞功能
- **游客点赞**：提示登录
- **已登录用户**：切换点赞状态
- **实时更新**：点赞数即时变化
- **防止刷赞**：同一用户对同一资源只能点赞一次

#### 4.4 评论功能
- **游客评论**：提示登录
- **已登录用户**：发表回复评论
- **嵌套显示**：最多2层嵌套
- **实时显示**：新评论即时可见

#### 4.5 资源浏览
- **首页列表**：按时间/点赞数排序
- **分类筛选**：按标签筛选
- **搜索功能**：标题 + 内容关键词搜索

### 交互细节
- **按钮点击**：scale(0.98) 反馈
- **表单错误**：红色边框 + 错误提示文字
- **加载状态**：骨架屏 (Skeleton)
- **空状态**：友好插图 + 引导文案
- **成功提示**：Toast 通知 (3秒自动消失)

### 错误处理
- **网络错误**：重试按钮 + 友好提示
- **表单验证**：实时校验 + 提交前完整校验
- **404 页面**：自定义插图 + 返回首页链接

## 5. Component Inventory

### 5.1 Header
- Logo + 站点名称
- 导航链接：首页、探索
- 认证按钮：登录/注册 或 用户头像/登出
- **状态**：透明背景滚动后变白

### 5.2 ResourceCard
- 封面图（可选）
- 标题（截断2行）
- 描述（截断3行）
- 作者头像 + 用户名
- 发布时间
- 点赞数 + 评论数
- **状态**：Default / Hover(阴影增强) / Loading(skeleton)

### 5.3 Button
- **变体**：Primary (蓝色) / Secondary (灰色) / Ghost (透明)
- **尺寸**：Small / Medium / Large
- **状态**：Default / Hover / Active / Disabled / Loading

### 5.4 Input
- Label + Input + Error Message
- **类型**：Text / Email / Password / Textarea
- **状态**：Default / Focus / Error / Disabled

### 5.5 Modal
- 遮罩层 (rgba(0,0,0,0.85))
- 内容卡片居中
- 关闭按钮
- **动画**：淡入 + 轻微上移

### 5.6 Toast
- 成功/错误/警告/信息 四种类型
- 右侧固定位置
- 3秒自动消失
- 可手动关闭

### 5.7 CommentItem
- 用户头像 + 用户名 + 时间
- 评论内容
- 回复按钮 + 点赞按钮
- **嵌套**：子评论缩进16px

## 6. Technical Approach

### 6.1 技术栈
- **前端框架**：Next.js 14 (App Router)
- **后端**：Next.js API Routes (Serverless)
- **数据库**：Neon PostgreSQL (免费额度)
- **ORM**：Prisma
- **认证**：NextAuth.js (JWT)
- **样式**：Tailwind CSS
- **图标**：Lucide React
- **部署**：Vercel

### 6.2 数据模型
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String   (hashed)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  resources Resource[]
  comments  Comment[]
  likes     Like[]
}

model Resource {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String
  coverImage  String?
  tags        String[]
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  comments    Comment[]
  likes       Like[]
  deleted     Boolean  @default(false)
}

model Comment {
  id         String    @id @default(cuid())
  content    String
  authorId   String
  author     User      @relation(fields: [authorId], references: [id])
  resourceId String
  resource   Resource  @relation(fields: [resourceId], references: [id])
  parentId   String?
  parent     Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies    Comment[] @relation("CommentReplies")
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Like {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  resourceId String
  resource   Resource @relation(fields: [resourceId], references: [id])
  createdAt  DateTime @default(now())

  @@unique([userId, resourceId])
}
```

### 6.3 API 设计
```
POST   /api/auth/register     - 用户注册
POST   /api/auth/login        - 用户登录
GET    /api/auth/session      - 获取当前会话
POST   /api/auth/logout       - 登出

GET    /api/resources         - 获取资源列表 (支持分页、筛选、搜索)
GET    /api/resources/[id]     - 获取单个资源
POST   /api/resources          - 创建资源 (需登录)
PUT    /api/resources/[id]    - 更新资源 (仅作者)
DELETE /api/resources/[id]    - 删除资源 (仅作者，软删除)

GET    /api/resources/[id]/comments - 获取评论列表
POST   /api/resources/[id]/comments  - 添加评论 (需登录)

POST   /api/resources/[id]/like      - 切换点赞 (需登录)
GET    /api/resources/[id]/likes      - 获取点赞数
```

### 6.4 认证策略
- 使用 NextAuth.js + Credentials Provider
- JWT 存储在 HTTP-only Cookie
- Token 有效期：7天
- 刷新机制：自动续期

### 6.5 安全措施
- 密码 bcrypt 加密 (12 rounds)
- SQL 注入：Prisma 参数化查询
- XSS：React 自动转义 + DOMPurify
- CORS：仅允许 Vercel 域名
- Rate Limiting：API 路由限流
