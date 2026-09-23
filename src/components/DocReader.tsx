"use client";

import { useEffect, useMemo, useState } from "react";
import { MarkdownLite } from "@/components/MarkdownLite";
import { setSections, toggleSection, touchDoc, useStudy } from "@/lib/store";

export type ReaderSnippet = {
  id: number;
  title: string;
  lang: string;
  code: string;
  noteZh: string;
  sectionAnchor: string;
};

export type ReaderSection = {
  id: number;
  anchor: string;
  headingZh: string;
  headingEn: string;
  contentZh: string;
  contentEn: string;
  snippets: ReaderSnippet[];
};

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300 transition hover:border-indigo-400/40 hover:text-white"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

export function DocReader({
  docSlug,
  sections,
  withToc = true,
}: {
  docSlug: string;
  sections: ReaderSection[];
  withToc?: boolean;
}) {
  const state = useStudy();
  const [showEn, setShowEn] = useState<Record<string, boolean>>({});
  const [justSaved, setJustSaved] = useState(false);

  const done = useMemo(
    () => state.progress[docSlug]?.completedSections ?? [],
    [state.progress, docSlug],
  );

  // 打开文档即记录「最近阅读」，供总览页的断点续读使用
  useEffect(() => {
    touchDoc(docSlug);
  }, [docSlug]);

  const percent = useMemo(
    () => Math.round((done.length / Math.max(sections.length, 1)) * 100),
    [done.length, sections.length],
  );

  function flashSaved() {
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  }

  function setAll(next: string[]) {
    setSections(docSlug, next, sections.length);
    flashSaved();
  }

  function toggle(anchor: string) {
    toggleSection(docSlug, anchor, sections.length);
    flashSaved();
  }
  return (
    <div className={withToc ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]" : "grid gap-8"}>
      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>
              精读进度：<strong className="text-white">{done.length}</strong> / {sections.length} 节（{percent}%）
              {justSaved ? " · 已保存到本地 ✓" : ""}
            </span>
            <button
              type="button"
              onClick={() => void setAll(done.length === sections.length ? [] : sections.map((s) => s.anchor))}
              className="rounded-lg border border-white/10 px-2.5 py-1 transition hover:border-indigo-400/40 hover:text-white"
            >
              {done.length === sections.length ? "清空勾选" : "全部勾选"}
            </button>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {sections.map((section, index) => {
          const isDone = done.includes(section.anchor);
          return (
            <section
              key={section.id}
              id={section.anchor}
              className={`scroll-mt-24 rounded-2xl border p-5 transition sm:p-6 ${
                isDone
                  ? "border-indigo-400/30 bg-indigo-400/[0.06]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-widest text-indigo-300/80">
                    第 {index + 1} 节
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
                    {section.headingZh}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">原文标题：{section.headingEn}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEn((prev) => ({ ...prev, [section.anchor]: !prev[section.anchor] }))}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-300 transition hover:text-white"
                  >
                    {showEn[section.anchor] ? "隐藏英文摘录" : "看英文摘录"}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(section.anchor)}
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${
                      isDone
                        ? "bg-indigo-400 text-[#0b1020] hover:bg-indigo-300"
                        : "border border-white/15 text-slate-300 hover:border-indigo-400/50 hover:text-white"
                    }`}
                  >
                    {isDone ? "✓ 已精读" : "标记已读"}
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <MarkdownLite content={section.contentZh} />
              </div>

              {showEn[section.anchor] ? (
                <div className="mt-4 rounded-xl border border-sky-400/20 bg-sky-400/[0.06] p-4">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-sky-300/80">
                    Original excerpt
                  </p>
                  <p className="text-[0.9rem] leading-6 text-slate-300/90">{section.contentEn}</p>
                </div>
              ) : null}

              {section.snippets.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {section.snippets.map((snippet) => (
                    <figure key={snippet.id} className="overflow-hidden rounded-xl border border-white/10 bg-[#060a15]">
                      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
                        <span className="text-xs font-medium text-slate-300">
                          {snippet.title}
                          <span className="ml-2 rounded border border-white/10 px-1.5 py-0.5 text-[10px] uppercase text-slate-400">
                            {snippet.lang}
                          </span>
                        </span>
                        <CopyButton code={snippet.code} />
                      </figcaption>
                      <pre className="max-h-[26rem] overflow-auto px-4 py-3 text-[12.5px] leading-6 text-slate-300">
                        <code>{snippet.code}</code>
                      </pre>
                      {snippet.noteZh ? (
                        <p className="border-t border-white/10 px-3 py-2 text-[11.5px] text-slate-400">
                          💡 {snippet.noteZh}
                        </p>
                      ) : null}
                    </figure>
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <aside className={withToc ? "lg:sticky lg:top-24 lg:h-fit" : "hidden"}>
        <nav className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-500">
            本节大纲
          </p>
          <ol className="space-y-1.5 text-[13px]">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.anchor}`}
                  className={`flex gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5 ${
                    done.includes(section.anchor) ? "text-indigo-200" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span className="text-slate-500">{index + 1}.</span>
                  <span className="min-w-0">{section.headingZh}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
    </div>
  );
}

export default DocReader;
