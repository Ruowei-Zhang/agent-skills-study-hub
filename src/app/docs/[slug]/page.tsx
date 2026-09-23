import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocReader } from "@/components/DocReader";
import { DocProgressBadge, DocSidePanel } from "@/components/DocSidePanel";
import { StudyPanel } from "@/components/StudyPanel";
import { getDocDetail, getDocsCatalog } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getDocsCatalog().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getDocDetail(slug);
  if (!detail) return { title: "文档未找到 · Agent Skills 学习中心" };
  return {
    title: `${detail.doc.titleZh} · Agent Skills 学习中心`,
    description: detail.doc.summaryZh,
  };
}

export default async function DocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = getDocDetail(slug);
  if (!detail) notFound();

  const catalog = getDocsCatalog();
  const index = catalog.findIndex((doc) => doc.slug === slug);
  const prev = index > 0 ? catalog[index - 1] : null;
  const next = index >= 0 && index < catalog.length - 1 ? catalog[index + 1] : null;
  const related = catalog
    .filter((doc) => doc.groupKey === detail.doc.groupKey && doc.slug !== slug)
    .slice(0, 4)
    .map((doc) => ({ slug: doc.slug, titleZh: doc.titleZh }));

  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/docs" className="hover:text-slate-300">
          文档精读
        </Link>
        <span>/</span>
        <span className="text-slate-400">{detail.doc.groupZh}</span>
        <span>/</span>
        <span className="text-slate-300">{detail.doc.titleZh}</span>
      </nav>

      <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-md bg-indigo-400/15 px-2 py-0.5 text-indigo-200">{detail.doc.groupZh}</span>
          <span className="rounded-md border border-white/10 px-2 py-0.5 text-slate-400">{detail.doc.difficulty}</span>
          <span className="rounded-md border border-white/10 px-2 py-0.5 text-slate-400">
            第 {detail.doc.orderIndex} / {catalog.length} 篇
          </span>
          <DocProgressBadge slug={detail.doc.slug} />
        </div>
        <h1 className="mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
          {detail.doc.titleZh}
        </h1>
        <p className="mt-2 text-sm text-slate-400">原文标题：{detail.doc.titleEn}</p>
        <p className="mt-4 max-w-3xl text-[14.5px] leading-7 text-slate-300">{detail.doc.summaryZh}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
          <a
            href={detail.doc.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-slate-300 transition hover:border-sky-400/50 hover:text-sky-200"
          >
            对照 agentskills.io 原文 ↗
          </a>
          <Link
            href={`/quiz?scope=${detail.doc.slug}`}
            className="rounded-lg bg-indigo-400/90 px-3 py-1.5 font-medium text-[#0b1020] transition hover:bg-indigo-300"
          >
            做本篇练习
          </Link>
          <span className="text-slate-500">
            {detail.sections.length} 节 · {detail.sections.reduce((sum, s) => sum + s.snippets.length, 0)} 段代码 · 约{" "}
            {detail.doc.readMinutes} 分钟
          </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          <section className="rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-5">
            <h2 className="text-sm font-semibold text-white">本页五个要点（读完应该能复述）</h2>
            <ul className="mt-3 space-y-2">
              {detail.doc.keyPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-[13.5px] leading-6 text-slate-200">
                  <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            {detail.doc.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {detail.doc.tags.map((tag) => (
                  <span key={tag} className="rounded-md border border-white/10 px-2 py-0.5 text-[10.5px] text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <DocReader docSlug={detail.doc.slug} withToc={false} sections={detail.sections} />

          <nav className="flex flex-wrap justify-between gap-3">
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-indigo-400/30"
              >
                <span className="text-[11px] text-slate-500">← 上一篇</span>
                <span className="mt-1 block text-[13.5px] text-slate-200">{prev.titleZh}</span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-right transition hover:border-indigo-400/30"
              >
                <span className="text-[11px] text-slate-500">下一篇 →</span>
                <span className="mt-1 block text-[13.5px] text-slate-200">{next.titleZh}</span>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </nav>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <StudyPanel docSlug={detail.doc.slug} />
          <DocSidePanel
            slug={detail.doc.slug}
            sections={detail.sections.map((section) => ({
              anchor: section.anchor,
              headingZh: section.headingZh,
            }))}
            related={related}
          />
        </aside>
      </div>
    </div>
  );
}

