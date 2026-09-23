"use client";

import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";
import { useStudy } from "@/lib/store";

/**
 * 文档目录（带进度条）：静态条目由服务端传入，
 * 每篇的精读进度在客户端从 localStorage 注入。
 */
export function DocsDirectory({
  items,
  categories,
  placeholder,
}: {
  items: DirectoryItem[];
  categories: string[];
  placeholder?: string;
}) {
  const state = useStudy();
  const merged = items.map((item) => ({
    ...item,
    progressPercent: state.progress[item.key]?.percent ?? 0,
  }));
  return (
    <SearchDirectory
      items={merged}
      categories={categories}
      placeholder={placeholder ?? "搜索标题、摘要、标签…"}
    />
  );
}

export default DocsDirectory;
