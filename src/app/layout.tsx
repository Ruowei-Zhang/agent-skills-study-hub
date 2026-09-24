import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "Agent Skills 学习中心 · agentskills.io 全站文档精读",
  description:
    "把 agentskills.io 的全部 9 篇文档整理成可精读、可练习、可自检的学习中心：格式规范、技能创作最佳实践、描述优化、输出评估、脚本设计与客户端实现五步。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#070b16] text-slate-200 antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_15%_-10%,rgba(99,102,241,0.22),transparent),radial-gradient(50rem_30rem_at_85%_0%,rgba(56,189,248,0.16),transparent)]" />
        <TopNav />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
        <footer className="mt-16 border-t border-white/10 bg-[#080c1a]/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p>
              内容整理自{" "}
              <a
                href="https://agentskills.io/home"
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 underline decoration-slate-500 underline-offset-2"
              >
                agentskills.io
              </a>{" "}
              全部 9 篇官方文档（原文保留 + 中文精读笔记），并附题库、校验器与实践自检清单。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/docs" className="hover:text-slate-300">
                文档精读
              </Link>
              <Link href="/quiz" className="hover:text-slate-300">
                刻意练习
              </Link>
              <Link href="/checklist" className="hover:text-slate-300">
                实践自检
              </Link>
              <a
                href="https://github.com/agentskills/agentskills"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-300"
              >
                GitHub 规范仓库
              </a>
              <a
                href="https://github.com/Ruowei-Zhang/agent-skills-study-hub"
                target="_blank"
                rel="noreferrer"
                className="text-amber-200/80 hover:text-amber-200"
              >
                ⭐ 本站源码 · 求 Star
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
