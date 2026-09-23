import Link from "next/link";
import { SearchDirectory, type DirectoryItem } from "@/components/SearchDirectory";
import { getClients } from "@/lib/content";

export default function ClientsPage() {
  const clients = getClients();

  const categories = [...new Set(clients.map((client) => client.category))];
  const items: DirectoryItem[] = clients.map((client) => ({
    key: client.name,
    title: client.name,
    subtitle: client.descriptionZh || undefined,
    description: client.descriptionEn,
    category: client.category,
    badges: [client.sourceUrl ? "开源可参考" : "闭源", client.docsUrl ? "有官方技能文档" : "文档待补"],
    meta: `#${client.orderIndex}`,
    externalHref: client.url,
    secondaryHref: client.docsUrl ?? undefined,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          客户端清单 · {clients.length} 个支持 Agent Skills 的产品
        </h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          整理自{" "}
          <a
            href="https://agentskills.io/clients"
            target="_blank"
            rel="noreferrer"
            className="text-sky-300 underline decoration-sky-400/40 underline-offset-2"
          >
            官方 Client Showcase
          </a>
          。这里的价值在两点：一是验证「写一次、到处可用」的可移植性；二是做选型时可以直接跳到各产品的官方技能文档，
          确认它的加载路径、权限模型与激活可观测性。带「开源可参考」标签的产品适合对照其实现学习客户端集成。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300"
            >
              {category}：{clients.filter((client) => client.category === category).length}
            </span>
          ))}
        </div>
      </header>

      <SearchDirectory
        items={items}
        categories={categories}
        placeholder="搜索产品名或描述（例如 terminal、editor、enterprise…）"
      />

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">选型时的五个检查点</h2>
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-slate-300">
            {[
              "技能目录是否可配，是否兼容 .agents/skills/ 互操作约定。",
              "技能激活是否可观测（日志 / 工具调用记录）——这是做描述优化与评估的前提。",
              "权限模型：脚本执行是否逐次确认，是否支持 allowed-tools 白名单。",
              "技能目录是否在权限白名单内，避免读取 scripts/ 时反复弹窗。",
              "上下文压缩是否保护技能内容，重复激活是否去重。",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold text-white">下一步</h2>
          <p className="mt-2 text-[13px] leading-6 text-slate-400">
            如果你是要给自己的产品加技能支持，别只看清单——直接看实现指南的五步生命周期：
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/lifecycle"
              className="rounded-lg bg-indigo-400/90 px-3 py-1.5 text-xs font-medium text-[#0b1020] transition hover:bg-indigo-300"
            >
              客户端实现五步
            </Link>
            <Link
              href="/docs/adding-skills-support"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 transition hover:border-indigo-400/50"
            >
              精读实现文档
            </Link>
            <Link
              href="/docs/clients"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 transition hover:border-indigo-400/50"
            >
              客户端章节笔记
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
