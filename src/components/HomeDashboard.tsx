"use client";

import Link from "next/link";
import { getQuizHistory, getQuizStats, useStudy, type ProgressEntry } from "@/lib/store";

export type CatalogDoc = {
  slug: string;
  titleZh: string;
  titleEn: string;
  groupKey: string;
  groupZh: string;
  orderIndex: number;
  sourceUrl: string;
  summaryZh: string;
  difficulty: string;
  readMinutes: number;
  sectionCount: number;
  snippetCount: number;
};

export type LearningPath = {
  key: string;
  titleZh: string;
  subtitleZh: string;
  docSlugs: string[];
};

export type DisclosureTier = {
  tier: string;
  titleZh: string;
  cost: string;
  loaded: string;
  when: string;
  docSlug: string;
};

export type SiteStats = {
  pageCount: number;
  sectionCount: number;
  snippetCount: number;
  questionCount: number;
};

const REPO_URL = "https://github.com/Ruowei-Zhang/agent-skills-study-hub";

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

export function HomeDashboard({
  catalog,
  paths,
  tiers,
  stats,
  sourceSite,
}: {
  catalog: CatalogDoc[];
  paths: LearningPath[];
  tiers: DisclosureTier[];
  stats: SiteStats;
  sourceSite: string;
}) {
  const state = useStudy();
  const progressOf = (slug: string): ProgressEntry | undefined => state.progress[slug];
  const percentOf = (slug: string): number => progressOf(slug)?.percent ?? 0;

  const nextDoc = catalog.find((doc) => percentOf(doc.slug) < 100) ?? null;
  const interrupted = catalog
    .filter((doc) => {
      const entry = progressOf(doc.slug);
      return entry && entry.percent > 0 && entry.percent < 100;
    })
    .sort((a, b) =>
      (progressOf(b.slug)?.lastOpenedAt ?? "").localeCompare(progressOf(a.slug)?.lastOpenedAt ?? ""),
    )
    .slice(0, 3);
  const mastered = catalog.filter((doc) => progressOf(doc.slug)?.status === "mastered").length;
  const overall = Math.round(
    catalog.reduce((sum, doc) => sum + percentOf(doc.slug), 0) / Math.max(catalog.length, 1),
  );
  const groups = [...new Map(catalog.map((doc) => [doc.groupKey, doc.groupZh])).entries()];
  const quizStats = getQuizStats(state);
  const history = getQuizHistory(state, 4);
  const docTitles = new Map(catalog.map((doc) => [doc.slug, doc.titleZh]));


  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-[11.5px] text-indigo-200">
            已整理 {stats.pageCount} 篇官方文档 · {stats.sectionCount} 个章节 · {stats.snippetCount} 段代码
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
              href={`${sourceSite}/home`}
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
              刻意练习题库（{stats.questionCount} 题）
            </Link>
            <Link
              href="/spec"
              className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:border-indigo-400/50"
            >
              frontmatter 校验器
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm text-slate-200 transition hover:border-amber-300/50 hover:text-amber-200"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="h-4 w-4 text-amber-300">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              觉得有帮助？去 GitHub 点个 Star
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">精读进度</p>
              <p className="mt-2 text-2xl font-bold text-white">{overall}%</p>
              <div className="mt-3">{bar(overall)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">测试正确率</p>
              <p className="mt-2 text-2xl font-bold text-white">{quizStats.accuracy}%</p>
              <p className="mt-3 text-[11px] text-slate-500">
                {quizStats.answered > 0
                  ? `${quizStats.answered} 次作答 · ${quizStats.attempts} 轮练习`
                  : "还没有测验记录"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-slate-500">学习笔记</p>
              <p className="mt-2 text-2xl font-bold text-white">{state.notes.length}</p>
              <p className="mt-3 text-[11px] text-slate-500">条精读心得</p>
            </div>
          </div>
        </div>


        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">学到这里了</h2>
              <span className="text-[11px] text-slate-500">
                已掌握 {mastered} / {catalog.length} 篇
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {interrupted.length === 0 ? (
                <li className="text-[13px] text-slate-400">
                  还没有进行中的文档。从第一篇《Agent Skills 概览》开始。
                </li>
              ) : (
                interrupted.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      href={`/docs/${doc.slug}`}
                      className="block rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-indigo-400/30"
                    >
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-medium text-slate-200">{doc.titleZh}</span>
                        <span className="text-[11px] text-indigo-200">{percentOf(doc.slug)}%</span>
                      </div>
                      <div className="mt-2">{bar(percentOf(doc.slug))}</div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white">最近成绩</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-[13px] text-slate-400">做一轮刻意练习后，这里会出现成绩曲线。</p>
            ) : (
              <ul className="mt-3 space-y-2 text-[13px]">
                {history.map((row) => (
                  <li key={row.id} className="flex items-center justify-between text-slate-300">
                    <span>
                      {new Date(row.createdAt).toLocaleDateString("zh-CN", {
                        month: "numeric",
                        day: "numeric",
                      })}
                      {" · "}
                      {docTitles.get(row.docSlug) ??
                        (row.docSlug === "all"
                          ? "混合练习"
                          : row.docSlug === "wrong"
                            ? "错题重练"
                            : row.docSlug)}
                    </span>
                    <span className="text-slate-400">
                      {row.correct}/{row.total}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white">按文档构成的进度</h2>
            <ul className="mt-3 space-y-3">
              {groups.map(([groupKey, groupZh]) => {
                const groupDocs = catalog.filter((doc) => doc.groupKey === groupKey);
                const percent = Math.round(
                  groupDocs.reduce((sum, doc) => sum + percentOf(doc.slug), 0) /
                    Math.max(groupDocs.length, 1),
                );
                return (
                  <li key={groupKey}>
                    <div className="flex items-center justify-between text-[12px] text-slate-400">
                      <span>{groupZh}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="mt-1.5">{bar(percent)}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>


      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">按角色选择学习路线</h2>
          <span className="text-xs text-slate-500">每条路线由官方文档按受众重组而成</span>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {paths.map((path) => {
            const pathDocs = path.docSlugs
              .map((slug) => catalog.find((doc) => doc.slug === slug))
              .filter((doc): doc is CatalogDoc => Boolean(doc));
            const pathPercent = Math.round(
              pathDocs.reduce((sum, doc) => sum + percentOf(doc.slug), 0) /
                Math.max(pathDocs.length, 1),
            );
            return (
              <div
                key={path.key}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">{path.titleZh}</h3>
                  <span className="text-[11px] text-indigo-200">{pathPercent}%</span>
                </div>
                <p className="mt-1 text-[12.5px] text-slate-500">{path.subtitleZh}</p>
                <div className="mt-3">{bar(pathPercent)}</div>
                <ol className="mt-4 space-y-2 text-[13px]">
                  {pathDocs.map((doc, index) => (
                    <li key={doc.slug}>
                      <Link
                        href={`/docs/${doc.slug}`}
                        className="flex gap-2 rounded-lg px-2 py-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
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
            {tiers.map((tier) => (
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
                  {percentOf(doc.slug) > 0 ? (
                    <span className="text-[11px] text-indigo-200">{percentOf(doc.slug)}%</span>
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

export default HomeDashboard;
