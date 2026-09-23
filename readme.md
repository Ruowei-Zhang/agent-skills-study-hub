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
| 内容 | 官方文档整理为结构化静态数据，存于 `src/data/`，构建期直接渲染 |
| 状态 | 阅读进度 / 笔记 / 测验记录保存在浏览器 localStorage，无需数据库与账号 |

> 架构说明：本项目**没有数据库**。学习内容全部是静态数据；个人学习状态属于单个访客，存在本机浏览器里最合适——这也让部署变成零配置，且每位访客的数据彼此独立。

## 快速开始

### 前置条件

- Node.js 20 或更高（开发使用 v22）

### 步骤

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

打开 <http://localhost:3000> 即可。无需数据库、无需环境变量；学习进度、笔记、测验成绩会自动保存在浏览器本地。

**停止方式**：开发服务器在终端按 `Ctrl + C` 即可。

### 常用脚本

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` / `npm start` | 生产构建 / 启动 |
| `npm run lint` / `npm run typecheck` | 代码检查 / 类型检查 |

## 内容更新流程

文档内容集中在 `src/data/*.ts`（`docs-foundations` / `docs-authoring-a` / `docs-authoring-b` / `docs-implementation` 四组），题库与术语在 `src/data/study.ts`，规范字段与清单在 `src/data/reference.ts`。

更新内容只需：编辑对应 `src/data/*.ts` 文件，然后重新构建部署。内容变更**不会影响**访客已保存的学习进度、笔记和测验成绩（它们在各自浏览器的 localStorage 里）。

## 目录结构

```
src/
├── app/                 # 路由与页面（App Router）
│   ├── page.tsx         # 学习总览看板
│   ├── docs/            # 文档精读（列表 + 详情）
│   ├── quiz/ review/    # 刻意练习 / 错题本
│   ├── spec/ lifecycle/ glossary/ clients/ checklist/ notes/ search/
│   ├── loading.tsx error.tsx not-found.tsx
├── components/          # DocReader / QuizRunner / SpecValidator / TopNav 等
├── data/                # 全部学习内容（结构化静态数据）
└── lib/                 # content.ts（静态内容访问） / store.ts（localStorage 学习状态）
```

## 二次开发指南

| 想改什么 | 改哪里 |
|---|---|
| 文案、标题、导航 | `src/components/TopNav.tsx`、各 `src/app/*/page.tsx` |
| 学习内容、题库、术语 | `src/data/*.ts`（改完重新构建即可） |
| 配色、圆角、字号 | 全局在 `src/app/globals.css` 与各组件 className；Tailwind 主题 token 见 `postcss.config.mjs` |
| 页面结构 / 路由 | `src/app/` 下对应目录 |
| 内容查询与搜索逻辑 | `src/lib/content.ts` |
| 进度 / 笔记 / 成绩的存储逻辑 | `src/lib/store.ts`（localStorage） |

## 部署

本项目是零配置的标准 Next.js 应用（无数据库、无环境变量），可部署到 Vercel、自建 Node 服务器或任意支持 Next.js 的平台。以 Vercel 为例：导入 GitHub 仓库后直接点 Deploy 即可，之后每次 push 到 main 都会自动重新部署。

## 内容来源与许可

- 文档内容整理自 [agentskills.io](https://agentskills.io) 官方文档（原文许可 CC-BY-4.0），中文笔记与题库为本项目整理；
- 规范原文与参考实现见 GitHub 仓库 [agentskills/agentskills](https://github.com/agentskills/agentskills)；
- 本项目代码采用 MIT 许可。

## 免责声明

本项目为非官方中文学习工具，与 agentskills.io 官方无隶属关系。规范条文以官方原文为准。
