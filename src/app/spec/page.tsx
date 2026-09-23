import Link from "next/link";
import { SpecValidator } from "@/components/SpecValidator";
import { getSpecFields } from "@/lib/content";

export default function SpecPage() {
  const fields = getSpecFields();

  return (
    <div className="space-y-9">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">格式规范 · 交互校验器</h1>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-slate-400">
          规范页定义的全部约束在这里都可以当场验证：name 的长度与字符集、与父目录名的一致性、description
          的 1024 字符上限与「何时使用」表达、compatibility 的 500 字符上限、metadata 的键值结构与 allowed-tools
          的格式。填写左侧表单，右侧实时给出错误/警告/通过项，并生成可直接粘贴的 frontmatter。
        </p>
        <p className="mt-3 text-xs text-slate-500">
          规则来源：
          <a
            href="https://agentskills.io/specification"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2"
          >
            agentskills.io/specification
          </a>
          　·　规范全文精读见
          <Link href="/docs/specification" className="ml-1 text-sky-300 underline decoration-sky-400/40 underline-offset-2">
            《格式规范：SKILL.md 完整参考》
          </Link>
        </p>
      </header>

      <SpecValidator />

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">frontmatter 字段速查表</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead className="text-slate-300">
              <tr className="border-b border-white/10">
                <th className="px-3 py-2 font-medium">字段</th>
                <th className="px-3 py-2 font-medium">必填</th>
                <th className="px-3 py-2 font-medium">约束</th>
                <th className="px-3 py-2 font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.field} className="border-b border-white/5 align-top">
                  <td className="px-3 py-3 font-mono text-[12.5px] text-indigo-200">{field.field}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] ${
                        field.required ? "bg-rose-400/15 text-rose-200" : "border border-white/10 text-slate-400"
                      }`}
                    >
                      {field.required ? "必填" : "可选"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-400">{field.constraints}</td>
                  <td className="px-3 py-3 text-slate-300">
                    {field.detailZh}
                    <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-[#060a15] px-3 py-2 font-mono text-[11.5px] text-slate-400">
                      <code>{field.example}</code>
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "目录结构的硬约束",
            body: "只要求存在 SKILL.md；scripts/、references/、assets/ 是约定而非强制。引用文件用相对技能根目录的路径，保持一层深度。",
            href: "/docs/specification#optional-directories",
          },
          {
            title: "渐进式披露的预算",
            body: "元数据约 100 token；SKILL.md 正文建议 < 5000 token 且不超过 500 行；资源按需加载。",
            href: "/docs/specification#progressive-disclosure",
          },
          {
            title: "官方校验方式",
            body: "skills-ref validate ./my-skill 检查 frontmatter 是否合法、命名是否符合约定；建议接入 CI。",
            href: "/docs/specification#validation",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-400/30"
          >
            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-[13px] leading-6 text-slate-400">{item.body}</p>
            <span className="mt-3 inline-block text-[11.5px] text-sky-300">查看对应章节 →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
