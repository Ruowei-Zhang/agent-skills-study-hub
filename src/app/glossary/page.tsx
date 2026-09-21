import Link from "next/link";
import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";
import { getGlossary } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function GlossaryPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const terms = await getGlossary();

  const categories = [...new Set(terms.map((term) => term.category))];
  const items: DirectoryItem[] = terms.map((term) => ({
    key: `${term.id}-${term.term}`,
    title: `${term.term} · ${term.termZh}`,
    subtitle: term.definitionZh,
    description: `出处：${term.docSlug === "overview" ? "概览" : term.docSlug}`,
    category: term.category,
    badges: [term.category],
    href: `/docs/${term.docSlug}`,
    externalHref: undefined,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">术语表</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          这套标准的用词非常精确：渐进式披露、目录、激活、宽松校验、相近反例、触发率、结构化包裹…
          把 {terms.length} 个术语的准确定义集中在这里，每个都标注了出处章节，方便随时回查。搜索框支持中英文与定义内容匹配。
        </p>
        {q ? (
          <p className="mt-2 text-xs text-indigo-200">
            已带上搜索词「{q}」：
            <Link href="/glossary" className="ml-1 text-slate-300 underline underline-offset-2">
              清除
            </Link>
          </p>
        ) : null}
      </header>

      <SearchDirectory
        items={items}
        categories={categories}
        placeholder="搜索术语、中文释义或定义内容…"
      />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">容易混淆的三组概念</h2>
        <ul className="mt-3 space-y-3 text-[13px] leading-6 text-slate-300">
          <li>
            <b className="text-white">目录 vs 指令 vs 资源</b>：目录是「有哪些技能」，指令是「怎么做」，资源是「需要时才取的材料」；三层对应三个 token 量级。
          </li>
          <li>
            <b className="text-white">触发率 vs 通过率</b>：触发率衡量描述能否让技能被调用；通过率衡量技能产出是否达标。前者属描述优化，后者属输出评估。
          </li>
          <li>
            <b className="text-white">宽松校验 vs 严格校验</b>：规范推荐对装饰性问题告警仍加载（命名不匹配、超长），只在缺 description 或 YAML 不可解析时跳过。
          </li>
        </ul>
      </section>
    </div>
  );
}
