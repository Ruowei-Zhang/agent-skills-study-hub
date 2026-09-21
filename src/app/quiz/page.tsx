import Link from "next/link";
import { QuizRunner, type QuizCard } from "@/components/QuizRunner";
import { getDocsCatalog, getQuizBank, getQuizHistory, getQuizStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ scope?: string }> };

export default async function QuizPage({ searchParams }: PageProps) {
  const { scope } = await searchParams;
  const [bank, catalog, history, stats] = await Promise.all([
    getQuizBank(),
    getDocsCatalog(),
    getQuizHistory(10),
    getQuizStats(),
  ]);

  const docTitles = new Map(catalog.map((doc) => [doc.slug, doc.titleZh]));
  const cards: QuizCard[] = bank.map((question) => ({
    id: question.id,
    docSlug: question.docSlug,
    docTitleZh: docTitles.get(question.docSlug) ?? question.docSlug,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options: question.options,
    answerIndex: question.answerIndex,
    explanationZh: question.explanationZh,
  }));

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">刻意练习：把文档变成考试</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          题库从全部 9 篇文档中提取关键判断点：字段约束、触发率阈值、断言写法、plan-validate-execute
          的关键环节、脚本的十条工程规范、客户端五步实现与常见坑。每题都给出解释，答完自动记录成绩用于统计正确率。
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            题库 {cards.length} 题
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            累计作答 {stats.answered} 题 · 正确率 {stats.accuracy}%
          </span>
          <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">
            练习轮次 {stats.attempts}
          </span>
        </div>
      </header>

      <QuizRunner
        bank={cards}
        docOptions={scope && docTitles.has(scope)
          ? [{ slug: scope, titleZh: docTitles.get(scope) ?? scope }, ...catalog.filter((doc) => doc.slug !== scope).map((doc) => ({ slug: doc.slug, titleZh: doc.titleZh }))]
          : catalog.map((doc) => ({ slug: doc.slug, titleZh: doc.titleZh }))}
      />

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">历史成绩</h2>
          {history.length === 0 ? (
            <p className="mt-3 text-[13px] text-slate-400">还没有记录。提交一轮作答后这里会显示趋势。</p>
          ) : (
            <ul className="mt-3 space-y-2 text-[13px]">
              {history.map((row) => {
                const percent = row.total ? Math.round((row.correct / row.total) * 100) : 0;
                return (
                  <li key={row.id} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-slate-400">{row.docTitleZh}</span>
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
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">按文档练习入口</h2>
          <p className="mt-2 text-[12.5px] leading-6 text-slate-400">
            每篇文档底部也提供「做本篇练习」按钮，做题范围会自动切到对应文档。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {catalog.map((doc) => (
              <Link
                key={doc.slug}
                href={`/quiz?scope=${doc.slug}`}
                className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[12px] text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
              >
                {doc.titleZh}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
