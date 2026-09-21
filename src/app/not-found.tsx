import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-indigo-300/80">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">这个页面不在学习地图里</h1>
      <p className="mt-3 text-[14.5px] leading-7 text-slate-400">
        可能是文档链接拼写有误。agentskills.io 全站只有 9 篇文档，全部收录在本站「文档精读」中：
        概览、格式规范、客户端清单，以及技能创作者与客户端实现者的指导文档。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href="/docs"
          className="rounded-xl bg-gradient-to-r from-indigo-400 to-sky-400 px-4 py-2.5 font-semibold text-[#0b1020]"
        >
          文档精读
        </Link>
        <Link href="/" className="rounded-xl border border-white/15 px-4 py-2.5 text-slate-200">
          学习总览
        </Link>
        <Link href="/glossary" className="rounded-xl border border-white/15 px-4 py-2.5 text-slate-200">
          术语表
        </Link>
      </div>
    </div>
  );
}
