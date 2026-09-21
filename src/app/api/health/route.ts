import { sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      await ensureSeeded();
    } catch {
      // health must stay green even if seeding fails; pages will retry.
    }
    const result = await db.execute<{
      docs: number;
      sections: number;
      questions: number;
      clients: number;
    }>(sql`select
      (select count(*) from docs)::int as docs,
      (select count(*) from doc_sections)::int as sections,
      (select count(*) from quiz_questions)::int as questions,
      (select count(*) from client_products)::int as clients`);
    const counts = (result.rows ?? [])[0] ?? { docs: 0, sections: 0, questions: 0, clients: 0 };
    return Response.json({ ok: true, service: "agent-skills-study-hub", counts });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
