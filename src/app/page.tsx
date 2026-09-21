import Link from "next/link";
import { docStats, disclosureTiers, learningPaths, SOURCE_SITE } from "@/data";
import {
  getDocsCatalog,
  getInterruptedDocs,
  getNextDoc,
  getQuizHistory,
  getQuizStats,
  listNotes,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

function bar(percent: number) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default async function DashboardPage() {
  const [catalog, nextDoc, interrupted, quizStats, history, notes] = await Promise.all([
    getDocsCatalog(),
    getNextDoc(),
    getInterruptedDocs(3),
    getQuizStats(),
    getQuizHistory(4),
    listNotes(),
  ]);

  const mastered = catalog.filter((doc) => doc.progress?.status === "mastered").length;
  const reading = catalog.filter((doc) => doc.progress && doc.progress.percent > 0 && doc.progress.percent < 100);
  const overall = Math.round(
    catalog.reduce((sum, doc) => sum + (doc.progress?.percent ?? 0), 0) / Math.max(catalog.length, 1),
  );
  const groups = [...new Map(catalog.map((doc) => [doc.groupKey, doc.groupZh])).entries()];

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-[11.5px] text-indigo-200">
            已整理 {docStats.pageCount} 篇官方文档 · {docStats.sectionCount} 个章节 · {docStats.snippetCount} 段代码
          </span>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-tight text-white">
            Agent Skills 全站文档
            <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
              {" "}
              精读 · 练习 · 自检
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-7 text-slate-400">
            这套学习中心把{" "}
            <a
              href={`${SOURCE_SITE}/home`}
              target="_blank"
              rel="noreferrer"
              className="text-slate-200 underline decoration-slate-500 underline-offset-2"
            >
              agentskills.io
            </a>{" "}
            的 9 篇文档逐节拆解：每节保留<b className="text-slate-200">英文原文摘录</b>，配一份
            <b className="text-slate-200">中文精读笔记</b>，并附带原文中的全部代码示例。学完可以进题库做刻意练习、用格式校验器检查
            SKILL.md、按自检清单过一遍自己的技能。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/docs/${nextDoc?.slug ?? "overview"}`}
              className="rounded-xl bg-gradient-to-r from-indigo-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-[#0b1020] shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
            >
              {overall === 0 ? "从概览开始精读" : "继续精读"}
            </Link>
            <Link
              href="/quiz"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:border-indigo-400/50"
            >
              刻意练习题库（{docStats.questionCount} 题）
            </Link>
            <Link
              href="/spec"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:border-indigo-400/50"
            >
              格式校验器
            </Link>
          </div>

          <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "总体精读进度", value: `${overall}%` },
              { label: "已掌握文档", value: `${mastered}/${docStats.pageCount}` },
              { label: "练习正确率", value: `${quizStats.accuracy}%` },
              { label: "我的笔记", value: `${notes.length} 条` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <dt className="text-[11px] uppercase tracking-widest text-slate-500">{item.label}</dt>
                <dd className="mt-1.5 text-2xl font-semibold text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-indigo-400/[0.12] to-sky-400/[0.06] p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-indigo-200/80">学到这里了</p>
            {interrupted.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {interrupted.map((doc) => (
                  <li key={doc.slug}>
                    <Link href={`/docs/${doc.slug}`} className="block">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-white">{doc.titleZh}</span>
                        <span className="text-[11px] text-indigo-200">{doc.progress?.percent ?? 0}%</span>
                      </div>
                      <div className="mt-2">{bar(doc.progress?.percent ?? 0)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-slate-300">还没有开始精读。</p>
                <Link
                  href={`/docs/${nextDoc?.slug ?? "overview"}`}
                  className="mt-3 inline-block rounded-lg border border-white/20 px-3 py-1.5 text-xs text-slate-200 transition hover:border-indigo-300/60"
                >
                  打开：{nextDoc?.titleZh ?? "概览"} →
                </Link>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">按文档构成的进度</p>
            <ul className="mt-3 space-y-3">
              {groups.map(([key, label]) => {
                const groupDocs = catalog.filter((doc) => doc.groupKey === key);
                const percent = Math.round(
                  groupDocs.reduce((sum, doc) => sum + (doc.progress?.percent ?? 0), 0) / groupDocs.length,
                );
                return (
                  <li key={key}>
                    <div className="flex items-baseline justify-between text-[12.5px]">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-slate-500">
                        {groupDocs.length} 篇 · {percent}%
                      </span>
                    </div>
                    <div className="mt-2">{bar(percent)}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">最近的练习记录</p>
            {history.length === 0 ? (
              <p className="mt-3 text-[13px] text-slate-400">
                还没有作答记录。
                <Link href="/quiz" className="ml-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
                  先做一轮 8 题
                </Link>
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-[12.5px]">
                {history.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 text-slate-400">
                    <span className="truncate">{row.docTitleZh}</span>
                    <span className="shrink-0 text-slate-300">
                      {row.correct}/{row.total}
                      <span className="ml-2 text-slate-500">
                        {new Date(row.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight text-white">三条学习路线</h2>
        <p className="mt-1 text-[13.5px] text-slate-400">
          按你的角色挑一条线走；每条线都对应官方站点的导航分组，进度会自动同步到上面的总览。
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {learningPaths.map((path) => {
            const pathDocs = path.docSlugs
              .map((slug) => catalog.find((doc) => doc.slug === slug))
              .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));
            const percent = Math.round(
              pathDocs.reduce((sum, doc) => sum + (doc.progress?.percent ?? 0), 0) / Math.max(pathDocs.length, 1),
            );
            return (
              <div key={path.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{path.titleZh}</h3>
                  <span className="text-[11px] text-slate-500">{percent}%</span>
                </div>
                <p className="mt-1 text-[12.5px] text-indigo-200/70">{path.subtitleZh}</p>
                <div className="mt-3">{bar(percent)}</div>
                <ol className="mt-4 space-y-1.5 text-[13px]">
                  {pathDocs.map((doc, index) => (
                    <li key={doc.slug}>
                      <Link
                        href={`/docs/${doc.slug}`}
                        className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <span className="text-slate-500">{index + 1}.</span>
                        <span>
                          {doc.titleZh}
                          <span className="ml-2 text-[11px] text-slate-500">{doc.readMinutes} 分钟</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-semibold tracking-tight text-white">贯穿全站的核心机制：渐进式披露</h2>
          <p className="mt-1 text-[13.5px] leading-6 text-slate-400">
            三层加载策略是理解这套标准（以及所有客户端实现）的钥匙：内容按需进入上下文，所以技能可以「多装、少付」。
          </p>
          <ol className="mt-4 space-y-3">
            {disclosureTiers.map((tier) => (
              <li key={tier.tier} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-white">
                    第 {tier.tier} 层 · {tier.titleZh}
                  </span>
                  <span className="rounded-md bg-indigo-400/10 px-2 py-0.5 text-[11px] text-indigo-200">
                    {tier.cost}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] text-slate-400">加载内容：{tier.loaded}</p>
                <p className="text-[12.5px] text-slate-400">加载时机：{tier.when}</p>
                <Link
                  href={`/docs/${tier.docSlug}`}
                  className="mt-2 inline-block text-[11.5px] text-sky-300 underline decoration-sky-400/40 underline-offset-2"
                >
                  查看相关章节 →
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          {catalog.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-indigo-400/30"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-semibold text-slate-300">
                {doc.orderIndex}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-[14.5px] font-semibold text-white">{doc.titleZh}</h3>
                  <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10.5px] text-slate-400">
                    {doc.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {doc.sectionCount} 节 · {doc.readMinutes} 分钟
                  </span>
                  {doc.progress ? (
                    <span className="text-[11px] text-indigo-200">{doc.progress.percent}%</span>
                  ) : null}
                </div>
                <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-6 text-slate-400">{doc.summaryZh}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
