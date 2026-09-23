"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveAttempt } from "@/lib/store";

export type QuizCard = {
  id: number;
  docSlug: string;
  docTitleZh: string;
  difficulty: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanationZh: string;
};

type Result = { questionId: number; chosenIndex: number; correct: boolean };

/** 按权重不放回抽样：权重越高越先被抽出。 */
function weightedSample<T>(items: T[], weightOf: (item: T) => number, count: number): T[] {
  const pool = items.map((item) => ({ item, weight: Math.max(1, weightOf(item)) }));
  const picked: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i += 1) {
    const total = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let r = Math.random() * total;
    let index = 0;
    for (let j = 0; j < pool.length; j += 1) {
      r -= pool[j].weight;
      if (r <= 0) {
        index = j;
        break;
      }
    }
    picked.push(pool[index].item);
    pool.splice(index, 1);
  }
  return picked;
}

export function QuizRunner({
  bank,
  docOptions,
  weights,
  recordSlug,
  lockScope = false,
  initialScope,
}: {
  bank: QuizCard[];
  docOptions: { slug: string; titleZh: string }[];
  weights?: Record<number, number>;
  recordSlug?: string;
  lockScope?: boolean;
  /** 初始选中的文档范围（来自 URL 等外部入口），缺省为 "all"。 */
  initialScope?: string;
}) {
  const [scope, setScope] = useState(initialScope ?? "all");
  const [size, setSize] = useState("8");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<{ correct: number; total: number; results: Result[] } | null>(null);

  const pool = useMemo(() => {
    const list = scope === "all" ? bank : bank.filter((item) => item.docSlug === scope);
    return list;
  }, [bank, scope]);

  // 题目在挂载后抽取：初始为空数组，保证服务端与客户端首屏渲染一致，避免 hydration 不一致
  const [questions, setQuestions] = useState<QuizCard[]>([]);

  /** 随机抽题。包含 Math.random，只能在事件回调或 effect 中调用，不能参与渲染。 */
  function sampleQuestions(currentScope: string, currentSize: string): QuizCard[] {
    const list = currentScope === "all" ? bank : bank.filter((item) => item.docSlug === currentScope);
    const count = currentSize === "all" ? list.length : Math.min(Number(currentSize), list.length);
    if (weights) return weightedSample(list, (item) => weights[item.id] ?? 1, count);
    return [...list].sort(() => Math.random() - 0.5).slice(0, count);
  }

  // 首次进入时抽一轮题
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 随机源仅在客户端挂载后可用
    setQuestions(sampleQuestions(scope, size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const answeredCount = Object.keys(answers).length;
  const resultMap = useMemo(
    () => new Map((submitted?.results ?? []).map((row) => [row.questionId, row])),
    [submitted],
  );

  function submit() {
    // 本地判分：正确答案就在题卡里，判分与记录都无需请求服务器
    const results: Result[] = questions.map((question) => {
      const chosenIndex = answers[question.id] ?? -1;
      return { questionId: question.id, chosenIndex, correct: chosenIndex === question.answerIndex };
    });
    const { total, correct } = saveAttempt(recordSlug ?? scope, results);
    setSubmitted({ correct, total, results });
  }

  function restart(nextScope = scope, nextSize = size) {
    setAnswers({});
    setSubmitted(null);
    setQuestions(sampleQuestions(nextScope, nextSize));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {!lockScope ? (
        <label className="text-xs text-slate-400">
          <span className="mb-1.5 block uppercase tracking-widest">题目范围</span>
          <select
            value={scope}
            onChange={(event) => {
              const value = event.target.value;
              setScope(value);
              restart(value, size);
            }}
            className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-200 focus:border-indigo-400/50 focus:outline-none"
          >
            <option value="all">全部文档（混合出题）</option>
            {docOptions.map((doc) => (
              <option key={doc.slug} value={doc.slug}>
                {doc.titleZh}
              </option>
            ))}
          </select>
        </label>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
            错题加权模式
          </span>
        )}
        <label className="text-xs text-slate-400">
          <span className="mb-1.5 block uppercase tracking-widest">题量</span>
          <select
            value={size}
            onChange={(event) => {
              const value = event.target.value;
              setSize(value);
              restart(scope, value);
            }}
            className="rounded-lg border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-slate-200 focus:border-indigo-400/50 focus:outline-none"
          >
            {["5", "8", "12", "all"].map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "全部" : `${option} 题`}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => restart()}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
        >
          换一批
        </button>
        <p className="ml-auto text-xs text-slate-500">
          题库共 {pool.length} 题 · 已作答 {answeredCount}/{questions.length}
        </p>
      </div>

      {questions.map((question, index) => {
        const result = resultMap.get(question.id);
        return (
          <div key={question.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-widest text-indigo-300/80">
                第 {index + 1} 题 · {question.docTitleZh}
              </span>
              <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10.5px] text-slate-400">
                {question.difficulty}
              </span>
            </div>
            <p className="mt-2 text-[15px] font-medium leading-7 text-white">{question.prompt}</p>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const chosen = answers[question.id] === optionIndex;
                const isCorrect = question.answerIndex === optionIndex;
                let tone = "border-white/10 bg-white/[0.02] text-slate-300 hover:border-indigo-400/40";
                if (submitted) {
                  if (isCorrect) tone = "border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
                  else if (chosen) tone = "border-rose-400/40 bg-rose-400/10 text-rose-100";
                  else tone = "border-white/10 bg-white/[0.02] text-slate-400";
                } else if (chosen) {
                  tone = "border-indigo-400/50 bg-indigo-400/10 text-white";
                }
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={Boolean(submitted)}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] leading-6 transition disabled:cursor-default ${tone}`}
                  >
                    <span className="mr-2 text-slate-500">{"ABCD"[optionIndex]}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
            {result ? (
              <p
                className={`mt-3 rounded-xl border px-3.5 py-3 text-[13px] leading-6 ${
                  result.correct
                    ? "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-100"
                    : "border-amber-400/30 bg-amber-400/[0.07] text-amber-100"
                }`}
              >
                {result.correct ? "✅ 正确。" : "❌ 不完全是。"}
                {question.explanationZh}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        {submitted ? (
          <>
            <p className="text-sm text-slate-300">
              本轮得分：
              <strong className="text-white">
                {submitted.correct} / {submitted.total}
              </strong>
              （{submitted.total ? Math.round((submitted.correct / submitted.total) * 100) : 0}%）
            </p>
            <button
              type="button"
              onClick={() => restart()}
              className="rounded-lg bg-gradient-to-r from-indigo-400 to-sky-400 px-4 py-2 text-xs font-semibold text-[#0b1020]"
            >
              再来一轮
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={answeredCount === 0}
            onClick={submit}
            className="rounded-lg bg-gradient-to-r from-indigo-400 to-sky-400 px-4 py-2 text-xs font-semibold text-[#0b1020] disabled:opacity-40"
          >
            提交作答（{answeredCount}/{questions.length}）
          </button>
        )}
        <p className="text-xs text-slate-500">
          提交后会记录本轮成绩，用于统计正确率；相同知识点在下一轮会重新洗牌出现。
        </p>
      </div>
    </div>
  );
}

export default QuizRunner;

/**
 * 读取 URL ?scope= 的包装组件：把指定文档排到下拉框第一位并作为初始练习范围。
 * 内部使用 useSearchParams，渲染时必须包在 <Suspense> 中（静态导出要求）。
 */
export function QuizRunnerScoped({
  bank,
  docOptions,
}: {
  bank: QuizCard[];
  docOptions: { slug: string; titleZh: string }[];
}) {
  const urlScope = useSearchParams().get("scope");
  const matched = urlScope ? docOptions.find((doc) => doc.slug === urlScope) : undefined;
  const orderedOptions = matched
    ? [matched, ...docOptions.filter((doc) => doc.slug !== matched.slug)]
    : docOptions;
  return <QuizRunner bank={bank} docOptions={orderedOptions} initialScope={matched?.slug} />;
}
