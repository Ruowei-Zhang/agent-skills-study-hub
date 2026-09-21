import type { LifecycleStepSeed, SpecFieldSeed } from "./types";

/** Frontmatter field reference (specification page). */
export const specFields: SpecFieldSeed[] = [
  {
    field: "name",
    required: true,
    constraints: "1-64 chars; a-z, 0-9, '-' only; no leading/trailing '-'; no '--'",
    detailZh:
      "技能的唯一标识，也是客户端做目录映射与激活查找的键。必须与 SKILL.md 所在的父目录名一致。",
    example: "name: pdf-processing",
    orderIndex: 1,
  },
  {
    field: "description",
    required: true,
    constraints: "1-1024 chars; non-empty",
    detailZh:
      "同时说明「做什么」与「什么时候用」，并包含帮助 agent 匹配任务的具体关键词。承担全部触发职责。",
    example:
      "description: Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents.",
    orderIndex: 2,
  },
  {
    field: "license",
    required: false,
    constraints: "短小；许可证名称或随包许可文件名",
    detailZh: "声明技能适用的许可，供人与合规流程阅读，不参与加载决策。",
    example: "license: Apache-2.0",
    orderIndex: 3,
  },
  {
    field: "compatibility",
    required: false,
    constraints: "1-500 chars if provided",
    detailZh:
      "声明环境要求：目标产品、需要的系统包、网络访问等。只在确实有特殊依赖时才写。",
    example: "compatibility: Requires git, docker, jq, and access to the internet",
    orderIndex: 4,
  },
  {
    field: "metadata",
    required: false,
    constraints: "string key → string value map",
    detailZh:
      "存放规范未定义的扩展属性（作者、版本等）。键名建议取得足够独特以避免冲突。",
    example: 'metadata:\n  author: example-org\n  version: "1.0"',
    orderIndex: 5,
  },
  {
    field: "allowed-tools",
    required: false,
    constraints: "空格分隔的字符串（实验性）",
    detailZh:
      "预授权工具列表，客户端可据此减少逐次确认。不同实现支持程度差异较大。",
    example: "allowed-tools: Bash(git:*) Bash(jq:*) Read",
    orderIndex: 6,
  },
];

/** 5-step integration lifecycle for client implementors. */
export const lifecycleSteps: LifecycleStepSeed[] = [
  {
    step: 1,
    titleZh: "发现技能",
    titleEn: "Discover skills",
    goalZh: "会话启动时找到所有可用技能并只加载它们的元数据（name + description）。",
    detailsZh: [
      "扫描两个 scope：项目级（相对于工作目录）与用户级（相对于家目录）。",
      "每个 scope 内同时扫描客户端私有目录与 .agents/skills/ 互操作约定。",
      "只把「包含名为 SKILL.md 文件的子目录」视为技能；跳过 .git/、node_modules/，可选尊重 .gitignore。",
      "设置边界：最大深度 4-6 层、最多 2000 个目录。",
      "重名冲突用确定性规则：项目级覆盖用户级；同 scope 内选一种并保持一致，冲突要打日志。",
      "云端/沙箱：项目级随仓库进入沙箱；用户级/组织级需外部供给；内置技能打包为静态资产。",
    ],
    pitfallsZh: [
      "不设扫描边界，在大仓库上扫描失控。",
      "项目级技能未做信任门控，导致不可信仓库注入指令。",
      "重名静默遮蔽，用户不知道哪个技能生效。",
    ],
  },
  {
    step: 2,
    titleZh: "解析 SKILL.md",
    titleEn: "Parse SKILL.md files",
    goalZh: "从每个技能文件中提取元数据与正文，并容忍跨客户端编写风格带来的瑕疵。",
    detailsZh: [
      "先定位开头的 --- 与随后的闭合 ---，解析中间 YAML。",
      "提取 name、description（必填）与可选字段；闭合分隔符之后的内容是正文。",
      "对畸形 YAML（最常见是未加引号的值含冒号）做加引号/块标量兜底重试。",
      "宽松校验：name 不匹配目录名或超长只告警仍加载；description 为空或 YAML 完全不可解析才跳过。",
      "至少存储 name、description、location（SKILL.md 绝对路径），以 name 为键放入内存 map。",
      "正文可选择发现时缓存或在激活时读取；基目录可从 location 推导。",
    ],
    pitfallsZh: [
      "对装饰性问题过于严格，导致跨客户端技能无法加载。",
      "把 description 为空当作可加载，结果技能永远不会被触发。",
      "忽略诊断记录，用户无法排查「技能为什么没生效」。",
    ],
  },
  {
    step: 3,
    titleZh: "向模型披露目录",
    titleEn: "Disclose available skills",
    goalZh: "让模型知道有哪些技能存在，但不加载它们的完整内容（渐进式披露第 1 层）。",
    detailsZh: [
      "目录包含 name、description，可选 location（SKILL.md 路径）。",
      "location 兼具两个作用：支持文件读取式激活、提供解析相对路径的基准。",
      "放在系统提示的独立小节，或嵌入专用激活工具的描述中。",
      "同时给出简短行为指令：何时加载、相对路径如何解析（或改用专用工具）。",
      "被禁用、无权限或主动退出模型驱动激活的技能要完全隐藏，而不是列出后拦截。",
      "没有发现任何技能时，完全省略目录与行为指令。",
    ],
    pitfallsZh: [
      "输出空的 available_skills 块，或注册没有有效选项的技能工具，造成模型困惑。",
      "把目录写得太啰嗦，每个技能远超 50-100 token 的预算。",
    ],
  },
  {
    step: 4,
    titleZh: "激活技能",
    titleEn: "Activate skills",
    goalZh: "在模型或用户选定技能时，把完整指令注入对话上下文（第 2 层）。",
    detailsZh: [
      "优先模型驱动激活：靠模型判断，而不是 harness 侧关键词匹配。",
      "两种实现：文件读取式（模型读 SKILL.md）或专用工具式（如 activate_skill）。",
      "专用工具优势：控制返回内容、结构化包裹、列出资源、权限控制、激活埋点。",
      "支持用户显式激活：/skill-name 或 $skill-name，由 harness 完成查找与注入。",
      "返回「完整文件」或「仅正文」都可行；多数专用工具实现会剥掉 frontmatter。",
      "结构化包裹（如 skill_content 标签）便于区分与后续上下文管理；资源只列举不预读。",
      "把技能目录加入权限白名单，避免读取随包资源时反复弹确认框。",
    ],
    pitfallsZh: [
      "每次读取 scripts/ 下的文件都弹权限确认，破坏技能流程。",
      "提前把所有随包文件读进上下文，抵消了渐进式披露的收益。",
      "只支持模型驱动激活，用户无法强制使用某个技能。",
    ],
  },
  {
    step: 5,
    titleZh: "长期管理上下文",
    titleEn: "Manage skill context over time",
    goalZh: "让技能指令在整个会话期间保持有效，并控制上下文成本。",
    detailsZh: [
      "把技能内容豁免于上下文压缩/裁剪：标记工具输出为受保护，或用标签识别技能内容。",
      "跟踪已激活技能，跳过重复注入，避免同一套指令出现多次。",
      "可选高级模式：把技能放进子代理会话执行，只把摘要返回主对话。",
    ],
    pitfallsZh: [
      "技能指令在压缩中被丢掉——不会报错，但 agent 质量无声下降。",
      "重复激活造成上下文冗余与指令冲突。",
    ],
  },
];

export type TierSeed = {
  tier: string;
  titleZh: string;
  loaded: string;
  when: string;
  cost: string;
  docSlug: string;
};

/** Progressive-disclosure tiers, shared by the dashboard and the lifecycle page. */
export const disclosureTiers: TierSeed[] = [
  {
    tier: "1",
    titleZh: "目录（Catalog）",
    loaded: "每个技能的 name + description",
    when: "会话启动时",
    cost: "~50-100 token / 技能",
    docSlug: "adding-skills-support",
  },
  {
    tier: "2",
    titleZh: "指令（Instructions）",
    loaded: "完整的 SKILL.md 正文",
    when: "技能被激活时",
    cost: "<5000 token（建议）",
    docSlug: "specification",
  },
  {
    tier: "3",
    titleZh: "资源（Resources）",
    loaded: "scripts / references / assets 中的文件",
    when: "指令引用到它们时",
    cost: "视内容而定",
    docSlug: "using-scripts",
  },
];

export type CheckItemSeed = {
  group: string;
  label: string;
  hint: string;
  docSlug: string;
};

/** Practical self-check list distilled from all nine pages. */
export const checklist: CheckItemSeed[] = [
  {
    group: "结构",
    label: "技能是一个目录，且只含一个 SKILL.md 作为入口",
    hint: "scripts/、references/、assets/ 都是可选约定。",
    docSlug: "specification",
  },
  {
    group: "结构",
    label: "name 与父目录同名，且只含小写字母、数字、连字符",
    hint: "不能以连字符开头/结尾，不能出现连续连字符。",
    docSlug: "specification",
  },
  {
    group: "触发",
    label: "description 同时说明了「做什么」和「什么时候用」",
    hint: "用祈使句，主动列出适用场景，包括用户不点名关键词的情况。",
    docSlug: "optimizing-descriptions",
  },
  {
    group: "触发",
    label: "description 在 1024 字符以内",
    hint: "优化过程中描述会不断变长，需反复检查。",
    docSlug: "optimizing-descriptions",
  },
  {
    group: "触发",
    label: "准备了 8-10 条应触发与 8-10 条近似反例查询",
    hint: "近似反例比「明显无关」的查询更能测出精度。",
    docSlug: "optimizing-descriptions",
  },
  {
    group: "触发",
    label: "每条查询至少跑 3 次并计算触发率",
    hint: "模型输出不确定；应触发项 >0.5、不应触发项 <0.5 视为通过。",
    docSlug: "optimizing-descriptions",
  },
  {
    group: "触发",
    label: "切分训练集（60%）与验证集（40%）并保持固定",
    hint: "只用训练集失败来改描述，用验证集挑最终版本。",
    docSlug: "optimizing-descriptions",
  },
  {
    group: "内容",
    label: "SKILL.md 小于 500 行 / 5000 token",
    hint: "长内容拆到 references/，并写清加载触发条件。",
    docSlug: "best-practices",
  },
  {
    group: "内容",
    label: "每一条内容都通过了「没有它 agent 会做错吗」测试",
    hint: "不解释通用知识（PDF 是什么、HTTP 怎么工作）。",
    docSlug: "best-practices",
  },
  {
    group: "内容",
    label: "有 gotchas 清单，列出反直觉的环境事实",
    hint: "软删除、同一 ID 的多个别名、健康检查误导等。",
    docSlug: "best-practices",
  },
  {
    group: "内容",
    label: "多方案处给了默认值而不是并列菜单",
    hint: "默认 + 逃生口（替代方案与适用条件）。",
    docSlug: "best-practices",
  },
  {
    group: "内容",
    label: "写法是「可复用方法」而非「本次任务的答案」",
    hint: "教 agent 如何面对一类问题。",
    docSlug: "best-practices",
  },
  {
    group: "内容",
    label: "按脆弱度校准了指令具体程度",
    hint: "灵活任务讲清为什么；脆弱流程给固定命令与顺序。",
    docSlug: "best-practices",
  },
  {
    group: "评估",
    label: "有 evals/evals.json，含 2-3 条起步用例并逐步扩充",
    hint: "用例要真实、多样，且至少一条覆盖边界情况。",
    docSlug: "evaluating-skills",
  },
  {
    group: "评估",
    label: "每条用例都跑了 with_skill 与 without_skill 双基线",
    hint: "改进已有技能时用旧版本快照作基线。",
    docSlug: "evaluating-skills",
  },
  {
    group: "评估",
    label: "断言具体、可观察、可计数，并能机械化验证",
    hint: "避免「输出是好的」这类无法打分的写法。",
    docSlug: "evaluating-skills",
  },
  {
    group: "评估",
    label: "PASS 都附带了引用输出的具体证据",
    hint: "不给「善意推定」的通过。",
    docSlug: "evaluating-skills",
  },
  {
    group: "评估",
    label: "记录了 timing.json 并汇总出 benchmark 的 delta",
    hint: "同时看成本（时间/token）与收益（通过率）。",
    docSlug: "evaluating-skills",
  },
  {
    group: "脚本",
    label: "脚本完全非交互，缺失参数时立即报错并给用法",
    hint: "agent 运行在非交互 shell，任何等待输入都会永久挂起。",
    docSlug: "using-scripts",
  },
  {
    group: "脚本",
    label: "提供了简洁的 --help，包含参数、默认值与示例",
    hint: "这段文本会占用 agent 的上下文。",
    docSlug: "using-scripts",
  },
  {
    group: "脚本",
    label: "错误信息说明了哪里错、期望什么、下一步试什么",
    hint: "错误信息就是 agent 自我纠正的接口。",
    docSlug: "using-scripts",
  },
  {
    group: "脚本",
    label: "结构化数据走 stdout，诊断信息走 stderr",
    hint: "让 agent 拿到干净可解析的输出，同时保留诊断。",
    docSlug: "using-scripts",
  },
  {
    group: "脚本",
    label: "破坏性操作提供 --dry-run，或要求 --confirm/--force",
    hint: "并结合幂等设计，因为 agent 会重试。",
    docSlug: "using-scripts",
  },
  {
    group: "脚本",
    label: "输出体积可预测（默认汇总/限额，支持 --offset 或 --output）",
    hint: "很多 harness 会在 10-30K 字符处截断工具输出。",
    docSlug: "using-scripts",
  },
];
