import { NotesManager, type ManagedNote } from "@/components/NotesManager";
import { listNotes } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const notes = await listNotes();
  const managed: ManagedNote[] = notes.map((note) => ({
    id: note.id,
    docSlug: note.docSlug,
    docTitleZh: note.docTitleZh,
    sectionAnchor: note.sectionAnchor,
    content: note.content,
    updatedAt: note.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">我的笔记</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          精读过程中随手记下的理解、疑点与可复用片段都汇总在这里，按文档分组。笔记保存在 PostgreSQL
          里，跨设备与刷新都会保留。
        </p>
      </header>

      <NotesManager notes={managed} />
    </div>
  );
}
