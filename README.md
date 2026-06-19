# Resource Hub

一个基于 Next.js 14 和 Prisma 构建的个人资源归档与分享数据库系统。

## 功能特性

*   **资源分类归档**：提供结构化的资源数据模型，便于按类别、标签整理个人收集的学习资料和工具链接。
*   **安全认证**：集成 JWT (基于 `jose` 库) 双令牌认证与 `bcryptjs` 密码加盐哈希，保障数据安全性。
*   **关系型数据库映射**：使用 Prisma ORM 框架，支持快速在本地执行数据库模式迁移、同步以及通过 Prisma Studio 进行可视化管理。
*   **自适应界面**：使用 Tailwind CSS 配合 Lucide Icons 构建，布局精简清晰。

## 技术栈

*   **前端核心**：Next.js 14 (React 18) + TypeScript
*   **样式库**：Tailwind CSS + Autoprefixer
*   **数据库框架**：Prisma Client (v5.22)
*   **安全加密**：bcryptjs, jose

## 本地开发与数据库同步

### 1. 配置环境变量
在根目录新建 `.env` 并配置您的数据库连接字符串（可参考 `.env.example`）：
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
```

### 2. 依赖安装与运行
```bash
# 安装依赖
npm install

# 自动生成 Prisma 客户端并将模式同步至本地数据库
npm run db:push

# 启动本地开发服务器
npm run dev
```

### 3. 可视化管理数据库
```bash
# 启动 Prisma Studio 可视化数据浏览器 (默认运行在 http://localhost:5555)
npm run db:studio
```

## 部署与构建

```bash
# 编译打包 Next.js 生产版本
npm run build
```

## 使用方法

1. **界面交互**：启动本地服务器后，访问 `http://localhost:3000` 登录系统。在网页端提供可视化的添加资源、分类管理和检索过滤功能。
2. **Prisma 数据库后台管理**：
   - 本地运行 `npm run db:studio`，在弹出的 `Prisma Studio`（`http://localhost:5555`）网页中，可以直接对资源记录（Resources）、分类（Categories）和用户（Users）表进行添加、删除和编辑操作。

## 目录结构

```text
.
├── prisma/
│   └── schema.prisma          # Prisma 数据库模式定义
├── src/
│   ├── app/                   # Next.js 14 App Router 页面与路由
│   ├── components/            # UI 组件库
│   ├── lib/                   # 认证、加密与工具函数
│   └── styles/                # 全局样式
├── .env.example               # 环境变量配置示例
├── next.config.js             # Next.js 配置
├── package.json               # 项目依赖与构建命令
├── tailwind.config.ts         # Tailwind CSS 配置
└── README.md                  # 说明文档
```

## 许可证

基于 [MIT License](./LICENSE) 协议开源。
