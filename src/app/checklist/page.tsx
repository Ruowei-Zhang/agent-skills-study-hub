import Link from "next/link";
import { ChecklistBoard, type CheckItem } from "@/components/ChecklistBoard";
import { checklist } from "@/data";
import { getDocsCatalog } from "@/lib/content";

export default function ChecklistPage() {
  const catalog = getDocsCatalog();
  const docTitles = new Map(catalog.map((doc) => [doc.slug, doc.titleZh]));

  const items: CheckItem[] = checklist.map((item, index) => ({
    key: `${index}-${item.group}-${item.label.slice(0, 12)}`,
    group: item.group,
    label: item.label,
    hint: item.hint,
    docSlug: item.docSlug,
    docTitleZh: docTitles.get(item.docSlug) ?? item.docSlug,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">实践自检清单</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          把 9 篇文档里所有可执行的判断点抽成 {items.length} 条发布前自检项，按「结构 / 触发 / 内容 / 评估 / 脚本」五组组织。
          每项都标注了出处文档，点右侧即可跳去查证。勾选进度保存在本地，适合在写技能或做客户端集成时逐项过一遍。
        </p>
        <p className="mt-2 text-xs text-slate-500">
          <Link href="/docs" className="text-sky-300 underline decoration-sky-400/40 underline-offset-2">
            回文档精读
          </Link>
          　·　
          <Link href="/spec" className="text-sky-300 underline decoration-sky-400/40 underline-offset-2">
            用格式校验器检查 frontmatter
          </Link>
        </p>
      </header>

      <ChecklistBoard items={items} />
    </div>
  );
}
