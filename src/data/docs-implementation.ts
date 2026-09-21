import type { DocSeed } from "./types";

export const implementorDocs: DocSeed[] = [
  {
    slug: "adding-skills-support",
    titleZh: "为你的 Agent 添加技能支持",
    titleEn: "How to add skills support to your agent",
    groupKey: "implementors",
    groupZh: "客户端实现者",
    orderIndex: 9,
    sourceUrl: "https://agentskills.io/client-implementation/adding-skills-support",
    summaryZh:
      "客户端实现者的完整生命周期指南：发现技能 → 解析 SKILL.md → 向模型披露目录 → 激活并注入内容 → 在会话内长期维护技能上下文，含信任模型、宽松校验、权限白名单与上下文压缩豁免。",
    difficulty: "深入",
    readMinutes: 24,
    keyPoints: [
      "一切实现都围绕渐进式披露三层的成本结构：目录约 50-100 token/技能、指令 <5000 token、资源按需。",
      "发现要覆盖项目级与用户级两个 scope，并同时扫描客户端私有目录与 .agents/skills/ 互操作约定。",
      "重名冲突用确定性优先级解决：项目级覆盖用户级，并打日志告知用户被遮蔽的技能。",
      "项目级技能来自可能不可信的仓库，建议按信任状态决定是否加载，防止恶意指令注入。",
      "解析要宽松：命名不匹配只警告仍加载，缺 description 或 YAML 完全不可解析才跳过。",
      "披露层要过滤被禁用/无权限的技能，无技能时完全省略目录，不要留空壳。",
      "激活优先靠模型判断（文件读取或专用工具），但要同时支持用户显式激活（/skill-name 或 $skill-name）。",
      "上下文管理三件事：技能内容免于压缩裁剪、重复激活去重、可选地把技能放到子代理里跑。",
    ],
    tags: ["客户端实现", "生命周期", "渐进式披露", "权限"],
    sections: [
      {
        anchor: "core-principle",
        headingZh: "核心原则：三级加载策略",
        headingEn: "The core principle: progressive disclosure",
        contentZh:
          "所有兼容技能的 agent 都遵循同一套三层加载策略：\n\n- **第 1 层 目录**：启动时加载 name + description，**每技能约 50-100 token**；\n- **第 2 层 指令**：技能被激活时加载完整 SKILL.md 正文，**建议 < 5000 token**；\n- **第 3 层 资源**：当指令引用到脚本/参考/资产时，逐个按需加载，成本视内容而定。\n\n模型从会话一开始就能看到目录，因此知道有哪些能力可用；判断相关后再加载完整指令；指令若引用支撑文件，模型再单独取用。这样基础上下文很小，而按需知识随时可得：**装了 20 个技能的 agent 不会预先支付 20 套指令的 token 成本**，只为本次对话真正用到的那几个付费。\n\n集成复杂度主要取决于两个变量：**技能放在哪里**（本地文件系统 vs 云端/沙箱，需要 API、远端注册表或内置资产）与**模型如何访问技能内容**（模型有文件读取能力就直接读 SKILL.md，否则需要专用工具或把内容程序化注入提示）。不必支持全部场景，按你的架构选一条路即可。",
        contentEn:
          "Every skills-compatible agent follows the same three-tier loading strategy. Tier 1: catalog (name + description) at session start, ~50-100 tokens per skill. Tier 2: full SKILL.md body when the skill is activated, <5000 tokens recommended. Tier 3: scripts, references and assets loaded when the instructions reference them.",
      },
      {
        anchor: "discovery-scopes",
        headingZh: "步骤 1：发现——扫描哪些目录",
        headingEn: "Step 1: Discover skills — where to scan",
        contentZh:
          "会话启动时找到所有可用技能并加载其元数据。多数本地运行的 agent 至少扫描两个 scope：\n\n- **项目级**（相对于工作目录）：某个项目/仓库专属的技能；\n- **用户级**（相对于家目录）：对某用户所有项目生效的技能。\n\n其他 scope 也存在：管理员下发的组织级技能、agent 自身内置的技能——取决于你的部署模型。**在每个 scope 内，建议同时扫描你的客户端私有目录与 [[.agents/skills/]] 约定**：\n\n| Scope | 路径 | 用途 |\n| --- | --- | --- |\n| 项目 | [[<project>/.<your-client>/skills/]] | 客户端原生位置 |\n| 项目 | [[<project>/.agents/skills/]] | 跨客户端互操作 |\n| 用户 | [[~/.<your-client>/skills/]] | 客户端原生位置 |\n| 用户 | [[~/.agents/skills/]] | 跨客户端互操作 |\n\n[[.agents/skills/]] 已成为事实上的跨客户端共享约定。规范本身**并不规定技能目录放在哪里**（它只定义目录内部长什么样），但扫描该路径意味着：其他合规客户端安装的技能对你的 agent 自动可见，反之亦然。",
        contentEn:
          "Most locally-running agents scan at least two scopes: project-level (relative to the working directory) and user-level (relative to the home directory). Within each scope, consider scanning both a client-specific directory and the .agents/skills/ convention.",
      },
      {
        anchor: "discovery-rules",
        headingZh: "步骤 1：发现——扫描规则、重名与信任",
        headingEn: "Step 1: What to scan for, collisions, trust",
        contentZh:
          "**扫描规则**：在每个技能目录下寻找**包含名为 [[SKILL.md]] 文件的子目录**（文件名必须精确匹配）。实用建议：\n\n- 跳过明显不会含技能的目录，如 [[.git/]]、[[node_modules/]]；\n- 可选地尊重 [[.gitignore]]，避免扫到构建产物；\n- 设置合理边界（如最大 4-6 层深度、最多 2000 个目录），防止在大目录树上失控扫描。\n\n**重名冲突**：两个技能同名时用**确定性优先级**——业界统一约定是**项目级覆盖用户级**。同一 scope 内（例如 [[<project>/.agents/skills/]] 与 [[<project>/.<your-client>/skills/]] 各有一个 [[code-review]]）先找到或后找到都可以，**选一种并保持一致**。发生冲突时打日志，让用户知道有技能被遮蔽。\n\n**信任考量**：项目级技能来自正在处理的仓库，可能是不可信的（例如刚 clone 的开源项目）。考虑把项目级技能加载**门控在信任检查之后**——只有用户把该目录标记为可信时才加载，防止不可信仓库静默地把指令注入 agent 上下文。\n\n**云端/沙箱 agent**：无法访问用户本地文件系统，发现方式要按 scope 区别对待——项目级技能通常最简单（它在被 clone 的仓库里，随代码一起进沙箱，直接扫目录树即可）；用户级与组织级**不存在于沙箱内**，需要外部供给（clone 配置仓库、通过设置接受技能 URL/包、或用 Web UI 让用户上传技能目录）；内置技能可作为部署产物里的静态资产打包。技能一旦可用，后续的解析、披露、激活流程完全相同。",
        contentEn:
          "Within each skills directory, look for subdirectories containing a file named exactly SKILL.md. Skip directories that won't contain skills. When two skills share the same name, apply a deterministic precedence rule: project-level skills override user-level skills. Consider gating project-level skill loading on a trust check.",
      },
      {
        anchor: "parsing",
        headingZh: "步骤 2：解析 SKILL.md",
        headingEn: "Step 2: Parse SKILL.md files",
        contentZh:
          "**frontmatter 提取**三步：1) 找到文件开头的 [[---]] 与之后的闭合 [[---]]；2) 解析中间的 YAML，取出 [[name]]、[[description]]（必填）及可选字段；3) 闭合分隔符之后去掉首尾空白的内容就是技能正文。\n\n**畸形 YAML 兜底**：为其他客户端编写的技能文件可能含有技术上非法的 YAML，而它们的解析器恰好接受了。最常见的是**未加引号的值里含冒号**，例如 [[description: Use this skill when: the user asks about PDFs]]。建议做一次兜底重试：把这类值加引号，或转成 YAML 块标量，成本极低但能显著改善跨客户端兼容性。\n\n**宽松校验**（有告警但尽量加载）：\n\n- name 与父目录名不一致 → 告警，仍加载；\n- name 超过 64 字符 → 告警，仍加载；\n- description 缺失或为空 → **跳过**（描述是披露的必需品），记录错误；\n- YAML 完全无法解析 → **跳过**，记录错误。\n\n诊断信息要记录下来（调试命令、日志文件或 UI），但不要让装饰性问题阻塞技能加载。\n\n**存什么**：每条技能记录至少三个字段——[[name]]、[[description]]、[[location]]（SKILL.md 的绝对路径），放在以 name 为键的内存 map 里以便激活时快速查找。正文可以在发现时一并缓存（激活更快），也可以激活时再读（内存占用更小、且能感知技能文件的变化）。技能的**基目录**（location 的父目录）在解析相对路径、枚举随包资源时才需要，可从 location 推导。",
        contentEn:
          "A SKILL.md file has two parts: YAML frontmatter between --- delimiters, and a markdown body after the closing delimiter. Warn on issues but still load the skill when possible; skip only when the description is missing or the YAML is completely unparseable. At minimum store name, description and location.",
      },
      {
        anchor: "disclosing",
        headingZh: "步骤 3：向模型披露可用技能",
        headingEn: "Step 3: Disclose available skills to the model",
        contentZh:
          "把「有哪些技能」告诉模型，但**不加载其完整内容**——这正是渐进式披露的第 1 层。\n\n**构建目录**：每个技能包含 [[name]]、[[description]]，可选包含 [[location]]（SKILL.md 路径），格式随意（XML、JSON、列表皆可）。location 有两个作用：支撑「文件读取式激活」，以及给模型一个解析正文中相对引用的基准路径（如 [[scripts/evaluate.py]]）。如果你的专用激活工具会在返回值里给出技能目录路径，就可以省略 location；否则请带上。每个技能大约给目录增加 50-100 token，即使装了几十个技能，目录仍然很紧凑。\n\n**放在哪里**：两种常见做法——**系统提示的独立小节**（最简单，兼容任何有文件读取工具的模型）或**专用工具的描述字段**（保持系统提示干净，把发现与激活自然耦合）。两者都可行：前者更简单通用，后者在有专用激活工具时更整洁。\n\n**行为指令**：在目录旁附一段简短说明，告诉模型技能存在、以及如何加载。措辞取决于激活机制：文件读取式要说明「用文件读取工具打开所列 location 的 SKILL.md」「相对路径基于技能目录解析为绝对路径」；专用工具式要说明「当任务匹配某技能描述时，调用 [[activate_skill]] 并传入技能名」。这类指令保持简短——技能内容本身会提供细节。\n\n**过滤**：某些技能应被排除在目录之外（用户在设置里禁用、权限系统拒绝、技能通过 [[disable-model-invocation]] 之类标记主动退出模型驱动激活）。要点是**完全隐藏**，而不是列出后在激活时拦截——否则模型会浪费轮次去加载用不上的技能。\n\n**没有技能时**：如果没发现任何技能，就**完全省略目录与行为指令**。不要展示空的 [[<available_skills/>]]，也不要注册一个没有任何有效选项的技能工具——那只会让模型困惑。",
        contentEn:
          "For each discovered skill, include name, description, and optionally location in whatever structured format suits your stack. Hide filtered skills entirely from the catalog rather than listing them and blocking at activation time. If no skills are discovered, omit the catalog and behavioral instructions entirely.",
      },
      {
        anchor: "activating",
        headingZh: "步骤 4：激活技能",
        headingEn: "Step 4: Activate skills",
        contentZh:
          "当模型或用户选定技能时，把完整指令送入对话上下文——第 2 层。\n\n**模型驱动激活**：多数实现依赖模型自身的判断，而不是在 harness 侧做触发匹配或关键词检测。模型读目录、判断相关、加载技能。两种实现模式：\n\n- **文件读取式**：模型用标准文件读取工具打开目录里给出的 [[SKILL.md]] 路径。不需要任何特殊基础设施，这是模型具备文件访问能力时最简单的方案；\n- **专用工具式**（如 [[activate_skill(name)]]）：模型不能直接读文件时必需，即使能读也值得做。相对原始文件读取的优势：可控制返回内容（剥掉或保留 frontmatter）、把内容包在结构化标签里便于后续上下文管理、同时列出随包资源、执行权限或用户确认、记录激活用于分析。\n\n**用户显式激活**：用户也应该能直接激活技能，不必等模型决定。最常见的是**斜杠命令或提及语法**（[[/skill-name]] 或 [[$skill-name]]），由 harness 拦截；语法由你定，关键是由 harness 完成查找与注入，模型无需主动动作。带自动补全的输入框能进一步提升可发现性。\n\n**模型收到什么**：有两种选择——**完整文件**（含 YAML frontmatter）。它是文件读取式激活的自然结果；frontmatter 里也可能有激活时有用的字段（比如 [[compatibility]] 说明的环境要求）；**仅正文**（剥掉 frontmatter）：在带专用激活工具的现有实现中，多数在发现阶段提取 name/description 后就剥掉了。两种在实践中都可行。\n\n**结构化包裹**：用专用工具时，建议把技能内容包在可识别标签里（如 [[<skill_content name=\"...\">]]）。好处有三：模型能清楚区分技能指令与对话其他内容；harness 在上下文压缩（步骤 5）时能识别技能内容；随包资源可以被呈现给模型而无需提前加载。\n\n**列出随包资源**：专用激活工具可以顺便枚举技能目录里的支撑文件（scripts、references、assets），但**不应提前读取它们**——由模型在技能指令引用时按需用自己的文件读取工具加载。对很大的技能目录，考虑给列表设上限并说明可能不完整。\n\n**权限白名单**：如果你的 agent 有门控文件访问的权限系统，**请把技能目录加入白名单**，让模型无需触发用户确认就能读取随包资源。否则每次引用脚本或参考文件都会弹出确认框，对包含 SKILL.md 之外资源的技能而言流程会被打断。",
        contentEn:
          "Most implementations rely on the model's own judgment as the activation mechanism. Two patterns: file-read activation and dedicated tool activation. Users should also be able to activate skills directly via slash command or mention syntax. Allowlist skill directories so the model can read bundled resources without triggering user confirmation prompts.",
      },
      {
        anchor: "context-management",
        headingZh: "步骤 5：长期管理技能上下文",
        headingEn: "Step 5: Manage skill context over time",
        contentZh:
          "技能指令一旦进入上下文，就要在整个会话期间保持有效。三件事：\n\n**防止技能内容被上下文压缩裁掉**：如果你的 agent 在上下文窗口填满时截断或摘要旧消息，**请把技能内容豁免在裁剪之外**。技能指令是长期有效的**行为准则**：中途悄悄丢掉不会报错，只会让 agent 的质量无声下降——它还在运行，但已经没有专门指令了。常见做法：把技能工具的输出标记为受保护，让裁剪算法跳过；或者用步骤 4 里的结构化标签识别技能内容并在压缩时保留。\n\n**激活去重**：跟踪当前会话已激活过哪些技能。如果模型（或用户）试图加载已在上下文里的技能，可以跳过重复注入，避免同一套指令在对话里出现多次。\n\n**子代理委托（可选，高级）**：只有部分客户端支持。做法是不把技能指令注入主对话，而是让技能在**独立子代理会话**中运行：子代理收到技能指令、完成任务、把工作摘要返回主对话。当技能的工作流复杂到值得一个专门、专注的会话时，这个模式很有价值。",
        contentEn:
          "Protect skill content from context compaction — exempt skill content from pruning. Deduplicate activations to avoid re-injecting instructions already in context. Subagent delegation is an advanced optional pattern supported by some clients.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "core-principle",
        title: "三级披露的成本与时机",
        lang: "text",
        code: `Tier              What's loaded                When                              Token cost
1. Catalog        Name + description           Session start                     ~50-100 tokens per skill
2. Instructions   Full SKILL.md body           When the skill is activated       <5000 tokens (recommended)
3. Resources      Scripts, references, assets  When the instructions reference   Varies`,
        noteZh: "这张表是所有客户端实现的成本模型基础。",
      },
      {
        sectionAnchor: "discovery-rules",
        title: "目录扫描示意",
        lang: "text",
        code: `~/.agents/skills/
├── pdf-processing/
│   ├── SKILL.md          <- discovered
│   └── scripts/
│       └── extract.py
├── data-analysis/
│   └── SKILL.md          <- discovered
└── README.md             <- ignored (not a skill directory)`,
        noteZh: "只认「含 SKILL.md 的目录」，其余文件与目录一律忽略。",
      },
      {
        sectionAnchor: "parsing",
        title: "常见畸形 YAML",
        lang: "yaml",
        code: `# Technically invalid YAML — the colon breaks parsing
description: Use this skill when: the user asks about PDFs`,
        noteZh: "建议加引号或转块标量后重试，跨客户端兼容成本很低。",
      },
      {
        sectionAnchor: "disclosing",
        title: "技能目录（XML 形式）",
        lang: "xml",
        code: `<available_skills>
  <skill>
    <name>pdf-processing</name>
    <description>Extract PDF text, fill forms, merge files. Use when handling PDFs.</description>
    <location>/home/user/.agents/skills/pdf-processing/SKILL.md</location>
  </skill>
  <skill>
    <name>data-analysis</name>
    <description>Analyze datasets, generate charts, and create summary reports.</description>
    <location>/home/user/project/.agents/skills/data-analysis/SKILL.md</location>
  </skill>
</available_skills>`,
        noteZh: "XML / JSON / 列表都能用；带 location 就直接支持文件读取式激活。",
      },
      {
        sectionAnchor: "disclosing",
        title: "行为指令：文件读取式激活",
        lang: "text",
        code: `The following skills provide specialized instructions for specific tasks.
When a task matches a skill's description, use your file-read tool to load
the SKILL.md at the listed location before proceeding.
When a skill references relative paths, resolve them against the skill's
directory (the parent of SKILL.md) and use absolute paths in tool calls.`,
        noteZh: "明确两点：何时读、相对路径怎么解析。",
      },
      {
        sectionAnchor: "disclosing",
        title: "行为指令：专用工具激活",
        lang: "text",
        code: `The following skills provide specialized instructions for specific tasks.
When a task matches a skill's description, call the activate_skill tool
with the skill's name to load its full instructions.`,
        noteZh: "措辞随激活机制变化，保持简短。",
      },
      {
        sectionAnchor: "activating",
        title: "结构化包裹返回内容",
        lang: "xml",
        code: `<skill_content name="pdf-processing">
# PDF Processing

## When to use this skill
Use this skill when the user needs to work with PDF files...

[rest of SKILL.md body]

Skill directory: /home/user/.agents/skills/pdf-processing
Relative paths in this skill are relative to the skill directory.

<skill_resources>
  <file>scripts/extract.py</file>
  <file>scripts/merge.py</file>
  <file>references/pdf-spec-summary.md</file>
</skill_resources>
</skill_content>`,
        noteZh: "标签化后：模型能区分内容来源，harness 能在压缩时认出并保护它，资源只是「可见」而非「已加载」。",
      },
    ],
  },
];
