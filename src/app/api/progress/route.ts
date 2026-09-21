import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { docSections } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { setDocProgress } from "@/lib/queries";
import { isValidDocSlug } from "@/lib/validate";

export const dynamic = "force-dynamic";

type Payload = {
  docSlug?: string;
  status?: string;
  starred?: boolean;
  toggleSection?: string;
  sections?: string[];
  touch?: boolean;
};

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as Payload;
    if (!isValidDocSlug(body.docSlug)) {
      return Response.json({ ok: false, error: "docSlug is invalid" }, { status: 400 });
    }

    const [count] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(docSections)
      .where(eq(docSections.docSlug, body.docSlug));

    const result = await setDocProgress({
      docSlug: body.docSlug,
      status: body.status,
      starred: body.starred,
      toggleSection: body.toggleSection,
      sections: Array.isArray(body.sections) ? body.sections : undefined,
      touch: body.touch ?? true,
      totalSections: count?.total ?? 0,
    });

    return Response.json({ ok: true, progress: result });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}
