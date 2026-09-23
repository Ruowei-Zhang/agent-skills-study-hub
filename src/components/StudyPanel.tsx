"use client";

import { useState } from "react";
import { addNote, deleteNote, setStarred, setStatus, useStudy } from "@/lib/store";

export function StudyPanel({ docSlug }: { docSlug: string }) {
  const state = useStudy();
  const [draft, setDraft] = useState("");

  const entry = state.progress[docSlug];
  const currentStatus = entry?.status ?? "unread";
  const isStarred = entry?.starred ?? false;
  const notes = state.notes.filter((note) => note.docSlug === docSlug);

  function submitNote() {
    const content = draft.trim();
    if (!content) return;
    addNote(docSlug, content);
    setDraft("");
  }

  const statuses = [
    { key: "unread", label: "未读" },
    { key: "reading", label: "学习中" },
    { key: "mastered", label: "已掌握" },
  ];

  return (
    <div className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-slate-500">掌握状态</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatus(docSlug, item.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                currentStatus === item.key
                  ? "bg-gradient-to-r from-indigo-400 to-sky-400 text-[#0b1020]"
                  : "border border-white/15 text-slate-300 hover:border-indigo-400/40 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStarred(docSlug, !isStarred)}
          className="mt-3 text-xs text-slate-400 transition hover:text-amber-300"
        >
          {isStarred ? "★ 已加入重点复习" : "☆ 加入重点复习"}
        </button>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-slate-500">我的笔记</p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="写下你的理解、疑点或可直接复用的指令片段…"
          className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
        <button
          type="button"
          disabled={!draft.trim()}
          onClick={submitNote}
          className="mt-2 rounded-lg bg-indigo-400/90 px-3 py-1.5 text-xs font-medium text-[#0b1020] transition hover:bg-indigo-300 disabled:opacity-40"
        >
          保存笔记
        </button>
        <p className="mt-2 text-[11px] text-slate-500">笔记保存在当前浏览器的 localStorage 中。</p>

        <ul className="mt-4 space-y-2">
          {notes.length === 0 ? (
            <li className="text-xs text-slate-500">还没有笔记。精读时顺手记一条，复习效率最高。</li>
          ) : null}
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="whitespace-pre-wrap text-[13px] leading-6 text-slate-300">{note.content}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{new Date(note.updatedAt).toLocaleString("zh-CN")}</span>
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
      </div>
    </div>
  );
}

export default StudyPanel;
