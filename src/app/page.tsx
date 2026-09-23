import { docStats, disclosureTiers, learningPaths, SOURCE_SITE } from "@/data";
import { HomeDashboard } from "@/components/HomeDashboard";
import { getDocsCatalog } from "@/lib/content";

export default function DashboardPage() {
  return (
    <HomeDashboard
      catalog={getDocsCatalog()}
      paths={learningPaths}
      tiers={disclosureTiers}
      stats={docStats}
      sourceSite={SOURCE_SITE}
    />
  );
}
