"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type ManagedNote = {
  id: number;
  docSlug: string;
  docTitleZh: string;
  sectionAnchor: string | null;
  content: string;
  updatedAt: string;
};

export function NotesManager({ notes }: { notes: ManagedNote[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);

  const groups = [...new Set(notes.map((note) => note.docSlug))];
  const visible = notes.filter((note) => !removed.includes(note.id));

  async function remove(id: number) {
    setBusy(true);
    setRemoved((prev) => [...prev, id]);
    await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
    setBusy(false);
    startTransition(() => router.refresh());
  }

  if (notes.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
        还没有笔记。打开任意文档，右侧面板底部就能写笔记；也可以对着校验器生成的 frontmatter 记下可复用的片段。
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500">
        共 {visible.length} 条笔记{busy || isPending ? " · 同步中…" : ""}
      </p>
      {groups.map((slug) => {
        const groupNotes = visible.filter((note) => note.docSlug === slug);
        if (groupNotes.length === 0) return null;
        return (
          <section key={slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-white">{groupNotes[0].docTitleZh}</h2>
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
                      onClick={() => void remove(note.id)}
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
