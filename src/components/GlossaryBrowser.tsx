"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";

/**
 * 术语表浏览器（客户端组件）：读取 URL ?q= 作为初始筛选词。
 * 静态导出要求 useSearchParams 包在 <Suspense> 中。
 */
export function GlossaryBrowser({
  items,
  categories,
}: {
  items: DirectoryItem[];
  categories: string[];
}) {
  const q = useSearchParams().get("q") ?? "";

  return (
    <>
      {q ? (
        <p className="text-xs text-indigo-200">
          已按搜索词「{q}」筛选：
          <Link href="/glossary" className="ml-1 text-slate-300 underline underline-offset-2">
            清除
          </Link>
        </p>
      ) : null}
      <SearchDirectory
        items={items}
        categories={categories}
        placeholder="搜索术语、中文释义或定义内容…"
        initialTerm={q}
      />
    </>
  );
}

export default GlossaryBrowser;
