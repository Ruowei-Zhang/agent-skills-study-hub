"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

const links = [
  { href: "/", label: "学习总览" },
  { href: "/docs", label: "文档精读" },
  { href: "/spec", label: "格式校验器" },
  { href: "/lifecycle", label: "客户端实现五步" },
  { href: "/quiz", label: "刻意练习" },
  { href: "/review", label: "错题本" },
  { href: "/glossary", label: "术语表" },
  { href: "/clients", label: "客户端清单" },
  { href: "/checklist", label: "实践自检" },
  { href: "/notes", label: "我的笔记" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [term, setTerm] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080c1a]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 text-base font-black text-[#0b1020] shadow-lg shadow-indigo-500/30">
            AS
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-white">Agent Skills 学习中心</span>
            <span className="block text-[11px] text-slate-400">agentskills.io 全部文档精读</span>
          </span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap gap-1 text-[13px] md:order-2 md:w-auto">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  active
                    ? "bg-indigo-400/15 text-indigo-200 ring-1 ring-indigo-400/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form
          className="order-2 ml-auto md:order-3"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = term.trim();
            if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
          }}
        >
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="全文搜索…"
            className="w-36 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-slate-200 placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none sm:w-48"
          />
        </form>
      </div>
    </header>
  );
}

export default TopNav;
