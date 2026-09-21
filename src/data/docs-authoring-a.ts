import type { DocSeed } from "./types";

export const authoringDocsA: DocSeed[] = [
  {
    slug: "quickstart",
    titleZh: "快速开始：20 行写出第一个技能",
    titleEn: "Quickstart",
    groupKey: "creators",
    groupZh: "技能创作者",
    orderIndex: 4,
    sourceUrl: "https://agentskills.io/skill-creation/quickstart",
    summaryZh:
      "用 VS Code + GitHub Copilot 在 5 分钟内做出 roll-dice 技能，并亲眼看到「发现 → 激活 → 执行」三段式渐进披露在真实会话里发生。",
    difficulty: "入门",
    readMinutes: 8,
    keyPoints: [
      "技能就是「一个文件夹 + 一个 SKILL.md」，创建它不需要任何脚手架或构建步骤。",
      "VS Code 默认从项目根的 .agents/skills/ 加载技能，路径必须精确。",
      "在 Copilot Chat 的 Agent 模式下输入 /skills 可以确认技能是否被成功发现。",
      "触发条件是「任务与该技能 description 匹配」，而不是某个魔法命令。",
      "如果 agent 没有按技能执行（比如自己算随机数），换模型往往比重写技能更有效。",
    ],
    tags: ["实战", "VS Code", "渐进式披露"],
    sections: [
      {
        anchor: "prerequisites",
        headingZh: "前置条件",
        headingEn: "Prerequisites",
        contentZh:
          "教程需要 **VS Code** 与 **GitHub Copilot**（在 Agent 模式下使用）。注意这只是演示载体：Agent Skills 是**开放格式**，同一个技能在 Claude Code、OpenAI Codex 等兼容 agent 中同样可用，只是加载目录和入口命令可能不同。",
        contentEn:
          "Prerequisites: VS Code with GitHub Copilot. This tutorial uses VS Code, but Agent Skills are an open format. The same skill works in any compatible agent, including Claude Code and OpenAI Codex.",
      },
      {
        anchor: "create",
        headingZh: "创建技能文件",
        headingEn: "Create the skill",
        contentZh:
          "新建 [[.agents/skills/roll-dice/SKILL.md]]，内容包含三段：\n\n- **frontmatter**：[[name: roll-dice]] 必须与目录名一致；[[description]] 用祈使句说明「何时使用」；\n- **正文**：告诉 agent 用一条终端命令生成 1 到 N 之间的随机数；\n- **参数占位**：用 [[<sides>]] 表示骰子面数，由 agent 从用户请求里代入。\n\n为了兼容不同 shell，正文同时给出 bash 与 PowerShell 两条命令——这是很典型的「跨环境兜底」写法。整个技能不到 20 行。",
        contentEn:
          "A skill is a folder containing a SKILL.md file. VS Code looks for skills in .agents/skills/ by default. Create .agents/skills/roll-dice/SKILL.md in your project. That's it — one file, under 20 lines.",
      },
      {
        anchor: "try",
        headingZh: "验证它真的能用",
        headingEn: "Try it out",
        contentZh:
          "打开项目 → 打开 Copilot Chat → 在底部模式下拉框选择 **Agent** 模式 → 输入 [[/skills]] 确认 [[roll-dice]] 出现在列表里（若不在，先检查文件是否位于项目根的 [[.agents/skills/roll-dice/SKILL.md]]）→ 提问「Roll a d20」。\n\n预期行为：agent 激活该技能、请求执行终端命令的权限、执行并返回 1-20 的随机数。\n\n排障提示：不同模型对工具调用的服从度差异很大。如果 agent 直接自己「编」了一个数字而没跑命令，先换一个模型再判断技能是否有问题。",
        contentEn:
          "Open the Copilot Chat panel, select Agent mode, type /skills to confirm that roll-dice appears in the list, then ask: \"Roll a d20\". The agent should activate the roll-dice skill. If the agent responds without running a terminal command, try selecting a different model.",
      },
      {
        anchor: "how-it-works",
        headingZh: "背后发生了什么",
        headingEn: "How it works",
        contentZh:
          "这个 20 行技能完整体验了渐进式披露的三步：\n\n1. **发现**：会话启动时 agent 扫描默认技能目录，只读取 [[name]] 与 [[description]]；\n2. **激活**：你说「Roll a d20」，agent 把问题与描述匹配，将完整 SKILL.md 正文读进上下文；\n3. **执行**：agent 按正文指令把 [[<sides>]] 替换成 20，运行命令并返回结果。\n\n这也是为什么描述要写「什么时候用」——发现阶段 agent 只有那一句话可以依赖。",
        contentEn:
          "1. Discovery — the agent scanned default skill directories and read only name and description. 2. Activation — the agent matched your question to the skill's description and loaded the full SKILL.md body. 3. Execution — the agent followed the instructions, adapting the command to the number of sides in your request.",
      },
      {
        anchor: "next-steps",
        headingZh: "下一步",
        headingEn: "Next steps",
        contentZh:
          "第一个技能跑通后，按顺序继续：\n\n- **最佳实践**：技能该怎么划定范围、如何控制上下文与指令精度；\n- **优化技能描述**：用评测查询把触发率从「碰运气」变成可测；\n- **格式规范**：把 SKILL.md 的所有字段约束过一遍；\n- **示例技能仓库**（[[github.com/anthropics/skills]]）：阅读真实世界的技能作为模板。",
        contentEn:
          "From here: Best practices, Optimizing skill descriptions, the Specification, and example skills on GitHub (github.com/anthropics/skills).",
      },
    ],
    snippets: [
      {
        sectionAnchor: "create",
        title: "roll-dice 技能全文（.agents/skills/roll-dice/SKILL.md）",
        lang: "markdown",
        code: `---
name: roll-dice
description: Roll dice using a random number generator. Use when asked to roll a die (d6, d20, etc.), roll dice, or generate a random dice roll.
---

To roll a die, use the following command that generates a random number from 1
to the given number of sides:

\`\`\`bash
echo $((RANDOM % <sides> + 1))
\`\`\`

\`\`\`powershell
Get-Random -Minimum 1 -Maximum (<sides> + 1)
\`\`\`

Replace \`<sides>\` with the number of sides on the die (e.g., 6 for a standard
die, 20 for a d20).`,
        noteZh: "一个可用的技能可以短到 20 行：描述负责触发，正文负责执行，参数由 agent 代入。",
      },
    ],
  },
  {
    slug: "best-practices",
    titleZh: "最佳实践：写好技能的方法论",
    titleEn: "Best practices for skill creators",
    groupKey: "creators",
    groupZh: "技能创作者",
    orderIndex: 5,
    sourceUrl: "https://agentskills.io/skill-creation/best-practices",
    summaryZh:
      "技能创作的核心方法论：从真实经验出发而不是让模型凭空生成，用真实执行反复打磨，按 token 预算组织内容，并按任务脆弱度校准指令的具体程度。",
    difficulty: "进阶",
    readMinutes: 20,
    keyPoints: [
      "最大陷阱是让 LLM 在没有领域上下文的情况下生成技能，结果是「处理错误要恰当」这类空洞流程。",
      "好的素材来源：亲自完成一次真实任务并提取模式，或用团队的运行手册、API 规范、评审意见、故障记录做合成。",
      "每条内容都问自己：没有这条指令，agent 会不会做错？答案是否定的就删掉。",
      "技能范围要像函数一样划成「连贯的工作单元」：太窄导致多技能同时加载，太宽导致无法精准激活。",
      "gotchas（反直觉的环境事实）常常是技能里价值最高的一节。",
      "按脆弱度校准：灵活任务讲清「为什么」，脆弱流程给出精确步骤乃至固定命令。",
      "六类可复用模式：gotchas、输出模板、清单、校验循环、plan-validate-execute、打包脚本。",
    ],
    tags: ["方法论", "上下文工程", "指令设计"],
    sections: [
      {
        anchor: "start-from-real-expertise",
        headingZh: "从真实专业知识出发",
        headingEn: "Start from real expertise",
        contentZh:
          "技能创作最常见的失败模式，是**只给模型一个主题、不给任何领域上下文**，让它「写一个 XX 技能」。这样产出的是通用套话——「恰当处理错误」「遵循认证最佳实践」——而不是真正有价值的 API 模式、边界情况和项目约定。\n\n有效技能必须扎根于真实经验。关键在于把领域上下文喂进创作过程，两条路径：\n\n- **从一次亲手完成的任务中提取**；\n- **从既有项目工件中合成**。",
        contentEn:
          "A common pitfall in skill creation is asking an LLM to generate a skill without providing domain-specific context — relying solely on the LLM's general training knowledge. The result is vague, generic procedures rather than the specific API patterns, edge cases, and project conventions that make a skill valuable.",
      },
      {
        anchor: "extract-from-task",
        headingZh: "路径 A：从亲手任务中提取",
        headingEn: "Extract from a hands-on task",
        contentZh:
          "先和 agent 一起**真的把任务做一遍**，过程中不断提供上下文、纠正方向、表达偏好。做完后把可复用的部分提炼成技能。提取时重点关注四类信息：\n\n- **行之有效的步骤**：最终成功的那条操作序列；\n- **你做过的纠正**：例如「用库 X 而不是 Y」「检查 Z 这个边界情况」——这些纠正往往就是 gotchas 的来源；\n- **输入/输出格式**：数据进来和出去分别长什么样；\n- **你补充的上下文**：agent 原本不知道的项目事实、约定与约束。",
        contentEn:
          "Complete a real task in conversation with an agent, providing context, corrections, and preferences along the way. Then extract the reusable pattern into a skill. Pay attention to: steps that worked, corrections you made, input/output formats, and the context you provided.",
      },
      {
        anchor: "synthesize-from-artifacts",
        headingZh: "路径 B：从既有项目工件中合成",
        headingEn: "Synthesize from existing project artifacts",
        contentZh:
          "当你已经有一批沉淀知识时，可以把它喂给 LLM 让其合成技能。关键判据是**项目特异性**：从团队真实的故障报告与运行手册合成的数据管道技能，会明显强于从「数据工程最佳实践」通用文章合成的版本，因为它捕获的是**你们的** schema、故障模式与恢复步骤。\n\n优质素材包括：\n\n- 内部文档、运行手册、风格指南；\n- API 规范、schema、配置文件；\n- 代码评审意见与 issue 跟踪记录（反映反复出现的关注点）；\n- 版本控制历史，尤其是补丁与修复（从「实际改了什么」看出模式）；\n- 真实故障案例及其解决过程。",
        contentEn:
          "When you have a body of existing knowledge, you can feed it into an LLM and ask it to synthesize a skill. Good source material includes internal documentation and runbooks, API specs and schemas, code review comments and issue trackers, version control history, and real-world failure cases and their resolutions.",
      },
      {
        anchor: "refine-with-execution",
        headingZh: "用真实执行迭代打磨",
        headingEn: "Refine with real execution",
        contentZh:
          "初稿通常需要打磨。把技能放到真实任务上跑，然后把结果——**包括成功的，不只失败的**——回灌到创作过程，问三个问题：\n\n- 什么被误触发了（false positive）？\n- 什么被漏掉了？\n- 哪些内容其实可以删？\n\n即使只做一轮「执行 → 修订」，质量提升也很明显；领域复杂时值得多轮。需要更结构化的做法（测试用例、断言、打分）时，转向『评估技能输出质量』。",
        contentEn:
          "Run the skill against real tasks, then feed the results — all of them, not just failures — back into the creation process. Ask: what triggered false positives? What was missed? What could be cut? Even a single pass of execute-then-revise noticeably improves quality.",
      },
      {
        anchor: "spend-context-wisely",
        headingZh: "节约上下文：只写 agent 不知道的",
        headingEn: "Spending context wisely: add what the agent lacks",
        contentZh:
          "技能被激活后，整篇正文会与对话历史、系统上下文、其他已激活技能**争夺同一个上下文窗口**。所以每一行都要有价值。\n\n判断标准只有一个问题：**「没有这条指令，agent 会不会做错？」** 不会就删；不确定就实测。你不需要解释什么是 PDF、什么是 HTTP、什么是数据库迁移。\n\n还有一个更狠的判断：如果 agent 在没有这个技能时也能把整个任务做对，那这个技能可能压根没在创造价值。",
        contentEn:
          "Focus on what the agent wouldn't know without your skill: project-specific conventions, domain-specific procedures, non-obvious edge cases, and the particular tools or APIs to use. Ask yourself about each piece of content: \"Would the agent get this wrong without this instruction?\" If the answer is no, cut it.",
      },
      {
        anchor: "coherent-units",
        headingZh: "设计连贯的工作单元",
        headingEn: "Design coherent units",
        contentZh:
          "决定一个技能该覆盖什么，就像决定一个函数该做什么：**封装一个连贯的工作单元，并且能与其他技能良好组合**。\n\n- **范围太窄**：一个任务要同时加载多个技能，带来开销与指令冲突；\n- **范围太宽**：无法被精准激活，描述只能写得很泛。\n\n文档给的例子：一个「查询数据库并把结果格式化」的技能算一个连贯单元；如果再塞进「数据库运维管理」，就明显超载了。",
        contentEn:
          "Deciding what a skill should cover is like deciding what a function should do: you want it to encapsulate a coherent unit of work that composes well with other skills. A skill for querying a database and formatting the results may be one coherent unit, while a skill that also covers database administration is probably trying to do too much.",
      },
      {
        anchor: "moderate-detail",
        headingZh: "追求「中等细节」，而不是穷举",
        headingEn: "Aim for moderate detail",
        contentZh:
          "过于全面的技能往往**帮倒忙**：agent 难以从中提取相关信息，还可能被不适用于当前任务的指令带到错误路径上。\n\n经验法则：**简洁的分步指导 + 一个可工作的示例**，通常胜过面面俱到的文档。当你开始逐个覆盖所有边界情况时，先问一句：这些情况是不是交给 agent 自己的判断更合适？",
        contentEn:
          "Overly comprehensive skills can hurt more than they help — the agent struggles to extract what's relevant and may pursue unproductive paths triggered by instructions that don't apply to the current task. Concise, stepwise guidance with a working example tends to outperform exhaustive documentation.",
      },
      {
        anchor: "progressive-disclosure-large",
        headingZh: "大技能用渐进式披露拆分",
        headingEn: "Structure large skills with progressive disclosure",
        contentZh:
          "规范建议 SKILL.md 控制在 **500 行 / 5000 token** 以内——只保留每次运行都必须的核心指令。当技能确实需要更多内容时，把详细参考资料搬到 [[references/]] 等目录，**并明确告诉 agent 什么时候去读哪个文件**。\n\n对比两种写法：\n\n- 差：「详见 references/ 目录」——agent 不知道何时该读，也不知道读哪个；\n- 好：「如果 API 返回非 200 状态码，读 [[references/api-errors.md]]」——触发条件明确，加载时机精确。\n\n这才真正用上了渐进式披露：上下文按需加载，而非一次性铺开。",
        contentEn:
          "Keep SKILL.md under 500 lines and 5,000 tokens — just the core instructions the agent needs on every run. When a skill legitimately needs more content, move detailed reference material to separate files and tell the agent when to load each file.",
      },
      {
        anchor: "calibrating-control",
        headingZh: "校准控制力：按脆弱度匹配具体程度",
        headingEn: "Calibrating control",
        contentZh:
          "不是技能里的每一部分都需要同样的强硬程度。要让**指令的具体程度与任务的脆弱程度相匹配**：\n\n- **给 agent 自由**：当多种做法都成立、任务能容忍变化时，说明「为什么」往往比给死板指令更有效——理解目的的 agent 能做出更好的情境判断（例如代码评审技能：描述要检查什么，而不规定逐步动作）；\n- **保持强制**：当操作脆弱、必须保持一致、或必须按特定顺序执行时，就给出精确步骤。\n\n多数技能是混合体：**逐个部分独立校准**，而不是整体选一种风格。",
        contentEn:
          "Not every part of a skill needs the same level of prescriptiveness. Match the specificity of your instructions to the fragility of the task. Most skills have a mix. Calibrate each part independently.",
      },
      {
        anchor: "defaults-not-menus",
        headingZh: "给默认值，而不是菜单",
        headingEn: "Provide defaults, not menus",
        contentZh:
          "当多个工具或方案都可行时，**挑一个作为默认并简短提一下替代方案**，而不是把它们并列成等价选项。\n\n反面写法：[[You can use pypdf, pdfplumber, PyMuPDF, or pdf2image...]]。\n正面写法：[[Use pdfplumber for text extraction:]] + 一个示例，然后补一句「扫描件需要 OCR 时改用 pdf2image + pytesseract」。\n\n原因很直接：并列菜单把决策成本转嫁给 agent，而 agent 并不知道你的偏好；给默认值 + 逃生口能同时得到稳定性和灵活性。",
        contentEn:
          "When multiple tools or approaches could work, pick a default and mention alternatives briefly rather than presenting them as equal options.",
      },
      {
        anchor: "procedures-over-declarations",
        headingZh: "给流程，而不是给答案",
        headingEn: "Favor procedures over declarations",
        contentZh:
          "技能应该教 agent **如何面对一类问题**，而不是**为某个具体实例产出什么**。\n\n- 具体答案型：把 [[orders]] 与 [[customers]] 按 [[customer_id]] 关联，筛 [[region = 'EMEA']]，对 [[amount]] 求和——这只对当前这个任务有用；\n- 可复用方法型：1) 从 [[references/schema.yaml]] 读 schema 找出相关表；2) 按 [[_id]] 外键约定做 join；3) 把用户请求变成 WHERE 条件；4) 聚合数值列并输出为 markdown 表格。\n\n这不意味着技能不能包含具体细节：输出格式模板、[[Never output PII]] 这类硬约束、工具特定指令都很有价值。要点是**方法要能泛化**，即使细节是具体的。",
        contentEn:
          "A skill should teach the agent how to approach a class of problems, not what to produce for a specific instance. Output format templates, constraints like \"never output PII\", and tool-specific instructions are all valuable — the point is that the approach should generalize.",
      },
      {
        anchor: "gotchas",
        headingZh: "模式一：Gotchas（反直觉事实清单）",
        headingEn: "Gotchas sections",
        contentZh:
          "很多技能里价值最高的内容，是一份 **gotchas** 清单：**违背合理假设的环境特定事实**。它不是泛泛建议（「恰当处理错误」），而是对「不告诉它 agent 一定会犯的错」的具体纠正。\n\n例如：[[users]] 表使用软删除，查询必须带 [[WHERE deleted_at IS NULL]]；同一个用户在数据库叫 [[user_id]]、在认证服务叫 [[uid]]、在计费 API 叫 [[accountId]]；[[/health]] 只要 web 服务在跑就返回 200，即使数据库已断连。\n\n放置位置很重要：**留在 SKILL.md 里**，让 agent 在遇到该情境前就读到。放独立参考文件也可以，但必须告诉它何时加载——对非显然的问题，agent 可能识别不出该加载的触发点。",
        contentEn:
          "The highest-value content in many skills is a list of gotchas — environment-specific facts that defy reasonable assumptions. Keep gotchas in SKILL.md where the agent reads them before encountering the situation.",
      },
      {
        anchor: "templates",
        headingZh: "模式二：输出格式模板",
        headingEn: "Templates for output format",
        contentZh:
          "当需要 agent 产出特定格式时，**给模板比用散文描述格式更可靠**——模型对具体结构的模式匹配能力很强。\n\n短模板可以直接内联在 SKILL.md；长模板、或只在特定情况下需要的模板放进 [[assets/]]，在 SKILL.md 里引用，从而只在需要时才加载。",
        contentEn:
          "When you need the agent to produce output in a specific format, provide a template. This is more reliable than describing the format in prose. Short templates can live inline in SKILL.md; for longer templates store them in assets/ and reference them.",
      },
      {
        anchor: "checklists",
        headingZh: "模式三：多步工作流清单",
        headingEn: "Checklists for multi-step workflows",
        contentZh:
          "显式清单能帮 agent 跟踪进度、避免跳步，尤其适用于**步骤之间存在依赖或校验闸门**的流程。\n\n文档示例是一个表单处理流程：分析表单 → 生成字段映射 → 校验映射 → 填表 → 校验输出，每一步都标注了对应脚本。把「步骤 + 该步使用的工具」写在一起，agent 才能既不漏步也不乱序。",
        contentEn:
          "An explicit checklist helps the agent track progress and avoid skipping steps, especially when steps have dependencies or validation gates.",
      },
      {
        anchor: "validation-loops",
        headingZh: "模式四：校验循环",
        headingEn: "Validation loops",
        contentZh:
          "让 agent **在推进之前先验证自己的产出**。模式是：做事 → 跑校验器（脚本、参考清单或自检）→ 修问题 → 重复直到通过。\n\n校验器不一定是脚本：一份参考文档也能充当「校验器」——指示 agent 在定稿前把产出与该参考逐条比对。这类循环对大模型尤其有效，因为它把「质量判断」从生成过程里剥离出来，变成可重复的机械步骤。",
        contentEn:
          "Instruct the agent to validate its own work before moving on. The pattern is: do the work, run a validator (a script, a reference checklist, or a self-check), fix any issues, and repeat until validation passes.",
      },
      {
        anchor: "plan-validate-execute",
        headingZh: "模式五：plan → validate → execute",
        headingEn: "Plan-validate-execute",
        contentZh:
          "对**批处理或破坏性操作**，让 agent 先生成一份结构化的中间计划，用「真相来源」校验计划，通过后才执行：\n\n1. 从输入中提取事实（如 [[form_fields.json]]：所有字段名、类型、是否必填）；\n2. 生成计划（如 [[field_values.json]]：字段名 → 目标值）；\n3. **用脚本校验计划与真相来源一致**；\n4. 执行并验证输出。\n\n关键在第 3 步。校验脚本给出的错误要能自我纠正，例如「Field 'signature_date' not found — available fields: customer_name, order_total, signature_date_signed」——agent 拿到这句就知道下一步该怎么改。",
        contentEn:
          "For batch or destructive operations, have the agent create an intermediate plan in a structured format, validate it against a source of truth, and only then execute. The key ingredient is a validation script that produces self-correcting error messages.",
      },
      {
        anchor: "bundling-scripts",
        headingZh: "模式六：打包可复用脚本",
        headingEn: "Bundling reusable scripts",
        contentZh:
          "迭代技能时对比不同测试用例的**执行轨迹**：如果发现 agent 每次都在**重新发明同一段逻辑**（画图、解析某种格式、校验输出），这就是信号——把它写成一次性测试好的脚本，放进 [[scripts/]]。\n\n收益是三重的：更快（不再每次生成代码）、更稳（不再每次略有不同）、更省上下文（脚本本身不必进入提示）。脚本本身的设计规范见『在技能中使用脚本』。",
        contentEn:
          "If you notice the agent independently reinventing the same logic each run — building charts, parsing a specific format, validating output — that's a signal to write a tested script once and bundle it in scripts/.",
      },
      {
        anchor: "next-steps",
        headingZh: "下一步",
        headingEn: "Next steps",
        contentZh:
          "技能可用了之后，两条主线继续打磨：\n\n- **评估技能输出质量**：搭建测试用例、打分、按迭代循环系统改进；\n- **优化技能描述**：让 [[description]] 在「该触发的提示」上确实触发。",
        contentEn:
          "Once you have a working skill: Evaluating skill output quality — set up test cases, grade results, and iterate systematically. Optimizing skill descriptions — test and improve your skill's description field.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "spend-context-wisely",
        title: "删掉模型已知的内容",
        lang: "markdown",
        code: `<!-- Too verbose — the agent already knows what PDFs are -->
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. pdfplumber is recommended because it handles most cases well.

<!-- Better — jumps straight to what the agent wouldn't know on its own -->
## Extract PDF text

Use pdfplumber for text extraction. For scanned documents, fall back to
pdf2image with pytesseract.`,
        noteZh: "同一任务两种写法：只有第二版把 token 花在了「agent 不知道的事」上。",
      },
      {
        sectionAnchor: "calibrating-control",
        title: "自由型指令与强制型指令",
        lang: "markdown",
        code: `## Code review process
<!-- 灵活：讲清要看什么，不规定每步动作 -->

1. Check all database queries for SQL injection (use parameterized queries)
2. Verify authentication checks on every endpoint
3. Look for race conditions in concurrent code paths
4. Confirm error messages don't leak internal details

## Database migration
<!-- 强制：给出固定命令与边界 -->

Run exactly this sequence:

...commands...

Do not modify the command or add additional flags.`,
        noteZh: "同一技能内可以混用：评审类给原则，迁移类给死命令。",
      },
      {
        sectionAnchor: "defaults-not-menus",
        title: "默认值 + 逃生口",
        lang: "markdown",
        code: `<!-- Too many options -->
You can use pypdf, pdfplumber, PyMuPDF, or pdf2image...

<!-- Clear default with escape hatch -->
Use pdfplumber for text extraction:

...example...

For scanned PDFs requiring OCR, use pdf2image with pytesseract instead.`,
        noteZh: "先给一个确定默认，再补一句替代方案与适用条件。",
      },
      {
        sectionAnchor: "procedures-over-declarations",
        title: "具体答案 vs 可复用方法",
        lang: "markdown",
        code: `<!-- Specific answer — only useful for this exact task -->
Join the "orders" table to "customers" on "customer_id", filter where
"region = 'EMEA'", and sum the "amount" column.

<!-- Reusable method — works for any analytical query -->
1. Read the schema from references/schema.yaml to find relevant tables
2. Join tables using the "_id" foreign key convention
3. Apply any filters from the user's request as WHERE clauses
4. Aggregate numeric columns as needed and format as a markdown table`,
        noteZh: "把「这次怎么算」升级成「这类问题怎么想」。",
      },
      {
        sectionAnchor: "gotchas",
        title: "Gotchas 示例",
        lang: "markdown",
        code: `## Gotchas

- The "users" table uses soft deletes. Queries must include
  "WHERE deleted_at IS NULL" or results will include deactivated accounts.
- The user ID is "user_id" in the database, "uid" in the auth service,
  and "accountId" in the billing API. All three refer to the same value.
- The "/health" endpoint returns 200 as long as the web server is running,
  even if the database connection is down. Use "/ready" to check full
  service health.`,
        noteZh: "三条都是「不告诉它就一定会踩」的环境事实。",
      },
      {
        sectionAnchor: "checklists",
        title: "带脚本引用的工作流清单",
        lang: "markdown",
        code: `## Form processing workflow

Progress:
- [ ] Step 1: Analyze the form (run scripts/analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run scripts/validate_fields.py)
- [ ] Step 4: Fill the form (run scripts/fill_form.py)
- [ ] Step 5: Verify output (run scripts/verify_output.py)`,
        noteZh: "步骤与工具绑定，天然形成校验闸门。",
      },
      {
        sectionAnchor: "validation-loops",
        title: "校验循环写法",
        lang: "markdown",
        code: `## Editing workflow

1. Make your edits
2. Run validation: python scripts/validate.py output/
3. If validation fails:
   - Review the error message
   - Fix the issues
   - Run validation again
4. Only proceed when validation passes`,
        noteZh: "「只有校验通过才继续」是这类模式的关键约束。",
      },
      {
        sectionAnchor: "plan-validate-execute",
        title: "plan-validate-execute（表单填充）",
        lang: "markdown",
        code: `## PDF form filling

1. Extract form fields: python scripts/analyze_form.py input.pdf -> form_fields.json
   (lists every field name, type, and whether it's required)
2. Create field_values.json mapping each field name to its intended value
3. Validate: python scripts/validate_fields.py form_fields.json field_values.json
4. Fill the form only after validation passes`,
        noteZh: "第 3 步的校验脚本是整套模式的价值所在。",
      },
    ],
  },
];
