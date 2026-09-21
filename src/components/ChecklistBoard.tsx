"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type CheckItem = {
  key: string;
  group: string;
  label: string;
  hint: string;
  docSlug: string;
  docTitleZh: string;
};

const STORAGE_KEY = "agentskills-checklist-v1";

export function ChecklistBoard({ items }: { items: CheckItem[] }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- 挂载时从 localStorage 恢复勾选进度（仅客户端可用的外部存储） */
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as string[]);
    } catch {
      setChecked([]);
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // ignore quota errors
    }
  }, [checked, ready]);

  const groups = useMemo(() => {
    const map = new Map<string, CheckItem[]>();
    items.forEach((item) => {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    });
    return [...map.entries()];
  }, [items]);

  const percent = Math.round((checked.length / Math.max(items.length, 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            已完成 <strong className="text-white">{checked.length}</strong> / {items.length} 项（{percent}%）
          </span>
          <button
            type="button"
            onClick={() => setChecked(checked.length === items.length ? [] : items.map((item) => item.key))}
            className="rounded-lg border border-white/10 px-2.5 py-1 transition hover:border-indigo-400/40 hover:text-white"
          >
            {checked.length === items.length ? "全部取消" : "全部勾选"}
          </button>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-[11.5px] text-slate-500">
          勾选状态保存在浏览器本地（localStorage），用于发布前逐项过一遍；每项都可点进对应文档查证。
        </p>
      </div>

      {groups.map(([group, groupItems]) => (
        <section key={group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-white">{group}</h2>
          <ul className="space-y-2">
            {groupItems.map((item) => {
              const isChecked = checked.includes(item.key);
              return (
                <li
                  key={item.key}
                  className={`flex flex-wrap items-start gap-3 rounded-xl border p-3 transition ${
                    isChecked ? "border-emerald-400/30 bg-emerald-400/[0.06]" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setChecked(isChecked ? checked.filter((key) => key !== item.key) : [...checked, item.key])
                    }
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-[11px] transition ${
                      isChecked
                        ? "border-emerald-400/60 bg-emerald-400/80 text-[#062018]"
                        : "border-white/20 text-transparent hover:border-emerald-400/40"
                    }`}
                    aria-label={isChecked ? "取消勾选" : "勾选"}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13.5px] leading-6 ${isChecked ? "text-emerald-100" : "text-slate-200"}`}>
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-5 text-slate-500">{item.hint}</p>
                  </div>
                  <Link
                    href={`/docs/${item.docSlug}`}
                    className="ml-auto shrink-0 text-[11.5px] text-sky-300 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-200"
                  >
                    {item.docTitleZh}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default ChecklistBoard;
