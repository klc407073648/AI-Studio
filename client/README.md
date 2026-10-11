# Admin Console（AI-Studio Client）

React 19 管理后台：用户与权限、开放 API 广场/管理、全屏命令终端。默认通过 MSW 模拟后端，可切换真实 API。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 19 · TypeScript · Vite · pnpm |
| UI | Tailwind CSS v4 · shadcn/ui · Radix · Lucide |
| 路由 / 状态 | React Router v7 · Zustand · TanStack Query / Table |
| 表单 | React Hook Form · Zod |
| 主题 / 语言 | next-themes · 自研中英 i18n |
| 测试 / Mock | Vitest · Playwright · MSW |

## 快速开始

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173

### 演示账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | `admin@example.com` | `admin123` |
| 普通用户 | `user@example.com` | `user1234` |

终端内独立账号（`user` 命令）：`testadmin` / `12345678`（admin）

## 常用命令

```bash
pnpm dev           # 开发服务器
pnpm build         # 类型检查 + 生产构建
pnpm typecheck     # 仅类型检查
pnpm test          # Vitest 单元测试
pnpm test:e2e      # Playwright 端到端
pnpm test:e2e:ui   # Playwright UI 模式
pnpm lint          # oxlint
pnpm preview       # 预览生产构建
```

首次跑 e2e 需安装浏览器：

```bash
pnpm exec playwright install chromium
```

## 功能概览

### 1. 管理后台壳

- 登录 / 注册、路由守卫（访客 / 登录 / Admin）
- 侧栏导航、面包屑、主题（浅色 / 深色 / 系统）、中英切换
- 全局搜索 ⌘K / Ctrl+K（跳转页、搜用户、搜接口）
- 个人设置：改资料、改密码

### 2. 用户管理（Admin）

- 用户列表、创建 / 编辑、启用禁用等 CRUD（MSW）

### 3. 开放 API（源自 openApi 前端迁移）

| 路由 | 说明 | 权限 |
|------|------|------|
| `/interfaces` | 接口广场（默认已发布） | 登录 |
| `/interfaces/:id` | 详情 + 在线调用 | 登录 |
| `/admin/apis` | 接口管理 + 调用分析 Tab | Admin |

能力：列表分页筛选、CRUD、发布 / 下线、Invoke 调试、TOP 调用排行。

### 4. 模型服务

| 路由 | 说明 |
|------|------|
| `/models` | 选型页（文本 / 图像 / 视频 / 音频 Tab，多选最多 3 个） |
| `/models/playground` | 体验占位页 |

侧栏、Cmd+K、仪表盘均可进入。数据为 MSW 假数据。

### 5. 命令终端（源自 cmd-terminal 迁移）

- 路由：`/terminal`（全屏，不嵌侧栏）
- 侧栏 / Cmd+K / 仪表盘均可进入

命令集分组：

| 分组 | 示例命令 |
|------|----------|
| 管理 | `user` · `version` · `setinfo` |
| 休闲 | `bilibili` · `music` · `hot` · `blog` · `stibel` / `pdai` / `coolshell` |
| 搜索 | `search` · `baidu` · `google` · `github` … |
| 空间 | `pwd` · `ls` · `mkdir` · `cd` · `add` · `rm` · `cp` · `mv` · `goto` |
| 工具 | `todo` · `date` · `timing` · `weather` · `fanyi` · `ping` |
| 终端 | `help` · `clear` · `history` · `hint` · `welcome` · `background` · `reset` · `info` · `shortcut` |
| 日志 | `write_user_log` |

快捷键：↑↓ 历史、Tab 补全、Ctrl+L 清屏、Ctrl+C 等（见终端内 `shortcut`）。

## 路由一览

```text
/login、/register          访客
/                          仪表盘
/interfaces、/interfaces/:id
/models、/models/playground
/users                     Admin
/admin/apis                Admin（列表 + 分析）
/settings                  个人设置
/terminal                  命令终端（全屏）
/403                       无权限
```

## 目录结构

```text
client/
├── e2e/                      # Playwright
├── public/                   # 静态资源、MSW worker
├── src/
│   ├── app/                  # providers、router、layouts、guards
│   ├── pages/                # 页面入口
│   ├── features/
│   │   ├── auth/             # 登录注册、改密
│   │   ├── users/            # 用户管理
│   │   ├── interfaces/       # 开放 API
│   │   ├── models/           # 模型服务选型
│   │   └── terminal/         # 命令终端（core / commands / stores）
│   ├── components/           # 壳组件 + ui（shadcn）
│   ├── stores/               # auth / ui / locale
│   ├── i18n/                 # zh / en
│   ├── mocks/                # MSW handlers + 种子数据
│   ├── lib/                  # api-client、utils
│   ├── types/                # 共享类型
│   └── test/                 # Vitest setup
├── .env.example
└── package.json
```

## API 与 Mock

开发默认开启 MSW（`VITE_ENABLE_MSW=true`）。主要路径：

| 前缀 | 用途 |
|------|------|
| `/api/auth/*` | 登录、注册、资料、改密 |
| `/api/users` | 用户 CRUD |
| `/api/interfaces` | 接口 CRUD / 上下线 / invoke |
| `/api/models` | 模型服务列表 |
| `/api/analysis/*` | 调用 TOP |
| `/api/terminal/*` | 天气、翻译、音乐、背景、日志 |

对接真实后端：

1. 复制 `.env.example` 为 `.env`（若尚未有）
2. 配置：

```env
VITE_API_BASE_URL=https://your-api.example.com/api
VITE_ENABLE_MSW=false
```

3. 保持 `features/*/api.ts` 路径约定，或按后端契约调整。

环境变量说明见 [.env.example](./.env.example)。

## 测试

```bash
pnpm test                 # 单元 / 组件
pnpm test:e2e             # auth、users、terminal 冒烟
```

## 迁移来源（参考）

本仓库前端能力部分迁移自本地学习项目（非本仓库子模块）：

- `openApi` → 接口广场 / 管理 / 分析
- `cmd-terminal` → `/terminal` 命令系统

## 后续可选

- 开放 API 分析页图表（ECharts）
- 终端 / 接口对接真实后端
- 终端 `user` 与后台登录态打通
- 仪表盘 KPI、审计日志等后台增强
