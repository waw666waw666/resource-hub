# ResourceHub 原子任务清单

> 创建日期: 2026-04-16

---

## 前置依赖
- 项目初始化 ✅
- 认证 API ✅

---

## Phase 1: 资源管理 API

### 1.1 获取资源列表
- [ ] **T1.1.1**: 实现 GET /api/resources
  - 输入: page, limit, tag, search, sort
  - 输出: { resources[], total, page, totalPages }
  - 依赖: 无

### 1.2 获取单个资源
- [ ] **T1.2.1**: 实现 GET /api/resources/[id]
  - 输入: id (path)
  - 输出: resource + author + likesCount + commentsCount
  - 依赖: T1.1.1

### 1.3 创建资源
- [ ] **T1.3.1**: 实现 POST /api/resources
  - 输入: title, description, content, coverImage, tags
  - 输出: created resource
  - 依赖: T1.2.1, 认证 ✅

### 1.4 更新资源
- [ ] **T1.4.1**: 实现 PUT /api/resources/[id]
  - 输入: id (path), 更新字段
  - 输出: updated resource
  - 依赖: T1.3.1, 认证 + 作者验证

### 1.5 删除资源
- [ ] **T1.5.1**: 实现 DELETE /api/resources/[id]
  - 输入: id (path)
  - 输出: success message
  - 依赖: T1.4.1, 认证 + 作者验证
  - 注意: 软删除 (deleted = true)

---

## Phase 2: 互动功能 API

### 2.1 获取评论列表
- [ ] **T2.1.1**: 实现 GET /api/resources/[id]/comments
  - 输入: resourceId (path)
  - 输出: comments[] (嵌套结构)
  - 依赖: 无

### 2.2 添加评论
- [ ] **T2.2.1**: 实现 POST /api/resources/[id]/comments
  - 输入: content, parentId?(可选)
  - 输出: created comment
  - 依赖: T2.1.1, 认证

### 2.3 切换点赞
- [ ] **T2.3.1**: 实现 POST /api/resources/[id]/like
  - 输入: resourceId (path)
  - 输出: { liked: boolean, likesCount: number }
  - 依赖: 认证

### 2.4 获取点赞数
- [ ] **T2.4.1**: 实现 GET /api/resources/[id]/likes
  - 输入: resourceId (path)
  - 输出: { likesCount, userLiked }
  - 依赖: T2.3.1

---

## Phase 3: 前端组件

### 3.1 基础 UI 组件
- [ ] **T3.1.1**: Button 组件
  - 变体: primary, secondary, ghost
  - 状态: default, hover, active, disabled, loading
- [ ] **T3.1.2**: Input 组件
  - 类型: text, email, password, textarea
  - 状态: default, focus, error, disabled
- [ ] **T3.1.3**: Modal 组件
- [ ] **T3.1.4**: Toast 组件
- [ ] **T3.1.5**: Skeleton 组件

### 3.2 业务组件
- [ ] **T3.2.1**: Header 组件
  - Logo, Nav, Auth Buttons
- [ ] **T3.2.2**: Footer 组件
- [ ] **T3.2.3**: ResourceCard 组件
  - 封面图, 标题, 描述, 作者, 点赞/评论数
- [ ] **T3.2.4**: CommentItem 组件
  - 头像, 用户名, 时间, 内容, 回复/点赞按钮

### 3.3 自定义 Hooks
- [ ] **T3.3.1**: useAuth Hook
  - 登录状态, login, logout, register
- [ ] **T3.3.2**: useToast Hook
  - 显示 Toast 通知

---

## Phase 4: 前端页面

### 4.1 认证页面
- [ ] **T4.1.1**: 登录页 /login
- [ ] **T4.1.2**: 注册页 /register

### 4.2 首页
- [ ] **T4.2.1**: 首页 / (资源列表)
  - Hero 区域
  - 筛选/排序
  - 资源卡片网格
  - 分页

### 4.3 资源详情页
- [ ] **T4.3.1**: 资源详情页 /resources/[id]
  - 资源完整内容
  - 评论列表
  - 点赞按钮
  - 相关资源

### 4.4 发布/编辑页
- [ ] **T4.4.1**: 创建资源页 /create
  - 富文本编辑器
  - 标签输入
  - 封面图上传
- [ ] **T4.4.2**: 编辑资源页 /resources/[id]/edit
  - 复用创建页表单

### 4.5 个人主页
- [ ] **T4.5.1**: 用户主页 /profile/[username]
  - 用户信息
  - 用户发布的资源

---

## Phase 5: 数据库与部署

### 5.1 Neon 数据库配置
- [ ] **T5.1.1**: 创建 Neon 项目
- [ ] **T5.1.2**: 配置 DATABASE_URL
- [ ] **T5.1.3**: 运行 prisma db push
- [ ] **T5.1.4**: 生成 Prisma Client

### 5.2 Vercel 部署
- [ ] **T5.2.1**: GitHub 仓库推送
- [ ] **T5.2.2**: Vercel 导入项目
- [ ] **T5.2.3**: 配置环境变量
- [ ] **T5.2.4**: 部署验证

---

## 任务依赖图

```
[T1.1.1] ──┬── [T1.2.1] ── [T1.3.1] ── [T1.4.1] ── [T1.5.1]
           │
           └── [T2.1.1] ── [T2.2.1]

[T1.1.1] ──┬── [T3.2.3] ── [T4.2.1]
           │
[T3.1.1~5]─┴── [T3.2.1,2] ── [T4.1.1,2]

[T5.1.1~4] ── [T5.2.1~4]
```

---

## 验收标准

每个任务完成后需满足:
1. ✅ 代码编译通过 (npm run build)
2. ✅ ESLint 检查通过
3. ✅ API 返回格式正确
4. ✅ 文档已更新
5. ✅ Git 已提交
