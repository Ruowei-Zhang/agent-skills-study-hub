"use client";

import Link from "next/link";
import { deleteNote, useStudy } from "@/lib/store";

export function NotesManager({ docTitles }: { docTitles: Record<string, string> }) {
  const state = useStudy();
  const notes = state.notes;

  if (notes.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
        还没有笔记。打开任意文档，右侧面板底部就能写笔记；也可以对着校验器生成的 frontmatter 记下可复用的片段。
      </p>
    );
  }

  const groups = [...new Set(notes.map((note) => note.docSlug))];

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">共 {notes.length} 条笔记 · 保存在当前浏览器本地</p>
      {groups.map((slug) => {
        const groupNotes = notes.filter((note) => note.docSlug === slug);
        return (
          <section key={slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-white">{docTitles[slug] ?? slug}</h2>
              <Link
                href={`/docs/${slug}`}
                className="text-[11.5px] text-sky-300 underline decoration-sky-400/40 underline-offset-2"
              >
                打开文档 →
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {groupNotes.map((note) => (
                <li key={note.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                  <p className="whitespace-pre-wrap text-[13.5px] leading-6 text-slate-300">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>更新于 {new Date(note.updatedAt).toLocaleString("zh-CN")}</span>
                    <button
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      className="transition hover:text-rose-300"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default NotesManager;
