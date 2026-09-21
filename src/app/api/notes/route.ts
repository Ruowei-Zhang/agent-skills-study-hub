import { addNote, deleteNote } from "@/lib/queries";
import { ensureSeeded } from "@/db/seed";
import { isValidDocSlug } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json()) as {
      docSlug?: string;
      sectionAnchor?: string | null;
      content?: string;
    };
    if (!isValidDocSlug(body.docSlug) || !body.content?.trim()) {
      return Response.json({ ok: false, error: "docSlug and content are required" }, { status: 400 });
    }
    const note = await addNote({
      docSlug: body.docSlug,
      sectionAnchor: body.sectionAnchor ?? null,
      content: body.content.trim().slice(0, 4000),
    });
    return Response.json({ ok: true, note });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!Number.isFinite(id)) {
      return Response.json({ ok: false, error: "id is required" }, { status: 400 });
    }
    await deleteNote(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "unknown error" },
      { status: 500 },
    );
  }
}
