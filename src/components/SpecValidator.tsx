"use client";

import { useMemo, useState } from "react";

type Issue = { level: "error" | "warn" | "ok"; message: string };

const EXAMPLE = {
  folderName: "pdf-processing",
  name: "pdf-processing",
  description:
    "Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.",
  license: "Apache-2.0",
  compatibility: "",
  metadata: 'author: example-org\nversion: "1.0"',
  allowedTools: "",
};

export function SpecValidator() {
  const [folderName, setFolderName] = useState(EXAMPLE.folderName);
  const [name, setName] = useState(EXAMPLE.name);
  const [description, setDescription] = useState(EXAMPLE.description);
  const [license, setLicense] = useState(EXAMPLE.license);
  const [compatibility, setCompatibility] = useState("");
  const [metadata, setMetadata] = useState(EXAMPLE.metadata);
  const [allowedTools, setAllowedTools] = useState("");

  const issues = useMemo<Issue[]>(() => {
    const list: Issue[] = [];
    const trimmedName = name.trim();

    if (!trimmedName) list.push({ level: "error", message: "name 必填：1-64 字符。" });
    else {
      if (trimmedName.length > 64) list.push({ level: "error", message: "name 超过 64 字符上限。" });
      if (!/^[a-z0-9-]+$/.test(trimmedName))
        list.push({
          level: "error",
          message: "name 只能包含小写字母、数字与连字符（不允许大写、空格、下划线、点）。",
        });
      if (trimmedName.startsWith("-") || trimmedName.endsWith("-"))
        list.push({ level: "error", message: "name 不能以连字符开头或结尾。" });
      if (trimmedName.includes("--"))
        list.push({ level: "error", message: "name 不允许出现连续连字符（--）。" });
      if (folderName.trim() && trimmedName !== folderName.trim())
        list.push({ level: "warn", message: "name 应与父目录名一致；不一致时多数客户端会告警但仍加载。" });
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) list.push({ level: "error", message: "description 必填且不能为空。" });
    else {
      if (trimmedDescription.length > 1024)
        list.push({ level: "error", message: `description 超过 1024 字符上限（当前 ${trimmedDescription.length}）。` });
      if (!/use (this skill )?when|use for|使用|当/i.test(trimmedDescription))
        list.push({
          level: "warn",
          message: "description 建议明确说明「什么时候用」（例如 Use when…），触发判断完全依赖它。",
        });
      if (trimmedDescription.length < 60)
        list.push({
          level: "warn",
          message: "description 偏短：建议同时覆盖能力范围与适用场景，并包含关键触发词。",
        });
    }

    const trimmedCompatibility = compatibility.trim();
    if (trimmedCompatibility) {
      if (trimmedCompatibility.length > 500)
        list.push({ level: "error", message: "compatibility 超过 500 字符上限。" });
    } else {
      list.push({ level: "ok", message: "未填写 compatibility——大多数技能并不需要它。" });
    }

    const trimmedLicense = license.trim();
    if (trimmedLicense.length > 80)
      list.push({ level: "warn", message: "license 建议保持简短：许可证名称或随包许可文件名。" });

    const metadataLines = metadata
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    metadataLines.forEach((line) => {
      if (!line.includes(":"))
        list.push({ level: "error", message: `metadata 行「${line}」不是合法的 key: value。` });
      else if (!/^[A-Za-z0-9_.-]+:/.test(line))
        list.push({ level: "warn", message: `metadata 键建议使用字母数字与 . _ -：「${line}」。` });
    });
    if (metadataLines.some((line) => /^(name|description|license):/i.test(line)))
      list.push({
        level: "warn",
        message: "metadata 键名建议足够独特，避免与规范字段或其他实现冲突。",
      });

    const trimmedTools = allowedTools.trim();
    if (trimmedTools && trimmedTools.includes(","))
      list.push({ level: "error", message: "allowed-tools 是空格分隔的字符串，不要用逗号。" });
    if (trimmedTools)
      list.push({ level: "warn", message: "allowed-tools 属于实验性字段，不同客户端支持程度差异较大。" });

    if (!list.some((issue) => issue.level === "error"))
      list.push({ level: "ok", message: "必填约束全部通过，可以用 skills-ref validate ./<skill> 再做一次机械校验。" });

    return list;
  }, [folderName, name, description, license, compatibility, metadata, allowedTools]);

  const frontmatter = useMemo(() => {
    const lines = ["---", `name: ${name || "skill-name"}`, "description: >"];
    (description || "Describe what this skill does and when to use it.")
      .split("\n")
      .forEach((line) => lines.push(`  ${line.trim()}`));
    if (license.trim()) lines.push(`license: ${license.trim()}`);
    if (compatibility.trim()) lines.push(`compatibility: ${compatibility.trim()}`);
    const metadataLines = metadata
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (metadataLines.length) {
      lines.push("metadata:");
      metadataLines.forEach((line) => lines.push(`  ${line}`));
    }
    if (allowedTools.trim()) lines.push(`allowed-tools: ${allowedTools.trim()}`);
    lines.push("---");
    return lines.join("\n");
  }, [name, description, license, compatibility, metadata, allowedTools]);

  const errorCount = issues.filter((issue) => issue.level === "error").length;
  const warnCount = issues.filter((issue) => issue.level === "warn").length;

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">按规范逐项检查 frontmatter</h2>
          <button
            type="button"
            onClick={() => {
              setFolderName(EXAMPLE.folderName);
              setName(EXAMPLE.name);
              setDescription(EXAMPLE.description);
              setLicense(EXAMPLE.license);
              setCompatibility(EXAMPLE.compatibility);
              setMetadata(EXAMPLE.metadata);
              setAllowedTools(EXAMPLE.allowedTools);
            }}
            className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] text-slate-300 transition hover:text-white"
          >
            载入示例
          </button>
        </div>

        <label className="block text-xs text-slate-400">
          父目录名（用于一致性检查）
          <input value={folderName} onChange={(event) => setFolderName(event.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-xs text-slate-400">
          name（必填，≤64 字符，小写字母/数字/连字符）
          <input value={name} onChange={(event) => setName(event.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-xs text-slate-400">
          description（必填，1-1024 字符：做什么 + 什么时候用）
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className={`mt-1.5 ${inputClass}`}
          />
          <span className={`mt-1 block text-[11px] ${description.length > 1024 ? "text-rose-300" : "text-slate-500"}`}>
            {description.length} / 1024 字符
          </span>
        </label>
        <label className="block text-xs text-slate-400">
          license（可选，保持简短）
          <input value={license} onChange={(event) => setLicense(event.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-xs text-slate-400">
          compatibility（可选，≤500 字符）
          <input
            value={compatibility}
            onChange={(event) => setCompatibility(event.target.value)}
            placeholder="Requires git, docker, jq, and access to the internet"
            className={`mt-1.5 ${inputClass}`}
          />
        </label>
        <label className="block text-xs text-slate-400">
          metadata（可选，每行一个 key: value）
          <textarea
            value={metadata}
            onChange={(event) => setMetadata(event.target.value)}
            rows={3}
            className={`mt-1.5 font-mono ${inputClass}`}
          />
        </label>
        <label className="block text-xs text-slate-400">
          allowed-tools（可选，空格分隔，实验性）
          <input
            value={allowedTools}
            onChange={(event) => setAllowedTools(event.target.value)}
            placeholder="Bash(git:*) Bash(jq:*) Read"
            className={`mt-1.5 font-mono ${inputClass}`}
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-white">校验结果</h2>
            <span className="text-[11px] text-slate-400">
              {errorCount} 个错误 · {warnCount} 个警告
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-[13px] leading-6">
            {issues.map((issue, index) => (
              <li
                key={index}
                className={`rounded-xl border px-3 py-2 ${
                  issue.level === "error"
                    ? "border-rose-400/30 bg-rose-400/[0.08] text-rose-100"
                    : issue.level === "warn"
                      ? "border-amber-400/30 bg-amber-400/[0.08] text-amber-100"
                      : "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-100"
                }`}
              >
                <span className="mr-2">{issue.level === "error" ? "✕" : issue.level === "warn" ? "!" : "✓"}</span>
                {issue.message}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#060a15]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
            <span className="text-xs font-medium text-slate-300">生成的 SKILL.md frontmatter</span>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(frontmatter)}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300 transition hover:text-white"
            >
              复制
            </button>
          </div>
          <pre className="max-h-[22rem] overflow-auto px-4 py-3 text-[12.5px] leading-6 text-slate-300">
            <code>{frontmatter}</code>
          </pre>
        </div>

        <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-[12.5px] leading-6 text-slate-400">
          浏览器版检查覆盖 name / description / compatibility 的长度与字符集约束、目录名一致性、metadata 结构与
          allowed-tools 格式。上线前建议再跑一次官方参考库：
          <code className="ml-1 rounded-md border border-indigo-400/20 bg-indigo-400/10 px-1.5 py-0.5 font-mono text-[11.5px] text-indigo-100">
            skills-ref validate ./pdf-processing
          </code>
        </p>
      </div>
    </div>
  );
}

export default SpecValidator;
