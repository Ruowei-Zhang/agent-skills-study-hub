import { NotesManager } from "@/components/NotesManager";
import { getDocsCatalog } from "@/lib/content";

export default function NotesPage() {
  const docTitles = Object.fromEntries(
    getDocsCatalog().map((doc) => [doc.slug, doc.titleZh]),
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">我的笔记</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          精读过程中随手记下的理解、疑点与可复用片段都汇总在这里，按文档分组。笔记保存在当前浏览器的
          localStorage 中，刷新不会丢失；不同设备之间不同步。
        </p>
      </header>

      <NotesManager docTitles={docTitles} />
    </div>
  );
}
