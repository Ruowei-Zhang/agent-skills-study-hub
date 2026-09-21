import type { ReactNode } from "react";

type Inline = { text: string; type: "text" | "code" | "bold" | "link" };

function parseInline(input: string): Inline[] {
  const pattern = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*|https?:\/\/[^\s)|]+)/g;
  const parts: Inline[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push({ text: input.slice(lastIndex, index), type: "text" });
    const token = match[0];
    if (token.startsWith("[[")) parts.push({ text: token.slice(2, -2), type: "code" });
    else if (token.startsWith("**")) parts.push({ text: token.slice(2, -2), type: "bold" });
    else parts.push({ text: token, type: "link" });
    lastIndex = index + token.length;
  }
  if (lastIndex < input.length) parts.push({ text: input.slice(lastIndex), type: "text" });
  return parts;
}

function InlineText({ value }: { value: string }) {
  return (
    <>
      {parseInline(value).map((part, index) => {
        if (part.type === "code") {
          return (
            <code
              key={index}
              className="rounded-md border border-indigo-400/20 bg-indigo-400/10 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-100"
            >
              {part.text}
            </code>
          );
        }
        if (part.type === "bold") {
          return (
            <strong key={index} className="font-semibold text-white">
              {part.text}
            </strong>
          );
        }
        if (part.type === "link") {
          return (
            <a
              key={index}
              href={part.text}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sky-300 underline decoration-sky-400/40 underline-offset-2 hover:text-sky-200"
            >
              {part.text}
            </a>
          );
        }
        return <span key={index}>{part.text}</span>;
      })}
    </>
  );
}

type Block =
  | { kind: "paragraph"; lines: string[] }
  | { kind: "heading"; level: number; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "quote"; lines: string[] }
  | { kind: "table"; header: string[]; rows: string[][] };

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function toBlocks(content: string): Block[] {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length ?? 2;
      blocks.push({ kind: "heading", level, text: trimmed.replace(/^#+\s*/, "") });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      const [headerLine, ...rest] = tableLines;
      const bodyLines = rest.filter((row) => !/^\|[\s|:-]+\|$/.test(row.trim()));
      blocks.push({
        kind: "table",
        header: splitRow(headerLine),
        rows: bodyLines.map(splitRow),
      });
      continue;
    }

    if (/^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
      const ordered = /^\d+\.\s/.test(trimmed);
      const items: string[] = [];
      while (
        index < lines.length &&
        (/^[-*]\s/.test(lines[index].trim()) || /^\d+\.\s/.test(lines[index].trim()))
      ) {
        items.push(lines[index].trim().replace(/^([-*]|\d+\.)\s*/, ""));
        index += 1;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoted: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoted.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ kind: "quote", lines: quoted });
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^#{1,6}\s/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("|") &&
      !lines[index].trim().startsWith(">") &&
      !/^[-*]\s/.test(lines[index].trim()) &&
      !/^\d+\.\s/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", lines: paragraph });
  }

  return blocks;
}

export function MarkdownLite({ content, className = "" }: { content: string; className?: string }) {
  const blocks = toBlocks(content);
  return (
    <div className={`space-y-3 text-[0.95rem] leading-7 text-slate-300 ${className}`}>
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          const sizes = ["text-lg", "text-base", "text-sm"];
          return (
            <h4
              key={index}
              className={`pt-2 font-semibold tracking-tight text-white ${sizes[Math.min(block.level - 1, 2)]}`}
            >
              <InlineText value={block.text} />
            </h4>
          );
        }
        if (block.kind === "list") {
          const Wrapper = block.ordered ? "ol" : "ul";
          return (
            <Wrapper key={index} className="space-y-2 pl-1">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2.5">
                  <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70" />
                  <span>
                    <InlineText value={item} />
                  </span>
                </li>
              ))}
            </Wrapper>
          );
        }
        if (block.kind === "quote") {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-sky-400/60 bg-sky-400/5 py-2 pl-4 text-slate-300"
            >
              {block.lines.map((line, lineIndex) => (
                <p key={lineIndex}>
                  <InlineText value={line} />
                </p>
              ))}
            </blockquote>
          );
        }
        if (block.kind === "table") {
          return (
            <div key={index} className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-white/5 text-slate-200">
                  <tr>
                    {block.header.map((cell, cellIndex) => (
                      <th key={cellIndex} className="px-3 py-2 font-medium">
                        <InlineText value={cell} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-white/5">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 align-top text-slate-300">
                          <InlineText value={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? " " : null}
                <InlineText value={line} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownLite;
