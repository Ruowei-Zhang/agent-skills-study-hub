import { Suspense } from "react";
import { SearchClient } from "@/components/SearchClient";

// 静态导出模式下 ?q= 由客户端读取（useSearchParams 必须包在 Suspense 中）
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchClient />
    </Suspense>
  );
}
