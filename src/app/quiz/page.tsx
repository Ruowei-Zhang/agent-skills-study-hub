import { Suspense } from "react";
import Link from "next/link";
import { QuizRunnerScoped, type QuizCard } from "@/components/QuizRunner";
import { QuizHistoryList, QuizStatsBadges } from "@/components/QuizExtras";
import { getDocsCatalog, getQuizBank } from "@/lib/content";

export default function QuizPage() {
  const bank = getQuizBank();
  const catalog = getDocsCatalog();

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
  const docOptions = catalog.map((doc) => ({ slug: doc.slug, titleZh: doc.titleZh }));

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">刻意练习：把文档变成考试</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          题库从全部 9 篇文档中提取关键判断点：字段约束、触发率阈值、断言写法、plan-validate-execute
          的关键环节、脚本的十条工程规范、客户端五步实现与常见坑。每题都给出解释，答完自动判分并把成绩记录在本机浏览器中。
        </p>
        <QuizStatsBadges bankSize={cards.length} />
      </header>

      {/* ?scope= 由客户端读取（静态导出要求 useSearchParams 包在 Suspense 中） */}
      <Suspense fallback={null}>
        <QuizRunnerScoped bank={cards} docOptions={docOptions} />
      </Suspense>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">历史成绩</h2>
          <QuizHistoryList titles={Object.fromEntries(docTitles)} />
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
