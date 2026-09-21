import type { DocSeed } from "./types";

export const authoringDocsB: DocSeed[] = [
  {
    slug: "optimizing-descriptions",
    titleZh: "优化技能描述：把触发率变成可测量的指标",
    titleEn: "Optimizing skill descriptions",
    groupKey: "creators",
    groupZh: "技能创作者",
    orderIndex: 6,
    sourceUrl: "https://agentskills.io/skill-creation/optimizing-descriptions",
    summaryZh:
      "描述字段承担全部触发职责。本文给出完整方法：写触发评测查询（正例 + 近似反例）、多次运行计算触发率、用训练/验证切分防止过拟合，最后选出泛化最好的那一版。",
    difficulty: "进阶",
    readMinutes: 16,
    keyPoints: [
      "描述承担 100% 的触发责任，因为它就是元数据阶段唯一被加载的内容。",
      "写法四原则：祈使句、聚焦用户意图、宁可「推一把」（主动列出适用场景）、保持简洁（≤1024 字符）。",
      "评测集约 20 条：8-10 条应触发 + 8-10 条不应触发；最有价值的是「近似反例」。",
      "模型输出不确定，每条查询跑 3 次算触发率；应触发项 >0.5 算通过，不应触发项 <0.5 算通过。",
      "必须切分训练集（约 60%）与验证集（约 40%），只用训练集失败来改描述，用验证集确认是否泛化。",
      "不要往描述里塞失败查询的原词，那是过拟合；要抽象出那类查询代表的通用概念。",
      "迭代 5 轮通常足够；最终选择的应是验证集通过率最高的一版，而不一定是最后一版。",
    ],
    tags: ["描述", "评测", "触发率", "过拟合"],
    sections: [
      {
        anchor: "how-triggering-works",
        headingZh: "触发机制：描述决定一切",
        headingEn: "How skill triggering works",
        contentZh:
          "启动时 agent 只加载每个技能的 [[name]] 与 [[description]]，用它们决定「这个技能是否可能相关」。任务匹配到描述后，才把完整 SKILL.md 读进上下文。**这意味着描述承担了全部触发职责**：如果它没能传达「什么时候有用」，agent 就不知道要去取它。\n\n一个重要的细节：agent 通常**只为超出自身能力的任务去查技能**。像「读一下这个 PDF」这种一步就能完成的小事，即使描述完美匹配，也可能不触发 PDF 技能。真正能体现描述价值的，是需要专门知识的任务：不熟悉的 API、领域特定流程、罕见格式。",
        contentEn:
          "At startup, agents load only the name and description of each available skill. This means the description carries the entire burden of triggering. One important nuance: agents typically only consult skills for tasks that require knowledge or capabilities beyond what they can handle alone.",
      },
      {
        anchor: "writing-effective-descriptions",
        headingZh: "怎么写一条好的描述",
        headingEn: "Writing effective descriptions",
        contentZh:
          "在测试之前，先对齐「好描述」的标准：\n\n- **用祈使句**：[[Use this skill when…]] 而不是 [[This skill does…]]——agent 是在决定「要不要行动」，所以要告诉它何时行动；\n- **聚焦用户意图，而不是实现细节**：描述用户想达成什么，因为 agent 匹配的是用户的诉求；\n- **宁可「推一把」**：明确列出适用场景，包括用户没有直接点名领域的情况，例如「即使用户没有明确提到 CSV 或 analysis」；\n- **保持简洁**：几句话到一小段，长到能覆盖范围，短到不会在几十个技能间膨胀上下文（规范硬上限 1024 字符）。",
        contentEn:
          "Use imperative phrasing. Focus on user intent, not implementation. Err on the side of being pushy. Keep it concise — a few sentences to a short paragraph is usually right to cover the skill's scope without bloating context across many skills.",
      },
      {
        anchor: "designing-eval-queries",
        headingZh: "设计触发评测查询",
        headingEn: "Designing trigger eval queries",
        contentZh:
          "要测触发，就需要一组**带标签的真实用户提示**：[[query]] + [[should_trigger]]。目标是约 20 条：8-10 条应触发、8-10 条不应触发。\n\n**应触发查询**沿几个维度变化：\n\n- 措辞：正式、口语、带错别字或缩写；\n- 显式程度：有的直接点名领域（「分析这个 CSV」），有的只描述需求（「老板想要这张数据文件的图」）；\n- 细节量：从一句话到带文件路径、列名与背景的长消息；\n- 复杂度：单步任务与多步工作流混合，测试技能在长链条中「被埋住」时还能不能触发。\n\n**不应触发查询**里最有价值的是**近似反例**：共享关键词但实际需要别的东西的查询。对 CSV 分析技能来说，弱反例是「写个斐波那契函数」（显然无关，测不出精度），强反例是「更新我的 Excel 预算表公式」（同属表格但有 Excel 编辑需求）或「写个 Python 脚本把 CSV 逐行传到 Postgres」（涉及 CSV，但任务是 ETL 不是分析）。",
        contentEn:
          "Aim for about 20 queries: 8-10 that should trigger and 8-10 that shouldn't. The most valuable negative test cases are near-misses — queries that share keywords or concepts with your skill but actually need something different.",
      },
      {
        anchor: "realism",
        headingZh: "真实感细节",
        headingEn: "Tips for realism",
        contentZh:
          "真实用户的提示里带着通用测试查询没有的上下文，建议在评测集里刻意加入：\n\n- 文件路径，例如 [[~/Downloads/report_final_v2.xlsx]]（注意真实感：v2、final 这类命名）；\n- 个人语境，例如「我经理让我……」；\n- 具体细节：列名、公司名、数据值；\n- 口语、缩写，以及偶尔的错别字。\n\n这些细节是**测试描述鲁棒性的关键**：如果描述只在「教科书式表述」下触发，它在真实使用中的触发率会明显偏低。",
        contentEn:
          "Real user prompts contain context that generic test queries lack: file paths, personal context, specific details, casual language, abbreviations, and occasional typos.",
      },
      {
        anchor: "testing-triggering",
        headingZh: "怎么测：触发率与多次运行",
        headingEn: "Testing whether a description triggers",
        contentZh:
          "基本做法：把技能装到 agent 里，逐条跑查询，观察 agent 是否调用了该技能。不同客户端的注册方式不同（目录、配置文件、CLI 参数），多数客户端会通过日志、工具调用历史或 verbose 输出提供可观测性——**用技能加载与否来判断触发**。\n\n单条查询的判定：[[should_trigger === true]] 且被调用 → 通过；[[should_trigger === false]] 且未被调用 → 通过。\n\n因为模型行为不确定，同一查询在不同运行时可能结果不同，所以要**每条跑多次**（3 次是合理起点）并计算**触发率**（被调用次数 / 运行次数）：应触发查询触发率高于阈值（0.5 是合理默认）算通过，不应触发查询低于阈值算通过。20 条 × 3 次 = 60 次调用，必须脚本化。",
        contentEn:
          "Run each query multiple times (3 is a reasonable starting point) and compute a trigger rate: the fraction of runs where the skill was invoked. A should-trigger query passes if its trigger rate is above a threshold (0.5 is a reasonable default).",
      },
      {
        anchor: "train-validation",
        headingZh: "用训练/验证切分避免过拟合",
        headingEn: "Avoiding overfitting with train/validation splits",
        contentZh:
          "如果你对**全部**查询同时优化，很容易过拟合：造出一条只对这批措辞有效、遇到新说法就失效的描述。解法是切分：\n\n- **训练集（约 60%）**：用来定位失败、指导改动；\n- **验证集（约 40%）**：只用来检查改进是否泛化，不参与决策。\n\n注意两点：两组都要**按比例保留正反例**，不要不小心把所有应触发查询都放进同一组；切分要随机但**固定**，这样多轮迭代之间才可比。如果用的是脚本方案，可以拆成 [[train_queries.json]] 与 [[validation_queries.json]] 分别跑。",
        contentEn:
          "Train set (~60%): the queries you use to identify failures and guide improvements. Validation set (~40%): queries you set aside and only use to check whether improvements generalize. Shuffle randomly and keep the split fixed across iterations.",
      },
      {
        anchor: "optimization-loop",
        headingZh: "优化循环（5 步）",
        headingEn: "The optimization loop",
        contentZh:
          "1. **评估**当前描述，在训练集与验证集上都跑一遍：训练集结果指导改动，验证集结果判断泛化；\n2. **定位失败**（只用训练集）：哪些应触发没触发？哪些不应触发却触发了？把验证集结果排除在改动决策之外；\n3. **修订描述**，核心是泛化：\n   - 应触发项失败 → 描述可能太窄，放宽范围或补充适用上下文；\n   - 不应触发项误触发 → 描述可能太宽，明确写出「不做什么」或划清与相邻能力的边界；\n   - **不要塞入失败查询里的具体关键词**，那是过拟合；应抽象出这些查询代表的通用类别或概念；\n   - 迭代几轮仍无进展时，尝试**结构性改变**（换框架、换句式），而不是继续微调措辞；\n   - 留意 1024 字符上限——优化过程中描述会越改越长。\n4. **重复** 1-3，直到训练集查询全部通过或不再有明显提升；\n5. **按验证集通过率挑选最佳版本**——最佳版本不一定是最后一版，之前的某版可能因为更不过拟合而泛化更好。\n\n经验值：**5 轮通常足够**。如果没有提升，问题可能出在查询集本身（太易、太难、标注错误），而不是描述。",
        contentEn:
          "1. Evaluate the current description on both train and validation sets. 2. Identify failures in the train set. 3. Revise the description, focusing on generalizing. 4. Repeat until all train set queries pass. 5. Select the best iteration by its validation pass rate. Five iterations is usually enough.",
      },
      {
        anchor: "applying-the-result",
        headingZh: "落地与最终检查",
        headingEn: "Applying the result",
        contentZh:
          "选定最佳描述后：\n\n1. 把 [[description]] 写回 SKILL.md 的 frontmatter；\n2. 确认长度仍在 1024 字符以内；\n3. 验证触发行为——手动试几句做快速抽检；更严谨的做法是**新写 5-10 条查询**（正反例混合）跑一遍脚本，因为这些查询从未参与优化，能给出诚实的泛化判断。\n\n文档给出的前后对比很能说明方向：好的描述**更具体地说明能力**（summary stats、derived columns、charts、cleaning），同时**更宽泛地说明适用场景**（CSV、TSV、Excel；即使用户没点名关键词）；而旧版只是一句 [[Process CSV files.]]。",
        contentEn:
          "1. Update the description field in your SKILL.md frontmatter. 2. Verify the description is under the 1024-character limit. 3. Verify the description triggers as expected. The improved description is more specific about what the skill does and broader about when it applies.",
      },
      {
        anchor: "next-steps",
        headingZh: "下一步",
        headingEn: "Next steps",
        contentZh:
          "触发稳定之后，就该回答第二个问题：技能产出的质量是否真的更好？转向『评估技能输出质量』，搭建测试用例、写断言、打分、按迭代循环改进。",
        contentEn:
          "Once your skill triggers reliably, you'll want to evaluate whether it produces good outputs. See Evaluating skill output quality.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "designing-eval-queries",
        title: "eval_queries.json 的结构",
        lang: "json",
        code: `[
  { "query": "I've got a spreadsheet in ~/data/q4_results.xlsx with revenue in col C and expenses in col D — can you add a profit margin column and highlight anything under 10%?", "should_trigger": true },
  { "query": "whats the quickest way to convert this json file to yaml", "should_trigger": false }
]`,
        noteZh: "每条查询一个 should_trigger 标签；正例带真实上下文，反例与技能概念相近但需求不同。",
      },
      {
        sectionAnchor: "testing-triggering",
        title: "触发率测试脚本（Claude Code 版，可替换检测逻辑）",
        lang: "bash",
        code: `#!/bin/bash
QUERIES_FILE="\${1:?Usage: $0 <queries.json>}"
SKILL_NAME="my-skill"
RUNS=3

# This example uses Claude Code's JSON output to check for Skill tool calls.
# Replace this function with detection logic for your agent client.
# Should return 0 (success) if the skill was invoked, 1 otherwise.
check_triggered() {
  local query="$1"
  claude -p "$query" --output-format json 2>/dev/null \\
    | jq -e --arg skill "$SKILL_NAME" \\
      'any(.messages[].content[]; .type == "tool_use" and .name == "Skill" and .input.skill == $skill)' \\
      > /dev/null 2>&1
}

count=$(jq length "$QUERIES_FILE")
for i in $(seq 0 $((count - 1))); do
  query=$(jq -r ".[$i].query" "$QUERIES_FILE")
  should_trigger=$(jq -r ".[$i].should_trigger" "$QUERIES_FILE")
  triggers=0

  for run in $(seq 1 $RUNS); do
    check_triggered "$query" && triggers=$((triggers + 1))
  done

  jq -n \\
    --arg query "$query" \\
    --argjson should_trigger "$should_trigger" \\
    --argjson triggers "$triggers" \\
    --argjson runs "$RUNS" \\
    '{query: $query, should_trigger: $should_trigger, triggers: $triggers, runs: $runs, trigger_rate: ($triggers / $runs)}'
done | jq -s '.'`,
        noteZh: "把 check_triggered 换成你所用客户端的检测方式；核心是「多次运行 → 算触发率」。",
      },
      {
        sectionAnchor: "applying-the-result",
        title: "描述优化前后对比",
        lang: "yaml",
        code: `# Before
description: Process CSV files.

# After
description: >
  Analyze CSV and tabular data files — compute summary statistics,
  add derived columns, generate charts, and clean messy data. Use this
  skill when the user has a CSV, TSV, or Excel file and wants to
  explore, transform, or visualize the data, even if they don't
  explicitly mention "CSV" or "analysis."`,
        noteZh: "能力更明确（做什么）、场景更宽（何时用），并主动覆盖用户不点名关键词的情况。",
      },
    ],
  },
  {
    slug: "evaluating-skills",
    titleZh: "评估技能输出质量：从「感觉能用」到「可证明更好」",
    titleEn: "Evaluating skill output quality",
    groupKey: "creators",
    groupZh: "技能创作者",
    orderIndex: 7,
    sourceUrl: "https://agentskills.io/skill-creation/evaluating-skills",
    summaryZh:
      "完整评测流程：设计测试用例（evals.json）、with/without 双跑对比、写可验证断言、逐条打分（grading.json）、汇总基准（benchmark.json 的 delta）、做模式分析、人工复核，然后进入迭代循环。",
    difficulty: "深入",
    readMinutes: 20,
    keyPoints: [
      "测试用例三要素：真实感 Prompt、人类可读的期望输出、可选的输入文件。",
      "核心模式是每条用例跑两次：with_skill 与 without_skill（改进已有技能时用旧版本快照作基线）。",
      "每次运行必须是干净上下文，避免上一轮状态污染；有子代理的客户端天然具备隔离。",
      "断言要可程序化验证、具体可观测、可计数；避免「输出是好的」这种空话，也避免逐字匹配这种脆弱断言。",
      "打分必须给具体证据（引用输出内容），不能「倾向于相信它是对的」。",
      "benchmark.json 的 delta 告诉你技能的成本（时间、token）与收益（通过率）。",
      "四类模式分析：两种情况都通过的断言（删掉）、都失败的断言（修）、加技能后才通过的（理解原因）、跨运行不稳定的（加约束降歧义）。",
      "人工复核能发现断言覆盖不到的「技术正确但没意义」问题；迭代时给 LLM 三条准则：泛化、保持精简、解释「为什么」。",
    ],
    tags: ["评测", "断言", "基线对比", "迭代"],
    sections: [
      {
        anchor: "designing-test-cases",
        headingZh: "设计测试用例",
        headingEn: "Designing test cases",
        contentZh:
          "一条测试用例由三部分组成：\n\n- **Prompt**：真实感的用户消息——像真人会打出来的那种；\n- **Expected output**：人类可读的成功描述（这一阶段先不写机械断言）；\n- **Input files（可选）**：技能需要用到的文件。\n\n用例统一放在技能目录下的 [[evals/evals.json]]。\n\n写 Prompt 的四条建议：\n\n- **先写 2-3 条**，在看到第一轮结果前不要过度投入，之后再扩充；\n- **措辞要多样**：不同表达、不同详细程度、不同正式度，既有口语（「hey can you clean up this csv」）也有精确（「Parse the CSV at data/input.csv, drop rows where column B is null, and write the result to data/output.csv」）；\n- **覆盖边界情况**：至少一条测试边界——畸形输入、异常请求，或技能指令本身可能有歧义的情况；\n- **用真实上下文**：真实用户会说文件路径、列名和个人背景，「process this data」这种过于模糊的提示什么都测不出来。",
        contentEn:
          "A test case has three parts: a realistic user message, a human-readable description of what success looks like, and optional input files. Store test cases in evals/evals.json inside your skill directory. Start with 2-3 test cases, vary the prompts, and cover edge cases.",
      },
      {
        anchor: "running-evals",
        headingZh: "运行评测：with / without 双跑",
        headingEn: "Running evals",
        contentZh:
          "核心模式是**每条用例跑两次**：一次**带技能**，一次**不带技能**（或带旧版本）。这样才能得到可比较的基线。\n\n工作区结构与技能目录并列：每一轮完整迭代一个 [[iteration-N/]] 目录；内部每条用例一个评测目录，再分 [[with_skill/]] 与 [[without_skill/]] 两个子目录。每个目录里有产出文件 [[outputs/]]、耗时 [[timing.json]] 与打分结果 [[grading.json]]；整轮汇总写入 [[benchmark.json]]。\n\n**唯一手写的文件是 [[evals/evals.json]]**——其余 JSON 都由 agent、脚本或你在评测过程中产出。",
        contentEn:
          "The core pattern is to run each test case twice: once with the skill and once without it (or with a previous version). The main file you author by hand is evals/evals.json. The other JSON files (grading.json, timing.json, benchmark.json) are produced during the eval process.",
      },
      {
        anchor: "spawning-runs",
        headingZh: "干净上下文与基线快照",
        headingEn: "Spawning runs",
        contentZh:
          "每次评测运行都应当从**干净上下文**开始：不带上一轮遗留的状态，也不带技能开发过程中的对话。这样才能保证 agent 的行为只来自 SKILL.md 的指令，而不是被之前的对话「带着走」。有子代理能力的客户端（如 Claude Code）天然满足这一点：子任务默认全新开始；没有子代理时，用**独立会话**代替。\n\n每次运行要给 agent 提供四样东西：技能路径（基线运行则不给）、测试 Prompt、输入文件、输出目录。\n\n改进已有技能时，基线用**旧版本快照**：编辑前先 [[cp -r <skill-path> <workspace>/skill-snapshot/]]，让基线运行指向快照，结果写入 [[old_skill/outputs/]] 而不是 [[without_skill/]]。",
        contentEn:
          "Each eval run should start with a clean context — no leftover state from previous runs or from the skill development process. When improving an existing skill, use the previous version as your baseline: snapshot it before editing, point the baseline run at the snapshot, and save to old_skill/outputs/.",
      },
      {
        anchor: "timing-data",
        headingZh: "记录耗时与 token",
        headingEn: "Capturing timing data",
        contentZh:
          "时间数据能回答一个关键问题：**技能相对基线要花多少额外成本**。[[timing.json]] 记录总 token 数与毫秒耗时。\n\n这决定了成本效益判断：一个把输出质量大幅提高但 token 翻三倍的技能，与一个既更好又更便宜的技能，是完全不同的取舍。没有时间数据，你就无法在两者之间做有依据的选择。",
        contentEn:
          "Timing data lets you compare how much time and tokens the skill costs relative to the baseline — a skill that dramatically improves output quality but triples token usage is a different trade-off than one that's both better and cheaper.",
      },
      {
        anchor: "writing-assertions",
        headingZh: "编写断言",
        headingEn: "Writing assertions",
        contentZh:
          "断言是**关于输出应当满足什么的可验证陈述**，在第一轮输出看到之后再补写——因为「好」长什么样，往往要等技能真的跑过才知道。\n\n好的断言：\n\n- 「输出文件是合法 JSON」——可程序化验证；\n- 「柱状图的坐标轴有标签」——具体且可观察；\n- 「报告至少包含 3 条建议」——可计数。\n\n弱的断言：\n\n- 「输出是好的」——无法打分；\n- 「输出使用完全一致的措辞 Total Revenue: $X」——太脆弱，换个正确措辞就会失败。\n\n另外要接受：**并非所有内容都该有断言**。写作风格、视觉设计、整体「感觉对不对」很难拆成 pass/fail；这类质量交给人工复核，断言只留给你能客观检查的东西。",
        contentEn:
          "Assertions are verifiable statements about what the output should contain or achieve. Good assertions are programmatically verifiable, specific and observable, or countable. Reserve assertions for things that can be checked objectively.",
      },
      {
        anchor: "grading",
        headingZh: "打分（grading）",
        headingEn: "Grading outputs",
        contentZh:
          "打分就是**逐条断言对照真实产出，记录 PASS / FAIL 并给出具体证据**。证据要引用或指向输出内容，而不是陈述观点。最简做法是把输出与断言一起交给 LLM 逐条判断；对能机械检查的断言（JSON 是否合法、行数是否正确、文件是否存在且尺寸符合预期）**优先用校验脚本**——比 LLM 判断可靠，而且能跨迭代复用。\n\n两条打分原则：\n\n- **PASS 必须有具体证据**，不给「善意推定」。断言说「包含摘要」而输出里只有一节标题加一句空话，那是 FAIL——标题在，实质不在；\n- **同时复核断言本身**，不只复核结果。注意哪些断言太容易（无论技能好坏都通过）、太难（输出很好也过不了）、或不可验证（仅凭输出无法判断）。这些要在下一轮修掉。",
        contentEn:
          "Grading means evaluating each assertion against the actual outputs and recording PASS or FAIL with specific evidence. Require concrete evidence for a PASS. Don't give the benefit of the doubt. While grading, review the assertions themselves, not just the results.",
      },
      {
        anchor: "aggregating",
        headingZh: "汇总结果（benchmark 与 delta）",
        headingEn: "Aggregating results",
        contentZh:
          "本轮所有运行打分完毕后，按配置计算汇总统计，与评测目录并列写入 [[benchmark.json]]：每种配置的通过率、耗时、token 的均值与标准差，以及 [[delta]]（带技能减基线的差值）。\n\n[[delta]] 同时说明**成本**与**收益**：一个技能多花 13 秒但通过率提升 50 个百分点，多半值得；另一个 token 翻倍只换来 2 个百分点的提升，就未必。这也是为什么 token 均值要按运行次数做归一化处理——文档示例里 with_skill 均值 3800 是单次量级，而 timing.json 的 84852 是整轮累计，两者口径不同，比较时要用同一口径。",
        contentEn:
          "Compute summary statistics per configuration and save them to benchmark.json. The delta tells you what the skill costs (more time, more tokens) and what it buys (higher pass rate).",
      },
      {
        anchor: "analyzing-patterns",
        headingZh: "模式分析：四种典型信号",
        headingEn: "Analyzing patterns",
        contentZh:
          "汇总统计会掩盖重要模式，所以还要逐条看断言：\n\n- **两种配置都通过的断言**：删掉或替换。它们不提供信息（模型本来就会），只是在抬高 with-skill 通过率，制造「技能很有用」的假象；\n- **两种配置都失败的断言集**：要么断言写坏了（要求模型做不到的事），要么用例太难，要么检查了错误的东西。下一轮前修掉；\n- **加技能才通过、不加就失败的断言**：这是技能在真正创造价值的地方。要去理解**为什么**——是哪条指令或哪个脚本起了作用；\n- **跨运行结果不一致的断言**（benchmark 里 stddev 高）：可能评测本身脆弱（受模型随机性影响），也可能技能指令有歧义，导致模型每次理解不同。加示例或更具体的指引来降低歧义；\n- **时间/token 离群**：某条用例耗时是其他的 3 倍时，去读它的**执行轨迹**（模型在整轮里做了什么的完整日志）找瓶颈。",
        contentEn:
          "Remove or replace assertions that always pass in both configurations. Investigate assertions that always fail in both configurations. Study assertions that pass with the skill but fail without. Tighten instructions when results are inconsistent across runs. Check time and token outliers.",
      },
      {
        anchor: "human-review",
        headingZh: "人工复核",
        headingEn: "Reviewing results with a human",
        contentZh:
          "断言打分 + 模式分析能覆盖不少问题，但它们**只检查你想到要写断言的东西**。人工复核带来的是新鲜视角：发现你没预料到的问题、注意到「技术上正确但没抓住重点」的输出、或识别很难表达成 pass/fail 的毛病。\n\n做法是逐条看真实产出与打分，把具体反馈写进 [[feedback.json]]（与评测目录并列）。关键是反馈要**可执行**：「图表缺少坐标轴标签」可执行，「看起来不好」不可执行。**空反馈意味着该用例看起来没问题**；迭代时把改进集中在有具体抱怨的用例上。",
        contentEn:
          "For each test case, review the actual outputs alongside the grades. Record specific feedback for each test case. \"The chart is missing axis labels\" is actionable; \"looks bad\" is not. Empty feedback means the output looked fine.",
      },
      {
        anchor: "iterating",
        headingZh: "迭代：三类信号 + 四条改写准则",
        headingEn: "Iterating on the skill",
        contentZh:
          "打分与复核后你手上有三类信号：\n\n- **失败断言** → 指向具体缺口：缺步骤、指令不清、未处理的场景；\n- **人工反馈** → 指向更宽的质量问题：方法错了、结构差、结果没用；\n- **执行轨迹** → 揭示**为什么**出错：agent 忽略某条指令说明指令有歧义；agent 花了时间在低产步骤上，说明那些指令该简化或删除。\n\n最有效的用法是把三类信号与当前 SKILL.md 一起交给 LLM，让它提出修改建议——它能综合出人工很难手动关联的跨用例模式。提示 LLM 时给出四条准则：\n\n- **从反馈中泛化**：技能会面对很多提示，不只测试用例；修根因而不要为具体例子打补丁；\n- **保持精简**：更少但更好的指令往往胜过穷举规则。轨迹显示有浪费（多余的校验、无用的中间产物）就删掉那些指令；加规则后通过率不再上升，说明技能已被过度约束，试试删规则；\n- **解释「为什么」**：「做 X，因为 Y 会导致 Z」比「永远做 X、绝不 Y」更有效，模型理解目的后执行更可靠；\n- **打包重复工作**：如果每次测试运行都要独立写一个相似辅助脚本，就该把它打包进 [[scripts/]]。\n\n**循环**：给信号 + SKILL.md 让 LLM 提议 → 复核并落地 → 在 [[iteration-<N+1>/]] 重跑全部用例 → 打分与汇总 → 人工复核 → 重复。停止条件：结果满意、反馈持续为空，或轮次之间不再有实质提升。",
        contentEn:
          "Three sources of signal: failed assertions, human feedback, and execution transcripts. Give all three — along with the current SKILL.md — to an LLM and ask it to propose changes. Generalize from feedback. Keep the skill lean. Explain the why. Bundle repeated work.",
      },
    ],
    snippets: [
      {
        sectionAnchor: "designing-test-cases",
        title: "evals/evals.json（两条真实感用例）",
        lang: "json",
        code: `{
  "skill_name": "csv-analyzer",
  "evals": [
    {
      "id": 1,
      "prompt": "I have a CSV of monthly sales data in data/sales_2025.csv. Can you find the top 3 months by revenue and make a bar chart?",
      "expected_output": "A bar chart image showing the top 3 months by revenue, with labeled axes and values.",
      "files": ["evals/files/sales_2025.csv"]
    },
    {
      "id": 2,
      "prompt": "there's a csv in my downloads called customers.csv, some rows have missing emails — can you clean it up and tell me how many were missing?",
      "expected_output": "A cleaned CSV with missing emails handled, plus a count of how many were missing.",
      "files": ["evals/files/customers.csv"]
    }
  ]
}`,
        noteZh: "一条正式精确、一条口语随意，覆盖不同表达风格。",
      },
      {
        sectionAnchor: "running-evals",
        title: "工作区目录结构",
        lang: "text",
        code: `csv-analyzer/
├── SKILL.md
└── evals/
    └── evals.json
csv-analyzer-workspace/
└── iteration-1/
    ├── eval-top-months-chart/
    │   ├── with_skill/
    │   │   ├── outputs/       # Files produced by the run
    │   │   ├── timing.json    # Tokens and duration
    │   │   └── grading.json   # Assertion results
    │   └── without_skill/
    │       ├── outputs/
    │       ├── timing.json
    │       └── grading.json
    ├── eval-clean-missing-emails/
    │   ├── with_skill/
    │   └── without_skill/
    └── benchmark.json         # Aggregated statistics`,
        noteZh: "技能目录与工作区并列；每轮迭代一个目录，每条用例 with/without 双份。",
      },
      {
        sectionAnchor: "spawning-runs",
        title: "给单次 with_skill 运行的指令模板",
        lang: "text",
        code: `Execute this task:
- Skill path: /path/to/csv-analyzer
- Task: I have a CSV of monthly sales data in data/sales_2025.csv.
  Can you find the top 3 months by revenue and make a bar chart?
- Input files: evals/files/sales_2025.csv
- Save outputs to: csv-analyzer-workspace/iteration-1/eval-top-months-chart/with_skill/outputs/`,
        noteZh: "基线运行把 Skill path 去掉、输出目录改成 without_skill/ 即可。",
      },
      {
        sectionAnchor: "timing-data",
        title: "timing.json",
        lang: "json",
        code: `{
  "total_tokens": 84852,
  "duration_ms": 23332
}`,
        noteZh: "记录 token 与耗时；benchmark 里的均值是单次量级，不要与累计值混用。",
      },
      {
        sectionAnchor: "writing-assertions",
        title: "带断言的 evals/evals.json",
        lang: "json",
        code: `{
  "skill_name": "csv-analyzer",
  "evals": [
    {
      "id": 1,
      "prompt": "I have a CSV of monthly sales data in data/sales_2025.csv. Can you find the top 3 months by revenue and make a bar chart?",
      "expected_output": "A bar chart image showing the top 3 months by revenue, with labeled axes and values.",
      "files": ["evals/files/sales_2025.csv"],
      "assertions": [
        "The output includes a bar chart image file",
        "The chart shows exactly 3 months",
        "Both axes are labeled",
        "The chart title or caption mentions revenue"
      ]
    }
  ]
}`,
        noteZh: "四条断言都可观察/可计数——这才是断言该有的样子。",
      },
      {
        sectionAnchor: "grading",
        title: "grading.json（含证据与汇总）",
        lang: "json",
        code: `{
  "assertion_results": [
    {
      "text": "The output includes a bar chart image file",
      "passed": true,
      "evidence": "Found chart.png (45KB) in outputs directory"
    },
    {
      "text": "Both axes are labeled",
      "passed": false,
      "evidence": "Y-axis is labeled 'Revenue ($)' but X-axis has no label"
    }
  ],
  "summary": {
    "passed": 3,
    "failed": 1,
    "total": 4,
    "pass_rate": 0.75
  }
}`,
        noteZh: "每个 PASS/FAIL 都要引用输出里的具体内容作为证据。",
      },
      {
        sectionAnchor: "aggregating",
        title: "benchmark.json（含 delta）",
        lang: "json",
        code: `{
  "run_summary": {
    "with_skill": {
      "pass_rate": { "mean": 0.83, "stddev": 0.06 },
      "time_seconds": { "mean": 45.0, "stddev": 12.0 },
      "tokens": { "mean": 3800, "stddev": 400 }
    },
    "without_skill": {
      "pass_rate": { "mean": 0.33, "stddev": 0.10 },
      "time_seconds": { "mean": 32.0, "stddev": 8.0 },
      "tokens": { "mean": 2100, "stddev": 300 }
    },
    "delta": {
      "pass_rate": 0.50,
      "time_seconds": 13.0,
      "tokens": 1700
    }
  }
}`,
        noteZh: "通过率 +50 个百分点换 13 秒和 1700 token——这类取舍需要数据支撑。",
      },
      {
        sectionAnchor: "human-review",
        title: "feedback.json",
        lang: "json",
        code: `{
  "eval-top-months-chart": "The chart is missing axis labels and the months are in alphabetical order instead of chronological.",
  "eval-clean-missing-emails": ""
}`,
        noteZh: "空字符串 = 该用例通过人工复核；有内容 = 迭代改进的重点。",
      },
    ],
  },
  {
    slug: "using-scripts",
    titleZh: "在技能中使用脚本",
    titleEn: "Using scripts in skills",
    groupKey: "creators",
    groupZh: "技能创作者",
    orderIndex: 8,
    sourceUrl: "https://agentskills.io/skill-creation/using-scripts",
    summaryZh:
      "从一次性命令（uvx/npx/pipx）到自包含脚本（PEP 723、Deno、Bun、Ruby），再到「为 agent 而设计脚本」的十条工程规范：禁交互、--help、结构化输出、幂等、dry-run、退出码、输出体积控制。",
    difficulty: "进阶",
    readMinutes: 18,
    keyPoints: [
      "一次性命令适用「几个 flag 就能搞定」的场景，但必须锁版本并声明前置依赖。",
      "复杂命令应下沉为 scripts/ 中经过测试的脚本——一次跑对的概率高得多。",
      "自包含脚本把依赖声明内联：Python 用 PEP 723（# /// 标记）+ uv run，Deno 用 npm:/jsr: specifier，Bun 在 import 路径里锁版本，Ruby 用 bundler/inline。",
      "脚本绝不能有交互式提示：agent 运行在非交互 shell，任何等待输入都会永久挂起。",
      "--help 是 agent 学习接口的主要途径，要简洁（它会占用上下文）。",
      "错误信息要能自我纠正：说清哪里错、期望什么、下一步该试什么。",
      "结构化数据走 stdout，进度与警告走 stderr，让 agent 拿到干净可解析的输出。",
      "其余规范：幂等、严格校验输入、--dry-run、语义化退出码、安全默认（--confirm/--force）、可预测的输出体积（--offset 或强制 --output）。",
    ],
    tags: ["脚本", "CLI 设计", "PEP 723", "agentic 接口"],
    sections: [
      {
        anchor: "one-off-commands",
        headingZh: "一次性命令：优先复用生态工具",
        headingEn: "One-off commands",
        contentZh:
          "当已有包正好能做这件事时，直接在 SKILL.md 里引用它即可，不必自己写 [[scripts/]]。很多生态提供了运行时自动解析依赖的工具：\n\n- **uvx**（Python，需单独安装 uv，缓存激进、重复运行近乎瞬时）；\n- **pipx**（Python，成熟方案，各系统包管理器普遍可用）；\n- **npx**（随 Node.js 附带，无需额外安装，下载后缓存）；\n- **bunx**（Bun 的 npx 等价物，仅适用于装了 Bun 的环境）；\n- **deno run**（可直接从 URL/说明符运行脚本，读写文件需要权限 flag）；\n- **go run**（Go 内置，可直接编译运行包）。\n\n三条经验：**锁版本**（[[npx eslint@9.0.0]]）让行为随时间稳定；**声明前置条件**（「需要 Node.js 18+」）或写进 [[compatibility]] 字段；**命令变复杂就下沉为脚本**。",
        contentEn:
          "When an existing package already does what you need, you can reference it directly in your SKILL.md instructions without a scripts/ directory. Pin versions so the command behaves the same over time. State prerequisites. Move complex commands into scripts.",
      },
      {
        anchor: "referencing-scripts",
        headingZh: "在 SKILL.md 中引用脚本",
        headingEn: "Referencing scripts from SKILL.md",
        contentZh:
          "用**相对于技能目录根**的相对路径引用随包文件，agent 会自动解析，不需要绝对路径。两个动作缺一不可：\n\n1. **列出可用脚本**（清单形式，说明每个脚本做什么），否则 agent 不知道它们存在；\n2. **明确指示如何运行**（在流程步骤里给出完整命令）。\n\n把「有哪些工具」与「什么时候用」放在一起，能让 agent 从「一次性写代码」转向「调用既有能力」——这也是打包脚本的主要收益。",
        contentEn:
          "Use relative paths from the skill directory root to reference bundled files. The agent resolves these paths automatically. List available scripts in your SKILL.md so the agent knows they exist, then instruct the agent to run them.",
      },
      {
        anchor: "self-contained-scripts",
        headingZh: "自包含脚本：把依赖声明内联",
        headingEn: "Self-contained scripts",
        contentZh:
          "需要可复用逻辑时，把脚本放进 [[scripts/]] 并在脚本里**内联声明依赖**，这样 agent 用一条命令就能跑，不需要额外的清单文件或安装步骤：\n\n- **Python（PEP 723）**：在 [[# ///]] 标记内的 TOML 块声明依赖，用 [[uv run scripts/extract.py]] 执行（[[uv]] 会建隔离环境、装依赖、运行）；[[pipx run]] 也支持；用 PEP 508 规范锁版本（[[\"beautifulsoup4>=4.12,<5\"]]），[[requires-python]] 约束 Python 版本，[[uv lock --script]] 生成锁文件；\n- **Deno**：用 [[npm:]] / [[jsr:]] 导入说明符，脚本天然自包含；版本遵循 semver（[[@1.0.0]] 精确、[[@^1.0.0]] 兼容），依赖全局缓存，[[--reload]] 强制重取；带原生插件（node-gyp）的包可能不可用，自带预编译二进制的包最稳；\n- **Bun**：没有 [[node_modules]] 时运行时自动安装缺失包，版本直接写在 import 路径里；不需要 package.json，TypeScript 原生可用；注意如果目录树上层存在 [[node_modules]]，自动安装会被禁用并回退到 Node 解析；\n- **Ruby**：[[bundler/inline]] 在脚本内声明 gem（Ruby 2.6+ 自带 bundler）；显式锁版本（[[gem 'nokogiri', '~> 1.16']]），因为没有锁文件；工作目录里已有的 [[Gemfile]] 或 [[BUNDLE_GEMFILE]] 环境变量可能造成干扰。",
        contentEn:
          "When you need reusable logic, bundle a script in scripts/ that declares its own dependencies inline. Several languages support inline dependency declarations: Python (PEP 723), Deno, Bun and Ruby.",
      },
      {
        anchor: "no-interactive-prompts",
        headingZh: "规范一：禁止交互式提示（硬要求）",
        headingEn: "Avoid interactive prompts",
        contentZh:
          "这是 agent 执行环境的**硬性要求**：agent 运行在非交互 shell 里，无法回应 TTY 提示、密码对话或确认菜单。一个阻塞在交互输入上的脚本会**无限挂起**，把整轮任务卡死。\n\n所有输入都必须通过命令行 flag、环境变量或 stdin 传入。缺失必需参数时，脚本要**立刻报错退出并说明用法**，而不是「提示输入」。文档的对照示例非常直观：坏写法会打印一个等待输入的提示符然后停住；好写法直接报 [[Error: --env is required. Options: development, staging, production.]] 并给出 [[Usage]] 行。",
        contentEn:
          "This is a hard requirement of the agent execution environment. Agents operate in non-interactive shells — they cannot respond to TTY prompts, password dialogs, or confirmation menus. A script that blocks on interactive input will hang indefinitely.",
      },
      {
        anchor: "help-output",
        headingZh: "规范二：用 --help 说明用法",
        headingEn: "Document usage with --help",
        contentZh:
          "[[--help]] 的输出是 **agent 了解脚本接口的主要途径**。内容应包含：简短描述、可用参数、用法示例。\n\n同时要**保持简洁**：这段输出会进入 agent 的上下文窗口，和它手上所有其他内容争抢注意力。一个信息密度高、10-20 行的 help 通常比 60 行的完整手册更有效。",
        contentEn:
          "--help output is the primary way an agent learns your script's interface. Include a brief description, available flags, and usage examples. Keep it concise — the output enters the agent's context window alongside everything else.",
      },
      {
        anchor: "error-messages",
        headingZh: "规范三：写有用的错误信息",
        headingEn: "Write helpful error messages",
        contentZh:
          "agent 拿到错误后，**错误信息的措辞直接决定它的下一次尝试**。含糊的 [[Error: invalid input]] 会白白浪费一轮。好的错误信息要回答三件事：哪里错了、期望什么、接下来该试什么。\n\n文档示例：[[Error: --format must be one of: json, csv, table. Received: \"xml\"]]——同时给出了允许集合、实际收到的值，agent 下一步几乎不需要猜测。这与最佳实践里的「plan-validate-execute」是同一思路：**错误信息即自我纠正的接口**。",
        contentEn:
          "When an agent gets an error, the message directly shapes its next attempt. An opaque \"Error: invalid input\" wastes a turn. Instead, say what went wrong, what was expected, and what to try.",
      },
      {
        anchor: "structured-output",
        headingZh: "规范四：结构化输出与 stdout/stderr 分离",
        headingEn: "Use structured output",
        contentZh:
          "优先输出**结构化格式**（JSON、CSV、TSV）而不是自由文本：结构化格式既能被 agent 消费，也能被 [[jq]]、[[cut]]、[[awk]] 等标准工具处理，从而可以进入管道组合。用空白对齐的人类可读表格很难被程序解析，属于反面做法。\n\n**数据与诊断分离**：结构化数据走 [[stdout]]，进度信息、警告和其他诊断走 [[stderr]]。这样 agent 能拿到干净可解析的输出，同时在需要时仍可访问诊断信息。",
        contentEn:
          "Prefer structured formats — JSON, CSV, TSV — over free-form text. Separate data from diagnostics: send structured data to stdout and progress messages, warnings, and other diagnostics to stderr.",
      },
      {
        anchor: "further-considerations",
        headingZh: "规范五：其余六条工程要点",
        headingEn: "Further considerations",
        contentZh:
          "文档给出的补充清单，几乎每一条都来自「agent 会重试、会误用、会读不懂输出」这个前提：\n\n- **幂等**：agent 可能重试命令，「不存在则创建」比「创建并在重复时报错」安全；\n- **输入约束**：对含糊输入直接报错而不是猜，尽量用枚举与封闭集合；\n- **dry-run**：破坏性或状态性操作提供 [[--dry-run]]，让 agent 先预览将要发生什么；\n- **有意义的退出码**：不同失败类型用不同退出码（未找到、参数错误、鉴权失败），并在 [[--help]] 中说明各码含义；\n- **安全默认**：破坏性操作是否应要求显式确认（[[--confirm]]、[[--force]]），按风险等级决定；\n- **可预测的输出体积**：很多 agent 框架会对工具输出做截断（常见 10-30K 字符），可能丢掉关键信息。潜在输出巨大的脚本应默认汇总或限额，并提供 [[--offset]] 之类的参数按需取更多；如果不能分页，则要求调用方传 [[--output]]（文件路径或 [[-]] 显式选择 stdout）。",
        contentEn:
          "Idempotency. Input constraints. Dry-run support. Meaningful exit codes. Safe defaults. Predictable output size — many agent harnesses automatically truncate tool output beyond a threshold (e.g., 10-30K characters).",
      },
    ],
    snippets: [
      {
        sectionAnchor: "referencing-scripts",
        title: "在 SKILL.md 里列出脚本并给出运行方式",
        lang: "markdown",
        code: `## Available scripts

- scripts/validate.sh — Validates configuration files
- scripts/process.py — Processes input data

## Workflow

1. Run the validation script:
   bash scripts/validate.sh "$INPUT_FILE"

2. Process the results:
   python3 scripts/process.py --input results.json`,
        noteZh: "「有哪些脚本」+「什么时候怎么用」两部分都要写。",
      },
      {
        sectionAnchor: "no-interactive-prompts",
        title: "交互阻塞 vs 立即报错",
        lang: "bash",
        code: `# Bad: hangs waiting for input
$ python scripts/deploy.py
Target environment: _

# Good: clear error with guidance
$ python scripts/deploy.py
Error: --env is required. Options: development, staging, production.
Usage: python scripts/deploy.py --env staging --tag v1.2.3`,
        noteZh: "非交互环境里，等待输入 = 永久挂起；直接报错 + 给用法才是正确姿势。",
      },
      {
        sectionAnchor: "help-output",
        title: "--help 输出示例",
        lang: "text",
        code: `Usage: scripts/process.py [OPTIONS] INPUT_FILE

Process input data and produce a summary report.

Options:
  --format FORMAT    Output format: json, csv, table (default: json)
  --output FILE      Write output to FILE instead of stdout
  --verbose          Print progress to stderr

Examples:
  scripts/process.py data.csv
  scripts/process.py --format csv --output report.csv data.csv`,
        noteZh: "简洁、包含默认值与示例——这段文本会占用 agent 的上下文。",
      },
      {
        sectionAnchor: "error-messages",
        title: "自我纠正型错误信息",
        lang: "text",
        code: `Error: --format must be one of: json, csv, table.
       Received: "xml"`,
        noteZh: "列出允许集合与实际取值，agent 无需再猜。",
      },
      {
        sectionAnchor: "structured-output",
        title: "结构化输出 vs 空白对齐",
        lang: "text",
        code: `# Whitespace-aligned — hard to parse programmatically
NAME          STATUS    CREATED
my-service    running   2025-01-15

# Delimited — unambiguous field boundaries
{"name": "my-service", "status": "running", "created": "2025-01-15"}`,
        noteZh: "能用 jq/cut/awk 处理的输出，才能进入管道组合。",
      },
      {
        sectionAnchor: "self-contained-scripts",
        title: "Python：PEP 723 内联依赖",
        lang: "python",
        code: `# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "beautifulsoup4>=4.12,<5",
#   "requests",
# ]
# ///

import requests
from bs4 import BeautifulSoup

# ... script body ...

# Run with: uv run scripts/extract.py`,
        noteZh: "用 uv run（或 pipx run）执行，隔离环境 + 自动装依赖。",
      },
      {
        sectionAnchor: "self-contained-scripts",
        title: "Deno 与 Bun：在导入路径里锁版本",
        lang: "typescript",
        code: `// Deno — scripts/extract.ts
import { parse } from "npm:node-html-parser@1.0.0";
import { walk } from "jsr:@std/fs@^1.0.0/walk";

// Bun — scripts/extract.ts
import { parse } from "node-html-parser@1.0.0";`,
        noteZh: "Deno 用 npm:/jsr: 说明符，Bun 在没有 node_modules 时自动安装并全局缓存。",
      },
      {
        sectionAnchor: "self-contained-scripts",
        title: "Ruby：bundler/inline",
        lang: "ruby",
        code: `require "bundler/inline"

gemfile do
  source "https://rubygems.org"
  gem "nokogiri", "~> 1.16"
end

# ... script body ...`,
        noteZh: "Ruby 2.6+ 自带 bundler；注意没有锁文件，版本要显式锁定。",
      },
    ],
  },
];
