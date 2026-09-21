# Agent Skills 学习中心

把 [agentskills.io](https://agentskills.io) 全部 9 篇官方文档整理成**可精读、可练习、可自检**的中文学习平台：每节保留英文原文摘录 + 中文精读笔记 + 原文代码示例，并内建题库、错题本、格式校验器与实践自检清单。

> Agent Skills 是 Anthropic 发起、现为开放标准的「用文件夹 + `SKILL.md` 给 AI Agent 扩展能力」的规范。本项目面向中文学习者，把这套规范从「读文档」升级为「学 - 练 - 测 - 追踪」的闭环。

![学习总览看板](docs/images/overview.png)

## 功能

- **文档精读**：9 篇官方文档逐节拆解，中英对照、代码块可复制、小节勾选进度、断点续读（`/docs`）
- **刻意练习**：约 75 道选择题，按文档或全站混合出题，答完即时判分与解析，记录历史成绩（`/quiz`）
- **错题本**：自动汇总答错过的题目，按错误次数加权出题重练（`/review`）
- **格式校验器**：在浏览器里校验 `SKILL.md` frontmatter 是否符合规范（`/spec`）
- **客户端实现五步**：给 Agent 产品加 Skills 支持的生命周期拆解，含目标与常见坑（`/lifecycle`）
- **术语表 / 客户端清单 / 实践自检清单**（`/glossary`、`/clients`、`/checklist`）
- **全文搜索**：跨章节、代码、术语、客户端四类内容检索（`/search`）
- **学习笔记**：按文档记录自由笔记（`/notes`）
- **学习总览**：总体进度、正确率、按文档构成的可视化看板（`/`）

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16（App Router）+ React 19 + TypeScript |
| 样式 | Tailwind CSS 4 |
| 数据 | PostgreSQL + Drizzle ORM |
| 内容 | 官方文档整理为结构化数据，存于 `src/data/`，首次访问自动灌库 |

## 快速开始

### 前置条件

- Node.js 20 或更高（开发使用 v22）
- 一个可用的 PostgreSQL 数据库（本地或云端均可）

> **数据库必须处于运行状态**，否则 `db:push` 和页面访问都会报连接错误。确认方式：
>
> - **Windows（安装器安装）**：PostgreSQL 默认注册为系统服务、开机自启，一般无需操心；可用 `Get-Service *postgres*` 检查，显示 `Running` 即可，未运行则 `Start-Service <服务名>`。
> - **Windows（手动解压安装）**：需要手动启动，如 `pg_ctl -D <数据目录> start`。
> - **macOS（Homebrew）**：`brew services start postgresql`。
> - **不想装本地数据库**：可以用 [Neon](https://neon.tech)、[Supabase](https://supabase.com) 等免费云端 PostgreSQL，直接拿连接串填进 `.env` 即可，跳过本节的启动问题。

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 配置数据库连接串
cp .env.example .env        # Windows: copy .env.example .env
# 编辑 .env，把 DATABASE_URL 改成你的 PostgreSQL 连接串

# 3. 建表（按 src/db/schema.ts 自动创建全部数据表）
#    如果连不上数据库会在这一步报错，请回到上方「前置条件」确认数据库已启动
npm run db:push

# 4. 启动开发服务器
npm run dev
```

打开 <http://localhost:3000> 即可。**内容会在首次访问时自动灌入数据库**，无需手动初始化；学习进度、笔记、测验成绩会实时保存。

**停止方式**：开发服务器在终端按 `Ctrl + C` 即可；数据库通常无需手动停止（系统服务随系统管理）。

### 常用脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` / `npm start` | 生产构建 / 启动 |
| `npm run db:push` | 按 schema 同步建表（首次必跑） |
| `npm run db:generate` | 生成迁移文件 |
| `npm run db:studio` | 打开 Drizzle Studio 可视化查库 |
| `npm run lint` / `npm run typecheck` | 代码检查 / 类型检查 |

### 环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `DATABASE_URL` | 是 | PostgreSQL 连接串，如 `postgresql://postgres:密码@127.0.0.1:5432/app_db` |

## 内容更新流程

文档内容集中在 `src/data/*.ts`（`docs-foundations` / `docs-authoring-a` / `docs-authoring-b` / `docs-implementation` 四组），题库与术语在 `src/data/study.ts`，规范字段与清单在 `src/data/reference.ts`。

更新内容的步骤：

1. 编辑对应 `src/data/*.ts` 文件；
2. **把 `src/db/seed.ts` 里的 `SEED_VERSION` 改为新值**（例如日期版本号）；
3. 重启后首次访问会自动重灌内容表。

> 重新灌库只清理内容表，**不会动**你的学习进度、笔记和测验成绩（它们在独立的用户状态表里）。

## 目录结构

```
src/
├── app/                 # 路由与页面（App Router）
│   ├── page.tsx         # 学习总览看板
│   ├── docs/            # 文档精读（列表 + 详情）
│   ├── quiz/ review/    # 刻意练习 / 错题本
│   ├── spec/ lifecycle/ glossary/ clients/ checklist/ notes/ search/
│   ├── api/             # health / seed / progress / notes / quiz 接口
│   ├── loading.tsx error.tsx not-found.tsx
├── components/          # DocReader / QuizRunner / SpecValidator / TopNav 等
├── data/                # 全部学习内容（结构化种子数据）
├── db/                  # schema.ts / index.ts / seed.ts
└── lib/                 # queries.ts（数据访问） / validate.ts
```

## 二次开发指南

| 想改什么 | 改哪里 |
|---|---|
| 文案、标题、导航 | `src/components/TopNav.tsx`、各 `src/app/*/page.tsx` |
| 学习内容、题库、术语 | `src/data/*.ts`（改完记得 bump `SEED_VERSION`） |
| 配色、圆角、字号 | 全局在 `src/app/globals.css` 与各组件 className；Tailwind 主题 token 见 `postcss.config.mjs` |
| 页面结构 / 路由 | `src/app/` 下对应目录 |
| 数据表结构 | `src/db/schema.ts`（改后跑 `npm run db:push`） |
| 数据查询逻辑 | `src/lib/queries.ts` |
| 数据库连接 | `.env` 的 `DATABASE_URL` |

## 部署

本项目是标准 Next.js 应用，可部署到 Vercel、自建 Node 服务器或任意支持 Next.js 的平台。部署时配置环境变量 `DATABASE_URL` 指向你的 PostgreSQL，并在首次部署后执行一次 `npm run db:push` 建表。

## 内容来源与许可

- 文档内容整理自 [agentskills.io](https://agentskills.io) 官方文档（原文许可 CC-BY-4.0），中文笔记与题库为本项目整理；
- 规范原文与参考实现见 GitHub 仓库 [agentskills/agentskills](https://github.com/agentskills/agentskills)；
- 本项目代码采用 MIT 许可。

## 免责声明

本项目为非官方中文学习工具，与 agentskills.io 官方无隶属关系。规范条文以官方原文为准。
