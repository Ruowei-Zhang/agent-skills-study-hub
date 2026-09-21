import type { DocSeed } from "./types";

export const foundationDocs: DocSeed[] = [
  {
    slug: "overview",
    titleZh: "概览：什么是 Agent Skills",
    titleEn: "Agent Skills Overview",
    groupKey: "foundations",
    groupZh: "基础与规范",
    orderIndex: 1,
    sourceUrl: "https://agentskills.io/home",
    summaryZh:
      "Agent Skills 是一套轻量、开放、可版本控制的技能格式：一个目录 + 一个 SKILL.md，就能把专门知识、工作流和脚本交给任何兼容的 agent 按需加载。",
    difficulty: "入门",
    readMinutes: 8,
    keyPoints: [
      "技能的最小形态是「一个目录 + 一个 SKILL.md」文件，不需要运行时、SDK 或注册服务。",
      "SKILL.md 由 YAML frontmatter（至少 name、description）与 Markdown 指令正文组成。",
      "三级渐进式披露：元数据 → 指令 → 资源，让 agent 同时持有大量技能却只付出很小的上下文成本。",
      "技能是可移植的：写一次，可在 Claude Code、Cursor、VS Code、Gemini CLI 等数十个客户端复用。",
      "格式由 Anthropic 最初开发并作为开放标准发布，现由生态共同演进。",
    ],
    tags: ["入门", "核心概念", "渐进式披露"],
    sections: [
      {
        anchor: "what",
        headingZh: "什么是 Agent Skills",
        headingEn: "What are Agent Skills?",
        contentZh:
          "Agent Skills 是一套**轻量、开放**的格式，用来给 AI agent 扩展专门的知识与工作流。它刻意避免了复杂的协议与运行时：一个技能就是一个文件夹，里面至少包含一个 [[SKILL.md]] 文件。\n\n这个文件里有两部分：\n\n- **YAML frontmatter**：至少包含 [[name]] 与 [[description]] 两个元数据字段；\n- **Markdown 正文**：告诉 agent 如何执行某类具体任务的指令。\n\n技能还可以顺带打包脚本、参考资料、模板和其他资源，让 agent 在需要时执行或加载。换句话说，技能是「把隐性经验变成可分发资产」的最小容器。",
        contentEn:
          "Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows. At its core, a skill is a folder containing a SKILL.md file. This file includes metadata (name and description, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, reference materials, templates, and other resources.",
      },
      {
        anchor: "why",
        headingZh: "为什么要用 Agent Skills",
        headingEn: "Why Agent Skills?",
        contentZh:
          "模型的通用能力在快速提升，但它**缺少完成真实工作所需的上下文**：你们团队的流程、你们系统的边界情况、你们数据管道的约定。技能把这部分「程序性知识」与「组织/团队/个人上下文」封装成可移植、可版本控制的文件夹，由 agent 按需加载。\n\n它带来三类价值：\n\n- **领域专长**：把法律审阅流程、数据分析管道、汇报文档格式等专有知识固化成可复用的指令与资源；\n- **可重复的工作流**：把多步骤任务变成一致、可审计、可评审的流程；\n- **跨产品复用**：写一次，在任意兼容技能格式的 agent 中复用。",
        contentEn:
          "Agents are increasingly capable, but often don't have the context they need to do real work reliably. Skills solve this by packaging procedural knowledge and company-, team-, and user-specific context into portable, version-controlled folders that agents load on demand.",
      },
      {
        anchor: "how",
        headingZh: "工作原理：三阶段渐进式披露",
        headingEn: "How do Agent Skills work?",
        contentZh:
          "Agent 通过**渐进式披露（progressive disclosure）**分三个阶段加载技能：\n\n1. **发现（Discovery）**：会话启动时，agent 只加载每个技能的 [[name]] 与 [[description]]，刚好够判断「这个技能可不可能相关」；\n2. **激活（Activation）**：当任务与某个技能的描述匹配时，agent 把完整的 SKILL.md 指令读进上下文；\n3. **执行（Execution）**：agent 按指令执行任务，必要时运行随包脚本，或按引用加载其他文件。\n\n关键收益是上下文经济：完整指令只在真正需要时才载入，因此可以同时挂载几十个技能，而只付出一个很小的基础上下文开销。另外要记住一个细节——**agent 只在任务超出自身能力或需要专门知识时才去查技能**，所以描述写得好不好，直接决定技能会不会被用上。",
        contentEn:
          "1. Discovery: At startup, agents load only the name and description of each available skill. 2. Activation: When a task matches a skill's description, the agent reads the full SKILL.md instructions into context. 3. Execution: The agent follows the instructions, optionally executing bundled code or loading referenced files as needed.",
      },
      {
        anchor: "where",
        headingZh: "可以在哪里使用",
        headingEn: "Where can I use Agent Skills?",
        contentZh:
          "Agent Skills 已被大量 AI 工具与智能体客户端支持：终端型 CLI（Claude Code、Gemini CLI、OpenCode、Goose…）、编辑器型（VS Code、Cursor、Kiro、Tabnine…）、平台型（ChatGPT & Codex、Claude、OpenHands、Databricks Genie Code…），以及框架层的 Spring AI、Laravel Boost 等。\n\n本学习中心的「客户端清单」页面收录了文档中的全部 46 个产品，并标注了各自的官方技能文档地址，方便你验证某个客户端的具体加载路径与开关。",
        contentEn:
          "Agent Skills are supported by a large number of AI tools and agentic clients — see the Client Showcase to explore some of them!",
      },
      {
        anchor: "open",
        headingZh: "开放开发与社区",
        headingEn: "Open development",
        contentZh:
          "该格式最初由 **Anthropic** 开发，随后作为开放标准发布，并被越来越多的 agent 产品采纳。标准对生态贡献开放：\n\n- GitHub 仓库：[[github.com/agentskills/agentskills]]（包含规范源码、参考实现 skills-ref、示例）；\n- 官方 Discord：用于讨论与公告；\n- 文档本身也开源（Mintlify 站点，内容为 MDX），欢迎以 PR 方式修正与补充。",
        contentEn:
          "The Agent Skills format was originally developed by Anthropic, released as an open standard, and has been adopted by a growing number of agent products. The standard is open to contributions from the broader ecosystem.",
      },
      {
        anchor: "get-started",
        headingZh: "上手路径与学习地图",
        headingEn: "Get started",
        contentZh:
          "推荐按三种角色来组织学习顺序：\n\n- **技能创作者**：快速开始 → 最佳实践 → 优化描述 → 评估输出质量 → 使用脚本；\n- **客户端实现者**：规范 → 为你的 Agent 添加技能支持（发现 / 解析 / 披露 / 激活 / 上下文管理五步）；\n- **评估者/技术负责人**：概览 → 规范 → 最佳实践的「节约上下文」与「校准控制力」两节 → 评估方法论。\n\n学完之后，本站在首页给出进度面板、在「刻意练习」中提供题库，在「格式校验器」中提供按规范实现的自动检查。",
        contentEn:
          "Next steps: Best practices — How to write skills that are well-scoped and effective. Optimizing skill descriptions — Test and improve your skill's description. Specification — The complete format reference for SKILL.md files.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "what",
        title: "技能的标准目录形态",
        lang: "text",
        code: `skill-name/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories`,
        noteZh: "除 SKILL.md 外的所有内容都是可选的；scripts/、references/、assets/ 只是约定，不是强制。",
      },
      {
        sectionAnchor: "what",
        title: "最小可用技能（两份常见写法）",
        lang: "markdown",
        code: `---
name: skill-name
description: A description of what this skill does and when to use it.
---

---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---`,
        noteZh: "上面是最小骨架，下面是带可选字段的真实技能；frontmatter 之后才是指令正文。",
      },
    ],
  },
  {
    slug: "specification",
    titleZh: "格式规范：SKILL.md 完整参考",
    titleEn: "Specification",
    groupKey: "foundations",
    groupZh: "基础与规范",
    orderIndex: 2,
    sourceUrl: "https://agentskills.io/specification",
    summaryZh:
      "Agent Skills 的完整格式定义：目录结构、frontmatter 六个字段的约束、可选目录约定、渐进式披露的 token 预算、文件引用规则与校验方式。",
    difficulty: "进阶",
    readMinutes: 16,
    keyPoints: [
      "必填字段只有 name 与 description，其余四个（license、compatibility、metadata、allowed-tools）均为可选。",
      "name 必须是 1-64 字符的小写字母/数字/连字符，不能以连字符开头或结尾，不能有连续连字符，且必须与父目录同名。",
      "description 上限 1024 字符，要同时说明「做什么」和「什么时候用」，并包含便于检索的关键词。",
      "SKILL.md 建议控制在 500 行 / 5000 token 以内，细节拆到 references/ 里按需加载。",
      "引用文件用相对于技能根目录的相对路径，且保持一层深度，避免深层引用链。",
      "用 skills-ref 参考库做机械校验：skills-ref validate ./my-skill。",
    ],
    tags: ["规范", "frontmatter", "命名规则", "校验"],
    sections: [
      {
        anchor: "directory-structure",
        headingZh: "目录结构",
        headingEn: "Directory structure",
        contentZh:
          "一个技能就是一个目录，**最低要求**是其中存在 SKILL.md。除此之外目录内的一切都是自由的：脚本、参考资料、资产、子目录都行。规范只定义「目录里面长什么样」，并不规定技能该放在哪里——**放在哪里由客户端决定**（例如 VS Code 默认扫描 [[.agents/skills/]]）。",
        contentEn:
          "A skill is a directory containing, at minimum, a SKILL.md file. A skill directory may contain any files and directories beyond the required SKILL.md.",
      },
      {
        anchor: "frontmatter",
        headingZh: "SKILL.md 的 frontmatter 总览",
        headingEn: "Frontmatter",
        contentZh:
          "SKILL.md 必须是「YAML frontmatter + Markdown 正文」的结构。frontmatter 用 [[---]] 分隔，字段与约束如下：\n\n- [[name]]（必填）：≤64 字符，小写字母/数字/连字符，首尾不能是连字符；\n- [[description]]（必填）：≤1024 字符，非空，说明做什么 + 何时使用；\n- [[license]]（可选）：许可证名称，或指向随包许可文件；\n- [[compatibility]]（可选）：≤500 字符，声明环境要求（目标产品、系统依赖、网络访问等）；\n- [[metadata]]（可选）：字符串键值映射，用来存放规范未定义的扩展属性；\n- [[allowed-tools]]（可选，实验性）：空格分隔的预授权工具列表。\n\n「格式校验器」页面把这套约束实现成了可交互的检查器，改完字段可以立刻看到违反哪一条。",
        contentEn:
          "The SKILL.md file must contain YAML frontmatter followed by Markdown content. name and description are required; license, compatibility, metadata and allowed-tools are optional.",
      },
      {
        anchor: "name",
        headingZh: "name 字段",
        headingEn: "name field",
        contentZh:
          "[[name]] 是技能的唯一标识，也是客户端做目录映射与激活查找时用的键：\n\n- 长度 1-64 字符；\n- 只允许 Unicode 小写字母数字（a-z、0-9）与连字符（-）；\n- 不能以连字符开头或结尾；\n- 不能出现连续连字符（--）；\n- **必须与父目录名一致**。\n\n最后一条最容易被忽略：如果把目录重命名了却忘了改 frontmatter，多数客户端会给出警告并仍尝试加载（宽松校验），但另一些会把技能列为无效。",
        contentEn:
          "Must be 1-64 characters. May only contain unicode lowercase alphanumeric characters and hyphens. Must not start or end with a hyphen. Must not contain consecutive hyphens. Must match the parent directory name.",
      },
      {
        anchor: "description",
        headingZh: "description 字段",
        headingEn: "description field",
        contentZh:
          "[[description]] 是整个规范里**对效果影响最大**的字段，因为它承担了全部触发职责（元数据阶段只会加载 name 与 description）：\n\n- 长度 1-1024 字符，必须非空；\n- 要同时说明 skill 做什么、什么时候用；\n- 尽量包含能让 agent 匹配到相关任务的具体关键词。\n\n反面示例是 [[Helps with PDFs.]]——它既没说明能力边界，也没给出触发信号。'优化技能描述' 一文给出了系统化的改写与测量方法（触发率 + 训练/验证集切分）。",
        contentEn:
          "Must be 1-1024 characters. Should describe both what the skill does and when to use it. Should include specific keywords that help agents identify relevant tasks.",
      },
      {
        anchor: "license",
        headingZh: "license 字段",
        headingEn: "license field",
        contentZh:
          "[[license]] 声明技能适用的许可。规范建议**保持简短**：要么是许可证名称（如 [[Apache-2.0]]、[[MIT]]），要么是指向随包许可文件的说明（如 [[Proprietary. LICENSE.txt has complete terms]]）。它不参与技能加载决策，主要是给人和合规流程看的元数据。",
        contentEn:
          "Specifies the license applied to the skill. We recommend keeping it short (either the name of a license or the name of a bundled license file).",
      },
      {
        anchor: "compatibility",
        headingZh: "compatibility 字段",
        headingEn: "compatibility field",
        contentZh:
          "[[compatibility]] 用来表达**环境前提**，例如目标产品、必须的 CLI/系统包、是否需要访问网络：\n\n- 提供时长度 1-500 字符；\n- 只在技能确实有特殊环境要求时才写。\n\n规范明确提示：**大多数技能并不需要这个字段。** 写它的收益是让 agent 在激活前就知道环境是否满足；滥用则会让每个技能的元数据变重。若只是运行时版本要求（Node 18+、Python 3.14+），也可写进正文，但用 compatibility 更利于客户端提前判断。",
        contentEn:
          "Must be 1-500 characters if provided. Should only be included if your skill has specific environment requirements. Most skills do not need the compatibility field.",
      },
      {
        anchor: "metadata",
        headingZh: "metadata 字段",
        headingEn: "metadata field",
        contentZh:
          "[[metadata]] 是**字符串键 → 字符串值**的映射，用于存放规范之外的属性（作者、版本、内部编号、审计信息…）。规范提醒：键名尽量取得独特一些，避免不同实现之间意外冲突；客户端可以自由使用这里的内容，但不应把它当作触发依据。",
        contentEn:
          "Arbitrary key-value mapping for additional metadata (a map from string keys to string values). We recommend making your key names reasonably unique to avoid accidental conflicts.",
      },
      {
        anchor: "allowed-tools",
        headingZh: "allowed-tools 字段",
        headingEn: "allowed-tools field",
        contentZh:
          "[[allowed-tools]] 是空格分隔的**预授权工具**字符串，表示这个技能运行时会用到哪些工具，客户端可以据此减少逐次确认。\n\n它被明确标注为**实验性**：不同 agent 实现的支持程度差异较大，有的完全忽略，有的会把它与自身权限模型做映射。比较典型的写法是 [[Bash(git:*) Bash(jq:*) Read]]——即允许特定命令前缀的 shell 调用与文件读取。",
        contentEn:
          "A space-separated string of tools that are pre-approved to run. Experimental. Support for this field may vary between agent implementations.",
      },
      {
        anchor: "body",
        headingZh: "正文内容",
        headingEn: "Body content",
        contentZh:
          "frontmatter 之后的 Markdown 就是**指令正文**，规范对它没有任何格式限制。推荐的组成是：\n\n- 分步操作说明；\n- 输入/输出示例；\n- 常见边界情况。\n\n要记住：技能一旦被激活，agent 会**整篇加载**这个文件。所以正文应该只保留下每次运行都需要的核心指令，长内容拆到被引用的文件里。",
        contentEn:
          "There are no format restrictions. Recommended sections: step-by-step instructions, examples of inputs and outputs, common edge cases. Note that the agent will load this entire file once it's decided to activate a skill.",
      },
      {
        anchor: "optional-directories",
        headingZh: "可选目录：scripts / references / assets",
        headingEn: "Optional directories",
        contentZh:
          "规范给出三类约定目录，用于组织常见内容：\n\n- [[scripts/]]：agent 可以执行的代码。脚本应自包含或清楚声明依赖、给出有用的错误信息、优雅处理边界情况；语言支持取决于客户端（Python、Bash、JavaScript 最常见）。\n- [[references/]]：按需阅读的补充文档，例如 [[REFERENCE.md]]（详细技术参考）、[[FORMS.md]]（表单/结构化格式），以及按领域拆分的文件（[[finance.md]]、[[legal.md]]）。\n- [[assets/]]：静态资源，例如文档/配置模板、示意图、查找表与 schema。\n\n参考资料要保持「小而聚焦」：agent 是按需加载的，文件越小，消耗的上下文越少。",
        contentEn:
          "scripts/ contains executable code that agents can run. references/ contains additional documentation that agents can read when needed. assets/ contains static resources: templates, images, data files.",
      },
      {
        anchor: "progressive-disclosure",
        headingZh: "渐进式披露与上下文预算",
        headingEn: "Progressive disclosure",
        contentZh:
          "技能应被设计成**分层加载**，让成本随需要增长：\n\n1. **元数据（约 100 token）**：所有技能的 name + description 在启动时加载；\n2. **指令（建议 < 5000 token）**：技能被激活时加载 SKILL.md 正文；\n3. **资源（按需）**：scripts/、references/、assets/ 中的文件只在被引用时才读取。\n\n据此得出两条硬性工程建议：主 SKILL.md **控制在 500 行以内**，把详细参考资料搬到单独文件；并且要明确告诉 agent「什么时候去读哪个文件」——「API 返回非 200 时读 references/api-errors.md」远好于笼统的「详见 references/」。",
        contentEn:
          "1. Metadata (~100 tokens): name and description loaded at startup for all skills. 2. Instructions (< 5000 tokens recommended): full SKILL.md body loaded when activated. 3. Resources (as needed): files in scripts/, references/, or assets/ loaded only when required. Keep your main SKILL.md under 500 lines.",
      },
      {
        anchor: "file-references",
        headingZh: "文件引用规则",
        headingEn: "File references",
        contentZh:
          "在技能内部引用其他文件时，**使用相对于技能根目录的相对路径**，例如 [[references/REFERENCE.md]] 或 [[scripts/extract.py]]。客户端会在加载时把相对路径解析成实际位置。\n\n规范同时给出结构建议：**保持引用一层深度**（SKILL.md → 资源文件），避免「引用文档再引用文档」的深层链条，否则 agent 很难判断该加载什么，也很容易加载过量内容。",
        contentEn:
          "When referencing other files in your skill, use relative paths from the skill root. Keep file references one level deep from SKILL.md. Avoid deeply nested reference chains.",
      },
      {
        anchor: "validation",
        headingZh: "校验",
        headingEn: "Validation",
        contentZh:
          "动手写技能后，建议用官方参考库做机械校验：[[skills-ref validate ./my-skill]]。它会检查 SKILL.md 的 frontmatter 是否能解析、命名是否符合约定、必填字段是否存在等。\n\n把这一步放进 CI 或 pre-commit 是常见做法，因为命名与长度类错误一旦进入仓库，往往会以「技能静默不触发」的形式表现出来，很难排查。本学习中心的「格式校验器」实现了同一套规则的浏览器版，用于快速自检。",
        contentEn:
          "Use the skills-ref reference library to validate your skills: skills-ref validate ./my-skill. This checks that your SKILL.md frontmatter is valid and follows all naming conventions.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "frontmatter",
        title: "最小示例与带可选字段的示例",
        lang: "markdown",
        code: `---
name: skill-name
description: A description of what this skill does and when to use it.
---

---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
---`,
        noteZh: "两份 frontmatter 对照：先记住最小必备，再按需加可选字段。",
      },
      {
        sectionAnchor: "name",
        title: "name 的合法与非法写法",
        lang: "yaml",
        code: `# 合法
name: pdf-processing
name: data-analysis
name: code-review

# 非法
name: PDF-Processing   # 不允许大写
name: -pdf             # 不能以连字符开头
name: pdf--processing  # 不允许连续连字符`,
        noteZh: "命名错误是最常见的规范违反点，值得单独跑一遍校验。",
      },
      {
        sectionAnchor: "description",
        title: "好的描述 vs 差的描述",
        lang: "yaml",
        code: `# 好
description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.

# 差
description: Helps with PDFs.`,
        noteZh: "「做什么 + 何时用 + 关键触发词」三要素齐全才算合格。",
      },
      {
        sectionAnchor: "compatibility",
        title: "compatibility 的典型取值",
        lang: "yaml",
        code: `compatibility: Designed for Claude Code (or similar products)
compatibility: Requires git, docker, jq, and access to the internet
compatibility: Requires Python 3.14+ and uv`,
        noteZh: "只在有真实环境依赖时才写；大多数技能不需要这个字段。",
      },
      {
        sectionAnchor: "metadata",
        title: "metadata 与 allowed-tools 示例",
        lang: "yaml",
        code: `metadata:
  author: example-org
  version: "1.0"

allowed-tools: Bash(git:*) Bash(jq:*) Read`,
        noteZh: "metadata 只放字符串键值；allowed-tools 仍处于实验阶段。",
      },
      {
        sectionAnchor: "file-references",
        title: "相对路径引用",
        lang: "markdown",
        code: `See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py`,
        noteZh: "路径相对于技能根目录，保持一层深度。",
      },
      {
        sectionAnchor: "validation",
        title: "用参考库校验技能",
        lang: "bash",
        code: `skills-ref validate ./my-skill`,
        noteZh: "skills-ref 是官方参考实现，包含校验器与分析工具。",
      },
    ],
  },
  {
    slug: "clients",
    titleZh: "客户端支持清单与选型",
    titleEn: "Client Showcase",
    groupKey: "foundations",
    groupZh: "基础与规范",
    orderIndex: 3,
    sourceUrl: "https://agentskills.io/clients",
    summaryZh:
      "官方列出的 46 个支持 Agent Skills 的产品：从终端 CLI、编辑器到企业平台与框架层，构成「写一次、到处可用」的可移植性证据。",
    difficulty: "入门",
    readMinutes: 6,
    keyPoints: [
      "支持面覆盖 5 类：终端 CLI（17）、平台/云端（13）、编辑器/IDE（8）、编码智能体（4）、框架/库（4）。",
      "文档只展示产品列表与描述，各客户端的加载路径、开关、权限模型需要查各自的官方技能文档。",
      "常见互操作约定是 .agents/skills/，被 VS Code 等客户端默认扫描，也是实现者推荐的兼容目标。",
      "清单的可移植性意义：同一个技能不需要为不同产品重写，只需要保证 SKILL.md 规范合规。",
      "选择客户端时优先考虑：技能目录位置是否可配、是否有权限确认、能否观测到技能激活。",
    ],
    tags: ["生态", "选型", "互操作"],
    sections: [
      {
        anchor: "coverage",
        headingZh: "生态覆盖范围",
        headingEn: "Coverage",
        contentZh:
          "官方展示页列出的是**产品级**支持，而不是「能用提示词模拟」的近似方案。按部署形态大致分为五类：\n\n- **终端 CLI**：Claude Code、Gemini CLI、OpenCode、Goose、Amp、Factory、OpenClaw…；\n- **编辑器 / IDE**：VS Code、Cursor、Junie、Kiro、Tabnine、TRAE…；\n- **平台 / 云端**：Claude、ChatGPT & Codex、OpenHands、Databricks Genie Code、Snowflake Cortex Code、Letta…；\n- **编码智能体**：Firebender、Agentman、bub、Workshop 等；\n- **框架 / 库**：Spring AI（Java）、Laravel Boost（PHP）、fast-agent（Python agent 框架）。\n\n数量本身就是标准的价值证明：它说明技能格式已经越过「单一厂商特性」的阶段。",
        contentEn:
          "Agent products that support the Agent Skills format. The showcase lists dozens of clients across terminal CLIs, editors/IDEs, hosted platforms and frameworks.",
      },
      {
        anchor: "choosing",
        headingZh: "如何选型与验证",
        headingEn: "Choosing a client",
        contentZh:
          "文档本身不比较功能，但结合规范可以列出一份自检清单：\n\n- **技能目录是否可配**：项目级/用户级路径是什么，是否兼容 [[.agents/skills/]]；\n- **激活是否可观测**：能否看到「哪个技能被加载」的日志或工具调用记录（优化描述与做评估时必需）；\n- **权限模型**：技能内脚本执行时是否需要逐次确认，是否支持 allowed-tools 白名单；\n- **资源读取**：技能目录是否被加入权限白名单，避免每次读 [[scripts/]] 都弹确认框；\n- **上下文管理**：压缩/裁剪时是否保护技能内容不被丢掉。\n\n后两条属于「实现质量」范畴，具体见『为你的 Agent 添加技能支持』。",
        contentEn:
          "Which directories you scan depends on your agent's environment. Most locally-running agents scan at least two scopes: project-level and user-level. Within each scope, consider scanning both a client-specific directory and the .agents/skills/ convention.",
      },
      {
        anchor: "interop",
        headingZh: "互操作约定：.agents/skills/",
        headingEn: "Interoperability",
        contentZh:
          "规范**不规定**技能目录放在哪里，但在实践中 [[.agents/skills/]] 已成为跨客户端共享的通用约定：\n\n- [[<project>/.agents/skills/]]：随仓库分发的项目级技能；\n- [[~/.agents/skills/]]：用户级技能，作用于该用户的所有项目。\n\n对技能创作者的意义是：把技能放进 [[.agents/skills/]] 并提交到仓库，就能让多个兼容客户端自动发现它，无需为每个产品单独配置。对企业团队则是「技能即代码」：与项目一起评审、一起版本化。",
        contentEn:
          "The .agents/skills/ paths have emerged as a widely-adopted convention for cross-client skill sharing. Scanning .agents/skills/ means skills installed by other compliant clients are automatically visible to yours, and vice versa.",
      },
      {
        anchor: "use-list",
        headingZh: "如何使用本站的客户端清单",
        headingEn: "Using this directory",
        contentZh:
          "本站把官方清单落库为可检索目录（[[客户端清单]] 页面），包含产品名称、官网、**官方技能文档链接**、开源仓库链接与分类标签。\n\n典型用法：\n\n- 想知道「我正在用的工具到底怎么加载技能」→ 直接点开它的技能文档；\n- 想知道「有没有开源实现可以参考」→ 筛选出带源码链接的产品（如 OpenHands、OpenCode、Gemini CLI、Goose）；\n- 想知道「某个生态（Java/PHP/数据平台）怎么接技能」→ 看框架/库与平台类。",
        contentEn:
          "Explore the client showcase to find the products that support Agent Skills, then follow each product's own documentation for loading paths and configuration.",
      },
    ],
    snippets: [],
  },
];
