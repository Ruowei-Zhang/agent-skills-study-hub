import { saveQuizAttempt } from "@/lib/queries";
import { ensureSeeded } from "@/db/seed";
import { isValidDocSlug } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as {
      docSlug?: string;
      answers?: { questionId: number; chosenIndex: number }[];
    };
    if (!isValidDocSlug(body.docSlug) || !Array.isArray(body.answers) || body.answers.length === 0) {
      return Response.json({ ok: false, error: "docSlug and answers are required" }, { status: 400 });
    }
    if (body.answers.length > 200) {
      return Response.json({ ok: false, error: "too many answers" }, { status: 400 });
    }
    const result = await saveQuizAttempt(body.docSlug, body.answers);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}
