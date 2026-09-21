export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />
      <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
