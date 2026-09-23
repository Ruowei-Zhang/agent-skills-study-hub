"use client";

import { getQuizHistory, getQuizStats, useStudy } from "@/lib/store";

/** 练习页头部的统计徽章：题库规模 + 累计作答 + 正确率 + 轮次。 */
export function QuizStatsBadges({ bankSize }: { bankSize: number }) {
  const state = useStudy();
  const stats = getQuizStats(state);
  return (
    <div className="mt-4 flex flex-wrap gap-3 text-xs">
      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
        题库 {bankSize} 题
      </span>
      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
        累计作答 {stats.answered} 题 · 正确率 {stats.accuracy}%
      </span>
      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
        练习轮次 {stats.attempts}
      </span>
    </div>
  );
}

/** 历史成绩列表：聚合作用域显示为友好名称。 */
export function QuizHistoryList({
  titles,
  limit = 10,
}: {
  titles: Record<string, string>;
  limit?: number;
}) {
  const state = useStudy();
  const history = getQuizHistory(state, limit);

  if (history.length === 0) {
    return <p className="mt-3 text-[13px] text-slate-400">还没有记录。提交一轮作答后这里会显示趋势。</p>;
  }

  return (
    <ul className="mt-3 space-y-2 text-[13px]">
      {history.map((row) => {
        const percent = row.total ? Math.round((row.correct / row.total) * 100) : 0;
        const label =
          titles[row.docSlug] ??
          (row.docSlug === "all" ? "混合练习" : row.docSlug === "wrong" ? "错题重练" : row.docSlug);
        return (
          <li key={row.id} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-slate-400">{label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="w-20 shrink-0 text-right text-slate-300">
              {row.correct}/{row.total}（{percent}%）
            </span>
          </li>
        );
      })}
    </ul>
  );
}
