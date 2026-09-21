"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-400/30 bg-rose-400/[0.06] p-8 text-center">
      <p className="text-3xl">⚠️</p>
      <h1 className="mt-3 text-lg font-semibold text-white">页面加载失败</h1>
      <p className="mt-2 text-[13.5px] leading-6 text-slate-300">
        数据库可能未启动或连接失败。请确认 PostgreSQL 正在运行、<code className="rounded bg-white/10 px-1.5 py-0.5">DATABASE_URL</code>{" "}
        配置正确，然后重试。
      </p>
      <p className="mt-2 text-[12px] text-slate-500">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-xl bg-gradient-to-r from-indigo-400 to-sky-400 px-5 py-2.5 text-sm font-semibold text-[#0b1020] transition hover:brightness-110"
      >
        重试
      </button>
    </div>
  );
}
