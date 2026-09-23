"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";
import { docStats } from "@/data";
import { searchEverything } from "@/lib/content";

const SUGGESTIONS = ["触发率", "渐进式披露", "frontmatter", "gotchas", "PEP 723", "宽松校验", ".agents/skills"];

/**
 * 全文搜索页主体（客户端组件）：从 URL ?q= 读取关键词，在本机静态数据里检索。
 * 静态导出模式下没有服务端渲染查询参数的能力，搜索天然就是纯客户端行为。
 */
export function SearchClient() {
  const term = (useSearchParams().get("q") ?? "").trim();
  const hits = term ? searchEverything(term) : [];

  const items: DirectoryItem[] = hits.map((hit, index) => ({
    key: `${hit.kind}-${index}-${hit.title}`,
    title: hit.title,
    subtitle: `${hit.kind} · ${hit.docTitleZh}`,
    description: hit.snippet,
    category: hit.kind,
    href: hit.href,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">全文搜索</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          搜索范围覆盖 {docStats.sectionCount} 个精读章节、{docStats.snippetCount} 段代码示例、
          {docStats.glossaryCount} 个术语与 {docStats.clientCount} 个客户端产品。支持中英文关键词，例如
          「触发率」「frontmatter」「structured」「.agents/skills」。
        </p>
        <form action="/search" className="mt-5 flex flex-wrap gap-3">
          <input
            name="q"
            defaultValue={term}
            placeholder="输入关键词…"
            className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-indigo-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-[#0b1020]"
          >
            搜索
          </button>
        </form>
      </header>

      {term ? (
        items.length > 0 ? (
          <SearchDirectory items={items} categories={[...new Set(items.map((item) => item.category))]} placeholder="在当前结果中继续筛选…" />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-slate-300">没有匹配「{term}」的内容。</p>
            <p className="mt-2 text-[13px] text-slate-400">
              试试更短的关键词，或直接浏览
              <Link href="/glossary" className="mx-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
                术语表
              </Link>
              与
              <Link href="/docs" className="mx-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
                文档目录
              </Link>
              。
            </p>
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-slate-300">输入关键词开始检索。</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[12.5px]">
            {SUGGESTIONS.map((suggestion) => (
              <Link
                key={suggestion}
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-400 transition hover:border-indigo-400/40 hover:text-white"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchClient;
