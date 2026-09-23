import Link from "next/link";
import { disclosureTiers } from "@/data";
import { getLifecycleSteps } from "@/lib/content";

const scanPaths = [
  { scope: "项目", path: "<project>/.<your-client>/skills/", purpose: "客户端原生位置" },
  { scope: "项目", path: "<project>/.agents/skills/", purpose: "跨客户端互操作" },
  { scope: "用户", path: "~/.<your-client>/skills/", purpose: "客户端原生位置" },
  { scope: "用户", path: "~/.agents/skills/", purpose: "跨客户端互操作" },
];

export default function LifecyclePage() {
  const steps = getLifecycleSteps();

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">客户端实现：把技能支持接进你的 agent</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          这篇文档面向「实现者」：如果你在做一个 agent 或开发工具，需要按五个步骤把 Agent Skills
          接进来——发现、解析、披露、激活、长期上下文管理。下面把每一步的目标、关键决策与常见坑整理成可执行清单。
        </p>
        <p className="mt-3 text-xs text-slate-500">
          <Link href="/docs/adding-skills-support" className="text-sky-300 underline decoration-sky-400/40 underline-offset-2">
            阅读完整精读笔记（含全部代码示例）→
          </Link>
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {disclosureTiers.map((tier) => (
          <div key={tier.tier} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="text-[11px] uppercase tracking-widest text-indigo-300/80">第 {tier.tier} 层</span>
            <h2 className="mt-1 text-base font-semibold text-white">{tier.titleZh}</h2>
            <dl className="mt-3 space-y-1.5 text-[12.5px] text-slate-400">
              <div>加载：{tier.loaded}</div>
              <div>时机：{tier.when}</div>
              <div>成本：{tier.cost}</div>
            </dl>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">步骤 1 的目录矩阵（在每个 scope 里两份都扫）</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
            <thead className="text-slate-300">
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 font-medium">Scope</th>
                <th className="px-3 py-2 font-medium">路径</th>
                <th className="px-3 py-2 font-medium">用途</th>
              </tr>
            </thead>
            <tbody>
              {scanPaths.map((row) => (
                <tr key={row.path} className="border-b border-white/5">
                  <td className="px-3 py-3 text-slate-300">{row.scope}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-indigo-200">{row.path}</td>
                  <td className="px-3 py-3 text-slate-400">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12.5px] leading-6 text-slate-400">
          重名规则：<b className="text-slate-200">项目级覆盖用户级</b>，同 scope 内选定一种顺序并保持一致，冲突要打日志。
          项目级技能建议做信任门控，避免不可信仓库注入指令。
        </p>
      </section>

      <section className="space-y-5">
        {steps.map((step) => (
          <article key={step.step} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 text-sm font-bold text-[#0b1020]">
                {step.step}
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">{step.titleZh}</h2>
                <p className="text-[12px] text-slate-500">{step.titleEn}</p>
              </div>
            </div>
            <p className="mt-4 text-[13.5px] leading-7 text-slate-300">{step.goalZh}</p>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-indigo-300/80">关键动作</p>
                <ul className="space-y-2">
                  {step.detailsZh.map((detail) => (
                    <li key={detail} className="flex gap-2.5 text-[13px] leading-6 text-slate-300">
                      <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/80" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-amber-300/80">常见坑</p>
                <ul className="space-y-2">
                  {step.pitfallsZh.map((pitfall) => (
                    <li
                      key={pitfall}
                      className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[12.5px] leading-6 text-amber-100/90"
                    >
                      {pitfall}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">实现者的两个分支决策</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-[13.5px] font-semibold text-white">技能放在哪里？</h3>
            <p className="mt-2 text-[12.5px] leading-6 text-slate-400">
              本地 agent：扫描用户文件系统（项目级 + 用户级）。云端 / 沙箱：项目级随仓库进入沙箱；用户级与组织级需外部供给（配置仓库、URL/包、Web
              上传）；内置技能打包为部署产物里的静态资产。
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h3 className="text-[13.5px] font-semibold text-white">模型如何访问技能内容？</h3>
            <p className="mt-2 text-[12.5px] leading-6 text-slate-400">
              模型具备文件读取能力：目录里带上 location，直接读 SKILL.md（最简单）。否则注册专用工具（如 activate_skill），并考虑结构化包裹、资源列举与权限白名单。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
