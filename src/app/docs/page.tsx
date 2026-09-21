import Link from "next/link";
import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";
import { docStats, learningPaths } from "@/data";
import { getDocsCatalog } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DocsIndexPage() {
  const catalog = await getDocsCatalog();

  const items: DirectoryItem[] = catalog.map((doc) => ({
    key: doc.slug,
    title: doc.titleZh,
    subtitle: `${doc.titleEn} · ${doc.groupZh}`,
    description: doc.summaryZh,
    category: doc.groupZh,
    badges: [doc.difficulty, ...doc.tags.slice(0, 3)],
    meta: `${doc.sectionCount} 节 · ${doc.snippetCount} 段代码 · ${doc.readMinutes} 分钟`,
    href: `/docs/${doc.slug}`,
    progressPercent: doc.progress?.percent ?? 0,
  }));

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">文档精读</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          agentskills.io 全站共 {docStats.pageCount} 篇文档，本站按官方导航分组完整收录：
          <b className="text-slate-200">基础与规范</b>（概览、格式规范、客户端清单）、
          <b className="text-slate-200">技能创作者</b>（快速开始、最佳实践、描述优化、输出评估、脚本设计）、
          <b className="text-slate-200">客户端实现者</b>（添加技能支持）。每篇都可逐节标记已读，进度会持久保存。
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {learningPaths.map((path) => (
            <span
              key={path.key}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-slate-300"
            >
              {path.titleZh}：{path.docSlugs.length} 篇
            </span>
          ))}
        </div>
      </header>

      <SearchDirectory
        items={items}
        categories={[...new Set(catalog.map((doc) => doc.groupZh))]}
        placeholder="搜索标题、摘要、标签…"
      />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">官方原文对照</h2>
        <p className="mt-2 text-[13px] leading-6 text-slate-400">
          每篇文档的顶部都有「对照 agentskills.io 原文」链接；每个章节都可展开英文摘录，方便核对中文精读是否准确。
          代码示例统一取自官方仓库的 MDX 源文件，保留了注释与原始措辞。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12.5px]">
          {catalog.map((doc) => (
            <a
              key={doc.slug}
              href={doc.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-400 transition hover:border-sky-400/40 hover:text-sky-200"
            >
              原文 · {doc.titleEn} ↗
            </a>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-slate-500">
        想先看最短的路径？
        <Link href="/docs/quickstart" className="ml-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
          直接用 20 行做出第一个技能 →
        </Link>
      </p>
    </div>
  );
}
