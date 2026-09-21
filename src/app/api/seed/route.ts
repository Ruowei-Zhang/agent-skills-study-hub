import { sql } from "drizzle-orm";
import { db } from "@/db";
import { seedContent } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await seedContent();
    return Response.json({ ok: true, seeded: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const result = await db.execute<{ docs: number; sections: number }>(
      sql`select
            (select count(*) from docs)::int as docs,
            (select count(*) from doc_sections)::int as sections`,
    );
    return Response.json({ ok: true, counts: result.rows?.[0] ?? null });
  } catch {
    return Response.json({ ok: false, counts: null }, { status: 500 });
  }
}
