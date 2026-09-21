import type { GlossarySeed, QuizSeed } from "./types";

export const glossary: GlossarySeed[] = [
  {
    term: "Agent Skill",
    termZh: "Agent 技能",
    definitionZh:
      "一个包含 SKILL.md 的目录：YAML frontmatter 提供元数据，Markdown 正文提供指令，并可选携带脚本、参考资料与资产。",
    category: "核心概念",
    docSlug: "overview",
  },
  {
    term: "Progressive disclosure",
    termZh: "渐进式披露",
    definitionZh:
      "分三层按需加载技能内容：目录（name+description）→ 完整指令 → 随包资源，让上下文成本随需要增长。",
    category: "核心概念",
    docSlug: "specification",
  },
  {
    term: "Catalog / Discovery",
    termZh: "技能目录 / 发现",
    definitionZh:
      "会话启动时把所有可用技能的 name 与 description 汇总成清单交给模型（约 50-100 token/技能）。",
    category: "客户端实现",
    docSlug: "adding-skills-support",
  },
  {
    term: "Activation",
    termZh: "激活",
    definitionZh:
      "任务与某技能描述匹配后，把完整 SKILL.md 正文读入上下文的过程；由模型判断或用户显式触发。",
    category: "客户端实现",
    docSlug: "adding-skills-support",
  },
  {
    term: "SKILL.md",
    termZh: "技能入口文件",
    definitionZh:
      "技能目录中唯一必需的文件，必须由 YAML frontmatter 与 Markdown 正文构成，文件名精确匹配无后缀变体。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "frontmatter",
    termZh: "YAML 前置元数据",
    definitionZh:
      "以 --- 分隔的 YAML 块，包含 name、description（必填）与 license、compatibility、metadata、allowed-tools（可选）。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "name",
    termZh: "技能名",
    definitionZh:
      "1-64 字符，仅小写字母数字与连字符，不能以连字符开头/结尾或出现连续连字符，且必须与父目录同名。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "description",
    termZh: "技能描述",
    definitionZh:
      "1-1024 字符，说明做什么与何时使用，是触发决策的唯一依据（元数据阶段只加载它）。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "compatibility",
    termZh: "环境兼容声明",
    definitionZh:
      "可选的 1-500 字符字段，声明目标产品、系统依赖、网络访问等环境要求；大多数技能不需要。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "allowed-tools",
    termZh: "预授权工具",
    definitionZh:
      "空格分隔的预授权工具列表（实验性），客户端可据此减少逐次权限确认。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: "metadata",
    termZh: "扩展元数据",
    definitionZh:
      "字符串键值映射，用于存放规范之外的属性（作者、版本等）；键名应足够独特以避免冲突。",
    category: "格式规范",
    docSlug: "specification",
  },
  {
    term: ".agents/skills/",
    termZh: "跨客户端技能目录约定",
    definitionZh:
      "被广泛采纳的互操作路径（项目级 <project>/.agents/skills/ 与用户级 ~/.agents/skills/），让不同客户端自动发现彼此的技能。",
    category: "客户端实现",
    docSlug: "clients",
  },
  {
    term: "Gotchas",
    termZh: "反直觉事实清单",
    definitionZh:
      "违背合理假设的环境特定事实（软删除、ID 别名、误导性健康检查），通常是技能里价值最高的内容。",
    category: "技能创作",
    docSlug: "best-practices",
  },
  {
    term: "Plan-validate-execute",
    termZh: "计划-校验-执行",
    definitionZh:
      "批处理/破坏性操作的模式：生成结构化中间计划，用真相来源脚本校验，通过后再执行。",
    category: "技能创作",
    docSlug: "best-practices",
  },
  {
    term: "Validation loop",
    termZh: "校验循环",
    definitionZh:
      "让 agent 在推进前自检：做事 → 跑校验器 → 修问题 → 重复，直到校验通过才继续。",
    category: "技能创作",
    docSlug: "best-practices",
  },
  {
    term: "Trigger rate",
    termZh: "触发率",
    definitionZh:
      "同一查询多次运行中技能被调用的比例；应触发项通常以 0.5 为通过阈值。",
    category: "技能创作",
    docSlug: "optimizing-descriptions",
  },
  {
    term: "Near-miss query",
    termZh: "近似反例查询",
    definitionZh:
      "与技能共享关键词或概念、但实际需要别的东西的用户提示，用于测试描述的精度。",
    category: "技能创作",
    docSlug: "optimizing-descriptions",
  },
  {
    term: "Train / validation split",
    termZh: "训练/验证切分",
    definitionZh:
      "把评测查询随机但固定地切成约 60% 训练集（指导改进）与 40% 验证集（检验泛化），防止过拟合。",
    category: "技能创作",
    docSlug: "optimizing-descriptions",
  },
  {
    term: "Eval / test case",
    termZh: "评测用例",
    definitionZh:
      "由真实感 Prompt、人类可读的期望输出与可选输入文件组成，存放在技能目录的 evals/evals.json。",
    category: "技能创作",
    docSlug: "evaluating-skills",
  },
  {
    term: "Assertion",
    termZh: "断言",
    definitionZh:
      "关于输出应满足什么的可验证陈述；好的断言可程序化验证、具体可观察或可计数。",
    category: "技能创作",
    docSlug: "evaluating-skills",
  },
  {
    term: "Grading",
    termZh: "打分",
    definitionZh:
      "逐条断言对照真实产出记录 PASS/FAIL，并给出引用输出的具体证据；PASS 不给「善意推定」。",
    category: "技能创作",
    docSlug: "evaluating-skills",
  },
  {
    term: "benchmark / delta",
    termZh: "基准汇总与差值",
    definitionZh:
      "按配置汇总通过率/耗时/token 的均值与标准差；delta = 带技能减基线，同时体现成本与收益。",
    category: "技能创作",
    docSlug: "evaluating-skills",
  },
  {
    term: "Execution transcript",
    termZh: "执行轨迹",
    definitionZh:
      "模型在一次运行中做了什么的完整日志；用于解释失败原因、发现低产步骤与耗时离群点。",
    category: "技能创作",
    docSlug: "evaluating-skills",
  },
  {
    term: "PEP 723",
    termZh: "Python 内联脚本元数据",
    definitionZh:
      "在脚本内的 # /// 标记中以 TOML 声明依赖与 Python 版本，用 uv run 直接执行的自包含方案。",
    category: "脚本工程",
    docSlug: "using-scripts",
  },
  {
    term: "Self-contained script",
    termZh: "自包含脚本",
    definitionZh:
      "把依赖声明写在脚本内部（PEP 723、Deno npm:/jsr:、Bun import 版本、Ruby bundler/inline），一条命令即可运行。",
    category: "脚本工程",
    docSlug: "using-scripts",
  },
  {
    term: "stdout / stderr split",
    termZh: "数据与诊断分离",
    definitionZh:
      "结构化数据走 stdout，进度与警告等诊断走 stderr，让 agent 获得可解析输出同时保留诊断信息。",
    category: "脚本工程",
    docSlug: "using-scripts",
  },
  {
    term: "Output truncation",
    termZh: "输出截断",
    definitionZh:
      "许多 harness 会在约 10-30K 字符处截断工具输出，因此脚本应默认汇总或支持分页/输出到文件。",
    category: "脚本工程",
    docSlug: "using-scripts",
  },
  {
    term: "Context compaction",
    termZh: "上下文压缩",
    definitionZh:
      "上下文窗口将满时对旧消息的裁剪/摘要；技能内容应被豁免，否则 agent 会无声失去行为准则。",
    category: "客户端实现",
    docSlug: "adding-skills-support",
  },
  {
    term: "Lenient validation",
    termZh: "宽松校验",
    definitionZh:
      "只对装饰性问题告警仍加载技能（命名不匹配、超长），仅在缺 description 或 YAML 不可解析时跳过。",
    category: "客户端实现",
    docSlug: "adding-skills-support",
  },
  {
    term: "skills-ref",
    termZh: "官方参考实现",
    definitionZh:
      "规范仓库内的参考库，提供 skills-ref validate ./my-skill 之类的校验命令。",
    category: "格式规范",
    docSlug: "specification",
  },
];

export const quizQuestions: QuizSeed[] = [
  {
    docSlug: "overview",
    difficulty: "基础",
    prompt: "一个 Agent Skill 的「最小可用形态」是什么？",
    options: [
      "一个包含 SKILL.md 的目录",
      "一个 Python 包加 setup.py",
      "一个 MCP 服务器进程",
      "一个注册到远端注册表的 JSON 清单",
    ],
    answerIndex: 0,
    explanationZh:
      "技能的最小单位就是「一个目录 + 一个 SKILL.md」，无需构建步骤、运行时或注册服务；其余文件都是可选约定。",
  },
  {
    docSlug: "overview",
    difficulty: "理解",
    prompt: "渐进式披露的三个阶段依次是？",
    options: [
      "发现 → 激活 → 执行",
      "激活 → 发现 → 缓存",
      "索引 → 编译 → 运行",
      "加载 → 微调 → 部署",
    ],
    answerIndex: 0,
    explanationZh:
      "启动时只加载 name/description（发现），匹配到任务后读完 SKILL.md（激活），随后按指令执行并可按需加载资源（执行）。",
  },
  {
    docSlug: "overview",
    difficulty: "理解",
    prompt: "为什么说 description 的写法会直接影响技能「有没有用」？",
    options: [
      "因为发现阶段只加载 name 与 description，触发完全依赖它",
      "因为它决定了脚本的执行权限",
      "因为它是唯一必填的字段",
      "因为客户端会用它作为文件路径",
    ],
    answerIndex: 0,
    explanationZh:
      "元数据阶段模型只看到 name + description，这是它判断「要不要取这个技能」的全部依据；描述不到位，技能就永远不会被激活。",
  },
  {
    docSlug: "specification",
    difficulty: "基础",
    prompt: "SKILL.md 的 frontmatter 中哪些字段是必填的？",
    options: [
      "name 与 description",
      "name、description 与 license",
      "name、version 与 description",
      "只有 name",
    ],
    answerIndex: 0,
    explanationZh:
      "只有 name 与 description 必填；license、compatibility、metadata、allowed-tools 都是可选字段。",
  },
  {
    docSlug: "specification",
    difficulty: "基础",
    prompt: "下列哪个 name 符合规范？",
    options: ["pdf-processing", "PDF-Processing", "-pdf", "pdf--processing"],
    answerIndex: 0,
    explanationZh:
      "name 只允许小写字母数字与连字符，不能以连字符开头/结尾，也不能出现连续连字符，且必须与父目录同名。",
  },
  {
    docSlug: "specification",
    difficulty: "理解",
    prompt: "description 字段的最大长度与它必须回答的两个问题是？",
    options: [
      "1024 字符；做什么 + 什么时候用",
      "500 字符；做什么 + 用什么语言",
      "200 字符；作者 + 版本",
      "不限长度；只说明做什么",
    ],
    answerIndex: 0,
    explanationZh:
      "规范要求 1-1024 字符，并且应同时说明能力与使用时机，还应包含帮助匹配任务的关键词。",
  },
  {
    docSlug: "specification",
    difficulty: "理解",
    prompt: "关于主 SKILL.md 的规模，规范的工程建议是？",
    options: [
      "不超过 500 行 / 5000 token，细节移到被引用的文件",
      "尽可能完整，最好覆盖所有边界情况",
      "不超过 50 行，否则客户端会拒绝加载",
      "长度无关紧要，反正只在激活时加载一次",
    ],
    answerIndex: 0,
    explanationZh:
      "SKILL.md 一旦激活会整篇进入上下文，因此建议控制在 500 行/5000 token 内，把详细参考搬到 references/ 并在正文说明何时加载。",
  },
  {
    docSlug: "specification",
    difficulty: "实战",
    prompt: "在 SKILL.md 中引用随包脚本时，正确的路径写法是？",
    options: [
      "相对于技能根目录的相对路径，并保持一层深度",
      "绝对路径，方便客户端直接访问",
      "相对于用户家目录的路径",
      "URL，客户端会去下载",
    ],
    answerIndex: 0,
    explanationZh:
      "规范要求使用相对技能根目录的路径，并保持一层深度（SKILL.md → 资源），避免深层引用链。",
  },
  {
    docSlug: "specification",
    difficulty: "实战",
    prompt: "allowed-tools 字段的现状与作用是什么？",
    options: [
      "实验性；空格分隔的预授权工具列表，各实现支持程度不同",
      "稳定字段；定义技能可用的全部 API 端点",
      "必填字段；列出技能作者的名字",
      "已废弃字段；应改用 compatibility",
    ],
    answerIndex: 0,
    explanationZh:
      "allowed-tools 是空格分隔的预授权工具字符串（如 Bash(git:*) Bash(jq:*) Read），被明确标注为实验性，支持情况因实现而异。",
  },
  {
    docSlug: "clients",
    difficulty: "基础",
    prompt: "官方清单里被广泛采纳的跨客户端技能目录约定是？",
    options: [".agents/skills/", "skills/registry/", "~/.skills/", "/etc/agent-skills/"],
    answerIndex: 0,
    explanationZh:
      "规范不规定技能目录位置，但 <project>/.agents/skills/ 与 ~/.agents/skills/ 已成为跨客户端互操作的事实约定。",
  },
  {
    docSlug: "clients",
    difficulty: "理解",
    prompt: "选型客户端时，下列哪一项对「优化描述」这项工作最关键？",
    options: [
      "能否观测到技能是否被激活（日志/工具调用记录）",
      "是否支持自定义主题色",
      "是否内置模型市场",
      "是否有图形安装向导",
    ],
    answerIndex: 0,
    explanationZh:
      "计算触发率必须知道每次运行技能有没有被调用，因此可观测性是做描述优化与输出评估的前提。",
  },
  {
    docSlug: "quickstart",
    difficulty: "基础",
    prompt: "VS Code 默认从哪个位置加载项目级技能？",
    options: [
      "项目根目录下的 .agents/skills/<skill-name>/SKILL.md",
      "全局的 ~/.vscode/skills.json",
      "项目内的 skills.config.js",
      "GitHub 仓库远端地址",
    ],
    answerIndex: 0,
    explanationZh:
      "教程明确要求把技能放在相对项目根的 .agents/skills/roll-dice/SKILL.md；找不到技能时先检查这个路径。",
  },
  {
    docSlug: "quickstart",
    difficulty: "理解",
    prompt: "在 Copilot Chat 中如何快速确认技能已被发现？",
    options: ["输入 /skills 查看技能列表", "重启 VS Code", "运行 npm run skills", "查看 package.json"],
    answerIndex: 0,
    explanationZh:
      "在 Agent 模式下手动输入 /skills 会列出已发现的技能；没出现就说明文件位置或命名有问题。",
  },
  {
    docSlug: "quickstart",
    difficulty: "实战",
    prompt: "agent回答了结果但没有执行技能里的终端命令，教程建议先做什么？",
    options: [
      "换一个模型再试，因为不同模型的工具调用服从度差异很大",
      "立刻重写整个技能",
      "把 description 改成大写",
      "删除 scripts/ 目录",
    ],
    answerIndex: 0,
    explanationZh:
      "教程的提示是：模型对工具调用与指令的服从度不一，先换模型排除变量，再判断技能本身是否有问题。",
  },
  {
    docSlug: "best-practices",
    difficulty: "理解",
    prompt: "让 LLM「写一个 XX 技能」而不给领域上下文，主要问题是什么？",
    options: [
      "产出通用套话（如「恰当处理错误」），缺少项目特有的模式与边界情况",
      "会超出 1024 字符长度限制",
      "frontmatter 一定会格式错误",
      "客户端无法解析 Markdown",
    ],
    answerIndex: 0,
    explanationZh:
      "脱离真实经验的技能只会复述模型已知的通用建议，而真正有价值的 API 模式、边界情况与项目约定都来自领域上下文。",
  },
  {
    docSlug: "best-practices",
    difficulty: "理解",
    prompt: "判断某段内容是否该留在 SKILL.md 里的核心问题是？",
    options: [
      "「没有这条指令，agent 会不会做错？」答案是否就删掉",
      "「这段内容是否足够长？」太短就补写",
      "「是否能体现作者的文笔？」",
      "「是否覆盖了所有可能的边界情况？」",
    ],
    answerIndex: 0,
    explanationZh:
      "内容要与对话历史、系统上下文和其他技能争夺同一个上下文窗口，所以只保留 agent 真正缺少的信息。",
  },
  {
    docSlug: "best-practices",
    difficulty: "理解",
    prompt: "「给默认值，而不是菜单」指的是？",
    options: [
      "选一个默认工具并简短提到替代方案及其适用条件",
      "把所有可选工具都并列出来让 agent 自己挑",
      "不写任何工具，交给 agent 决定",
      "把工具选择写进 metadata 字段",
    ],
    answerIndex: 0,
    explanationZh:
      "并列选项会把决策成本转嫁给不了解你偏好的 agent；默认值 + 逃生口兼顾稳定性与灵活性。",
  },
  {
    docSlug: "best-practices",
    difficulty: "实战",
    prompt: "为什么 gotchas 建议直接留在 SKILL.md，而不是放进 references/？",
    options: [
      "agent 可能认不出该加载它的触发点，从而在遇到问题时没有读到",
      "references/ 目录不被客户端扫描",
      "放进 references/ 会超出 token 上限",
      "references/ 只能放脚本",
    ],
    answerIndex: 0,
    explanationZh:
      "参考文件可以按需加载，但必须先有明确的加载触发条件；对反直觉问题，agent 往往意识不到自己需要那份文件。",
  },
  {
    docSlug: "best-practices",
    difficulty: "实战",
    prompt: "plan-validate-execute 模式中，最关键的环节是？",
    options: [
      "用校验脚本把中间计划与真相来源比对，并给出可自我纠正的错误",
      "让 agent 一次性直接执行以节省时间",
      "把计划写在对话里而不是文件里",
      "用 LLM 打分替代校验脚本",
    ],
    answerIndex: 0,
    explanationZh:
      "第 3 步的校验脚本负责在真正执行前发现不一致，其错误信息（如「Field not found — available fields: …」）要能让 agent 自行修正。",
  },
  {
    docSlug: "best-practices",
    difficulty: "实战",
    prompt: "发现 agent 每次运行都在重写同一个辅助脚本，说明应该？",
    options: [
      "把它写成测试一次的脚本放进 scripts/ 目录",
      "在 SKILL.md 里加上「不要重复造轮子」的指令",
      "删除相关断言以降低成本",
      "让描述更宽泛以覆盖这个场景",
    ],
    answerIndex: 0,
    explanationZh:
      "重复发明同一段逻辑是打包脚本的明确信号：更快、更稳、更省上下文。",
  },
  {
    docSlug: "optimizing-descriptions",
    difficulty: "基础",
    prompt: "描述应该用什么语气写？",
    options: [
      "祈使句：Use this skill when…",
      "第三人称说明：This skill does…",
      "营销文案：业界领先的…",
      "被动语态：PDFs can be handled by…",
    ],
    answerIndex: 0,
    explanationZh:
      "agent 在决定「要不要行动」，所以告诉他们何时行动比陈述技能功能更有效。",
  },
  {
    docSlug: "optimizing-descriptions",
    difficulty: "理解",
    prompt: "「近似反例（near-miss）」查询的价值是什么？",
    options: [
      "它们与技能共享概念但需求不同，能测出描述的精度而不只是宽泛度",
      "它们最容易触发技能，能提升通过率",
      "它们不需要 should_trigger 标签",
      "它们用于替代验证集",
    ],
    answerIndex: 0,
    explanationZh:
      "「写个斐波那契函数」这类明显不相关的反例测不出任何东西；共享关键词但需要别的东西的查询才能检验边界。",
  },
  {
    docSlug: "optimizing-descriptions",
    difficulty: "理解",
    prompt: "为什么要每条查询跑 3 次并计算触发率？",
    options: [
      "模型行为不确定，单次结果可能是噪声；用触发率与阈值判断更稳定",
      "协议要求所有查询至少运行 3 次",
      "为了累积 token 统计",
      "因为客户端只缓存 3 次结果",
    ],
    answerIndex: 0,
    explanationZh:
      "同一查询在不同运行可能触发或不触发，因此用「被调用次数 / 运行次数」并配合阈值（默认 0.5）来判定是否通过。",
  },
  {
    docSlug: "optimizing-descriptions",
    difficulty: "实战",
    prompt: "应触发查询一直失败时，正确的修订方向是？",
    options: [
      "放宽描述范围或补充适用场景，但不要照抄失败查询里的具体关键词",
      "把失败查询的词逐个加进描述",
      "直接删掉这些查询",
      "把 description 拆成多条",
    ],
    answerIndex: 0,
    explanationZh:
      "加原词属于过拟合；应抽象出这些查询代表的通用类别或概念并据此放宽描述。",
  },
  {
    docSlug: "optimizing-descriptions",
    difficulty: "实战",
    prompt: "优化迭代结束后该按什么挑选最终描述？",
    options: [
      "验证集通过率最高的一版，不一定是最后一版",
      "训练集通过率 100% 的那一版",
      "最后一次改动后的版本",
      "字符数最短的一版",
    ],
    answerIndex: 0,
    explanationZh:
      "训练集用来指导改动，验证集用来检验泛化；后期版本可能已过拟合训练集，因此最佳版本可能是更早的某一版。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "基础",
    prompt: "一条评测用例由哪三部分组成？",
    options: [
      "真实感 Prompt、期望输出、可选的输入文件",
      "脚本、断言、日志",
      "模型、温度、提示词",
      "基线、迭代号、提交哈希",
    ],
    answerIndex: 0,
    explanationZh:
      "用例先只写 Prompt、期望输出与输入文件；断言在看到首轮输出之后再补。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "理解",
    prompt: "为什么每条用例要跑 with_skill 与 without_skill 两次？",
    options: [
      "为了得到可比较的基线，判断技能是否真的带来提升",
      "为了让 token 统计翻倍以更准确",
      "因为客户端要求成对提交",
      "为了测试两个模型",
    ],
    answerIndex: 0,
    explanationZh:
      "只有和「不带技能」的基线对比，才能知道技能带来的质量变化与额外成本；改进已有技能时基线换成旧版本快照。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "理解",
    prompt: "下列哪条断言符合文档推荐的写法？",
    options: [
      "「输出文件是合法 JSON」",
      "「输出是好的」",
      "「输出使用了完全一致的措辞 Total Revenue: $X」",
      "「输出让审阅者感到专业」",
    ],
    answerIndex: 0,
    explanationZh:
      "好断言可程序化验证、具体可观察或可计数；空泛、脆弱、无法验证的断言都应避免。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "理解",
    prompt: "打分时「PASS 需要有具体证据」意味着？",
    options: [
      "要引用输出里的具体内容；只有标题没有实质内容的总结应判 FAIL",
      "只要断言看起来合理就给通过",
      "由多数投票决定",
      "PASS 由模型自评产生",
    ],
    answerIndex: 0,
    explanationZh:
      "不给「善意推定」：证据要指向输出内容，机械可验证的断言优先用脚本判定。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "实战",
    prompt: "benchmark 里「两种配置都通过」的断言应该怎么处理？",
    options: [
      "删除或替换，因为它们不提供信息还会虚高 with_skill 通过率",
      "保留并计入总分",
      "把它们升级为核心断言",
      "改成人工复核项",
    ],
    answerIndex: 0,
    explanationZh:
      "模型本来就做得对的内容说明技能没有增值；保留只会制造技能有效的假象。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "实战",
    prompt: "delta 中 pass_rate +0.50 但 tokens +1700、time +13s，该如何解读？",
    options: [
      "通过率大幅提升换来可接受的额外成本，通常是划算的取舍",
      "必须回退，因为 token 增加了",
      "说明技能无效",
      "说明断言太严格",
    ],
    answerIndex: 0,
    explanationZh:
      "delta 同时表达成本与收益：通过率提升 50 个百分点通常值得多花 13 秒与 1700 token，这与「翻倍 token 只提升 2 点」是不同性质的取舍。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "实战",
    prompt: "同一断言在不同运行间时通过时失败（stddev 高），首先应考虑？",
    options: [
      "评测本身脆弱，或技能指令歧义大到模型每次理解不同",
      "断言数量太少",
      "模型太小",
      "必须删除该用例",
    ],
    answerIndex: 0,
    explanationZh:
      "不稳定要么来自模型随机性（评测脆弱），要么来自指令歧义；对策是加示例或更具体的指引来降低歧义。",
  },
  {
    docSlug: "evaluating-skills",
    difficulty: "实战",
    prompt: "给 LLM 提议技能改进时，文档列出的准则不包括哪一条？",
    options: [
      "尽可能增加规则以保证覆盖率",
      "从反馈中泛化，不为具体例子打补丁",
      "保持精简，必要时删指令",
      "解释「为什么」，而不是只给死命令",
    ],
    answerIndex: 0,
    explanationZh:
      "准则强调泛化、精简、解释原因、打包重复工作；无节制加规则会造成过度约束，通过率反而停滞。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "基础",
    prompt: "为什么技能脚本绝对不能有交互式提示？",
    options: [
      "agent 运行在非交互 shell，阻塞等待输入会让任务无限挂起",
      "交互式脚本无法通过 lint",
      "客户端不允许读取 stdin",
      "会导致 token 超限",
    ],
    answerIndex: 0,
    explanationZh:
      "这是 agent 执行环境的硬性要求：输入必须来自 flag、环境变量或 stdin，缺失参数应立即报错并给出用法。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "理解",
    prompt: "脚本的 --help 输出应该遵循什么原则？",
    options: [
      "简洁：描述、参数、默认值、示例，因为它会占用 agent 上下文",
      "尽可能详尽，覆盖所有内部实现细节",
      "只输出一行标题",
      "不提供，改用 README.md",
    ],
    answerIndex: 0,
    explanationZh:
      "--help 是 agent 了解接口的主要途径，但输出进入上下文窗口，所以要信息密度高且简短。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "理解",
    prompt: "结构化数据与诊断信息应该如何分配输出流？",
    options: [
      "结构化数据走 stdout，进度/警告走 stderr",
      "全部走 stdout，方便一次性读取",
      "结构化数据走 stderr，人类信息走 stdout",
      "写到临时文件里，让 agent 自己找",
    ],
    answerIndex: 0,
    explanationZh:
      "分离后 agent 能获得干净可解析的输出，同时在需要时仍能读到诊断信息；这也能让输出进入 jq/cut/awk 管道。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "实战",
    prompt: "PEP 723 的作用是什么？",
    options: [
      "在 Python 脚本内部以 TOML 声明依赖，用 uv run 直接执行，无需额外清单文件",
      "定义 YAML frontmatter 的语法",
      "规定技能目录结构",
      "为 Deno 提供权限模型",
    ],
    answerIndex: 0,
    explanationZh:
      "PEP 723 用 # /// 标记内联依赖与 requires-python，uv run 会建隔离环境、装依赖并执行；pipx run 同样支持。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "实战",
    prompt: "为什么脚本要提供 --dry-run 与有意义的退出码？",
    options: [
      "因为 agent 会重试、会误用命令，需要能预览影响并区分失败类型来自我纠正",
      "因为 CLI 规范强制要求",
      "为了减少 token 使用",
      "为了让脚本可以交互式运行",
    ],
    answerIndex: 0,
    explanationZh:
      "dry-run 让 agent 预览破坏性操作；不同退出码（未找到/参数错误/鉴权失败）配合 --help 说明能让 agent 判断下一步怎么做。",
  },
  {
    docSlug: "using-scripts",
    difficulty: "实战",
    prompt: "脚本可能产生海量输出时，推荐做法是？",
    options: [
      "默认输出汇总或设限额，并提供 --offset 之类参数按需取更多",
      "无条件输出全部内容，让 harness 自己截断",
      "把输出写进 stderr",
      "要求用户手动分次运行",
    ],
    answerIndex: 0,
    explanationZh:
      "许多 harness 会在 10-30K 字符处自动截断工具输出，可能丢掉关键信息；应主动控制体积，或要求传 --output（文件或 -）。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "理解",
    prompt: "客户端实现中，重名技能的确定性优先级约定是？",
    options: [
      "项目级覆盖用户级，并打日志提示遮蔽",
      "用户级覆盖项目级",
      "按字母顺序取第一个",
      "随机选择并缓存",
    ],
    answerIndex: 0,
    explanationZh:
      "跨实现的一致约定是项目级优先；同一 scope 内选一种确定策略并保持一致，冲突要记录日志。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "理解",
    prompt: "为什么项目级技能建议做信任门控？",
    options: [
      "项目级技能来自可能不可信的仓库，未确认信任前加载等于让它注入指令",
      "项目级技能体积更大",
      "项目级技能无法通过校验",
      "项目级技能总是过期的",
    ],
    answerIndex: 0,
    explanationZh:
      "刚 clone 的开源仓库可能包含恶意技能目录，因此只有在用户标记项目可信时才加载项目级技能更安全。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "实战",
    prompt: "解析 SKILL.md 时，什么情况才应该跳过技能？",
    options: [
      "description 为空或 YAML 完全无法解析",
      "name 与目录名不一致",
      "name 超过 64 字符",
      "frontmatter 里缺少 license",
    ],
    answerIndex: 0,
    explanationZh:
      "宽松校验原则：装饰性问题只告警仍加载；只有缺 description（无法披露）或 YAML 不可解析时才跳过并记录错误。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "实战",
    prompt: "若没有任何技能被发现，披露阶段应该怎么做？",
    options: [
      "完全省略目录与行为指令，不要展示空块或无选项的工具",
      "输出空的 available_skills 块以提示模型",
      "注册一个始终返回错误的技能工具",
      "把技能名字写进系统提示",
    ],
    answerIndex: 0,
    explanationZh:
      "空目录块或没有有效选项的工具只会让模型困惑，规范建议直接省略。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "实战",
    prompt: "为什么要把技能目录加入权限白名单？",
    options: [
      "否则模型每次读取随包脚本或参考文件都会触发用户确认，打断技能流程",
      "否则技能无法被解析",
      "否则技能会被压缩删除",
      "否则目录不会被扫描",
    ],
    answerIndex: 0,
    explanationZh:
      "资源按需加载是渐进式披露的第三层；若每次读取都需要确认，含资源的技能体验会被频繁打断。",
  },
  {
    docSlug: "adding-skills-support",
    difficulty: "实战",
    prompt: "为什么技能内容要在上下文压缩时被保护？",
    options: [
      "技能是长期行为准则，中途丢掉不会报错，只会让 agent 表现无声下降",
      "技能内容体积最大，删掉最省空间",
      "压缩算法无法处理 XML 标签",
      "防止模型忘记技能名字",
    ],
    answerIndex: 0,
    explanationZh:
      "常见做法是把技能工具输出标记为受保护，或用结构化标签识别技能内容并在裁剪时保留；也可以对重复激活做去重。",
  },
];
