import Link from "next/link";
import { QuizRunner, type QuizCard } from "@/components/QuizRunner";
import { getWrongQuestions, getWrongSummary } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "错题本 · Agent Skills 学习中心",
  description: "把做错过的题目集中重练：按错误次数加权出题，附正确答案与解析。",
};

export default async function ReviewPage() {
  const [wrong, summary] = await Promise.all([getWrongQuestions(), getWrongSummary()]);

  const cards: QuizCard[] = wrong.map((question) => ({
    id: question.id,
    docSlug: question.docSlug,
    docTitleZh: question.docTitleZh,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options: question.options,
    answerIndex: question.answerIndex,
    explanationZh: question.explanationZh,
  }));

  const weights: Record<number, number> = {};
  for (const question of wrong) weights[question.id] = question.wrongCount;

  const accuracy =
    summary.attemptedQuestions > 0
      ? Math.round(
          ((summary.attemptedQuestions - summary.wrongQuestions) / summary.attemptedQuestions) * 100,
        )
      : 0;

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">错题本：专攻你答错过的题</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          这里汇总你在刻意练习中<b className="text-slate-200">答错过</b>的题目，按错误次数排序。下方可以直接「错题重练」——
          错得越多的题出现概率越高（加权抽题），用来把薄弱点练熟。数据来自你的历史作答明细，无需额外记录。
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            错题 {summary.wrongQuestions} 道
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            累计答错 {summary.wrongTotal} 次
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            已练题目 {summary.attemptedQuestions} 道
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            一次通过率 {accuracy}%
          </span>
        </div>
      </header>

      {wrong.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-4xl">🎉</p>
          <p className="mt-3 text-sm text-slate-200">目前没有错题。</p>
          <p className="mt-2 text-[13px] text-slate-400">
            还没有作答记录，或者你还没有答错过题。先去
            <Link href="/quiz" className="mx-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
              刻意练习
            </Link>
            做几轮，做错的题会自动出现在这里。
          </p>
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-white">错题清单</h2>
              <span className="text-[12.5px] text-slate-500">按错误次数从高到低排列</span>
            </div>
            {wrong.map((question) => (
              <details
                key={question.id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-amber-400/30 open:bg-amber-400/[0.04]"
              >
                <summary className="flex cursor-pointer flex-wrap items-start justify-between gap-3 list-none">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-amber-200">
                        错 {question.wrongCount} / 共 {question.totalCount} 次
                      </span>
                      <span className="rounded-md border border-white/10 px-2 py-0.5 text-slate-400">
                        {question.docTitleZh}
                      </span>
                      <span className="rounded-md border border-white/10 px-2 py-0.5 text-slate-400">
                        {question.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 text-[14.5px] font-medium leading-7 text-white">{question.prompt}</p>
                  </div>
                  <span className="text-[12px] text-slate-500 group-open:hidden">展开解析 ▾</span>
                </summary>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = question.answerIndex === optionIndex;
                    return (
                      <p
                        key={optionIndex}
                        className={`rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-6 ${
                          isCorrect
                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                            : "border-white/10 bg-white/[0.02] text-slate-400"
                        }`}
                      >
                        <span className="mr-2 text-slate-500">{"ABCD"[optionIndex]}.</span>
                        {option}
                        {isCorrect ? <span className="ml-2 text-[11px] text-emerald-300">✓ 正确答案</span> : null}
                      </p>
                    );
                  })}
                  <p className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] px-3.5 py-3 text-[13px] leading-6 text-amber-100">
                    <span className="font-medium">解析：</span>
                    {question.explanationZh}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    最近答错：
                    {question.lastWrongAt ? new Date(question.lastWrongAt).toLocaleString("zh-CN") : "—"}
                  </p>
                </div>
              </details>
            ))}
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight text-white">错题重练</h2>
            <p className="mt-1 text-[13.5px] text-slate-400">
              从上面的错题里加权抽题（错得越多越容易出现），答对后不会立即移除——只要历史答错过就会保留，直到你反复答对、自己不再需要它。
            </p>
            <div className="mt-5">
              <QuizRunner bank={cards} docOptions={[]} weights={weights} recordSlug="wrong" lockScope />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
