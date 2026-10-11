# Admin Console

React 19 管理后台脚手架：登录 / 注册、仪表盘、用户管理。

## 技术栈

- React 19 + TypeScript + Vite + pnpm
- Tailwind CSS v4 + shadcn/ui
- Zustand（会话 / UI）+ TanStack Query（服务端状态）
- React Router v7
- Vitest + Playwright
- MSW（开发期 API Mock）

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173

### 演示账号

| 角色 | 邮箱 | 密码 |
| --- | --- | --- |
| 管理员 | admin@example.com | admin123 |
| 普通用户 | user@example.com | user1234 |

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 类型检查 + 生产构建
pnpm typecheck    # 仅类型检查
pnpm test         # Vitest 单元测试
pnpm test:e2e     # Playwright 端到端
pnpm lint         # oxlint
```

## 目录结构

```text
src/
  app/           # providers、router、布局、路由守卫
  pages/         # 页面
  features/      # auth、users 业务域
  components/ui/ # shadcn 组件
  lib/           # api-client、query-client、utils
  stores/        # Zustand
  mocks/         # MSW handlers
  test/          # Vitest setup
e2e/             # Playwright
```

## 对接真实后端

1. 在 `.env` 中设置：

```env
VITE_API_BASE_URL=https://your-api.example.com/api
VITE_ENABLE_MSW=false
```

2. 保持 `features/*/api.ts` 的路径约定，或按后端契约调整。

## 环境变量

见 [.env.example](./.env.example)。
