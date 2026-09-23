"use client";

import Link from "next/link";
import { useStudy } from "@/lib/store";

/** 文档头部的精读进度徽章（无进度时不渲染）。 */
export function DocProgressBadge({ slug }: { slug: string }) {
  const state = useStudy();
  const entry = state.progress[slug];
  if (!entry || entry.percent <= 0) return null;
  return (
    <span className="rounded-md border border-white/10 px-2 py-0.5 text-slate-400">
      已精读 {entry.percent}%
    </span>
  );
}

export type OutlineSection = { anchor: string; headingZh: string };
export type RelatedDoc = { slug: string; titleZh: string };

/** 文档详情页右侧栏：本页大纲（带已读高亮）+ 同组文档（带进度）。 */
export function DocSidePanel({
  slug,
  sections,
  related,
}: {
  slug: string;
  sections: OutlineSection[];
  related: RelatedDoc[];
}) {
  const state = useStudy();
  const done = state.progress[slug]?.completedSections ?? [];

  return (
    <>
      <nav className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-500">本页大纲</p>
        <ol className="space-y-1.5 text-[13px]">
          {sections.map((section, sectionIndex) => (
            <li key={section.anchor}>
              <a
                href={`#${section.anchor}`}
                className={`flex gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5 ${
                  done.includes(section.anchor) ? "text-indigo-200" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-slate-500">{sectionIndex + 1}.</span>
                <span className="min-w-0">{section.headingZh}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {related.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-500">同组文档</p>
          <ul className="space-y-1.5 text-[13px]">
            {related.map((doc) => (
              <li key={doc.slug}>
                <Link
                  href={`/docs/${doc.slug}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
                >
                  <span className="min-w-0">{doc.titleZh}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">
                    {state.progress[doc.slug]?.percent ?? 0}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default DocSidePanel;
