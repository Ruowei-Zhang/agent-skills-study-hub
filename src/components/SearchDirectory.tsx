"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type DirectoryItem = {
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  badges?: string[];
  meta?: string;
  href?: string;
  externalHref?: string;
  secondaryHref?: string;
  progressPercent?: number;
};

export function SearchDirectory({
  items,
  categories,
  placeholder = "搜索…",
  emptyHint = "没有匹配结果，换个关键词试试。",
}: {
  items: DirectoryItem[];
  categories: string[];
  placeholder?: string;
  emptyHint?: string;
}) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("全部");

  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === "全部" || item.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [item.title, item.subtitle, item.description, item.category, ...(item.badges ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, term, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={placeholder}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {["全部", ...categories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${
                category === item
                  ? "bg-indigo-400/20 text-indigo-100 ring-1 ring-indigo-400/30"
                  : "border border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">共 {filtered.length} 项</span>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">{emptyHint}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => {
            const body = (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-white">{item.title}</h3>
                  {item.meta ? <span className="text-[11px] text-slate-500">{item.meta}</span> : null}
                </div>
                {item.subtitle ? <p className="mt-1 text-[12.5px] text-indigo-200/80">{item.subtitle}</p> : null}
                {item.description ? (
                  <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-slate-400">{item.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[10.5px] text-slate-400">
                    {item.category}
                  </span>
                  {(item.badges ?? []).map((badge) => (
                    <span
                      key={badge}
                      className="rounded-md bg-indigo-400/10 px-2 py-0.5 text-[10.5px] text-indigo-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                {typeof item.progressPercent === "number" ? (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                ) : null}
                {item.externalHref ? (
                  <p className="mt-3 space-x-3 text-[11.5px]">
                    <a
                      href={item.externalHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-300 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-200"
                    >
                      官网
                    </a>
                    {item.secondaryHref ? (
                      <a
                        href={item.secondaryHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-200"
                      >
                        官方技能文档
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </>
            );

            return item.href ? (
              <Link
                key={item.key}
                href={item.href}
                className="block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-white/[0.05]"
              >
                {body}
              </Link>
            ) : (
              <div key={item.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                {body}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchDirectory;
