import { db } from "@/db";
import {
  appMeta,
  clientProducts,
  docSections,
  docs as docsTable,
  glossaryTerms,
  lifecycleSteps as lifecycleTable,
  quizQuestions as quizTable,
  snippets as snippetsTable,
  specFields as specTable,
} from "@/db/schema";
import {
  checklist,
  clients,
  docs,
  glossary,
  lifecycleSteps,
  quizQuestions,
  specFields,
} from "@/data";

/** Bump when study content changes so a fresh preview reseeds itself. */
export const SEED_VERSION = "2026-02-agentskills-v1";

export async function seedContent() {
  await db.transaction(async (tx) => {
    await tx.delete(snippetsTable);
    await tx.delete(docSections);
    await tx.delete(docsTable);
    await tx.delete(specTable);
    await tx.delete(lifecycleTable);
    await tx.delete(glossaryTerms);
    await tx.delete(quizTable);
    await tx.delete(clientProducts);
    await tx.delete(appMeta);

    await tx.insert(docsTable).values(
      docs.map((doc) => ({
        slug: doc.slug,
        titleZh: doc.titleZh,
        titleEn: doc.titleEn,
        groupKey: doc.groupKey,
        groupZh: doc.groupZh,
        orderIndex: doc.orderIndex,
        sourceUrl: doc.sourceUrl,
        summaryZh: doc.summaryZh,
        difficulty: doc.difficulty,
        readMinutes: doc.readMinutes,
        keyPoints: doc.keyPoints,
        tags: doc.tags,
      })),
    );

    await tx.insert(docSections).values(
      docs.flatMap((doc) =>
        doc.sections.map((section, index) => ({
          docSlug: doc.slug,
          orderIndex: index + 1,
          anchor: section.anchor,
          headingZh: section.headingZh,
          headingEn: section.headingEn,
          contentZh: section.contentZh,
          contentEn: section.contentEn,
        })),
      ),
    );

    await tx.insert(snippetsTable).values(
      docs.flatMap((doc) =>
        doc.snippets.map((snippet) => ({
          docSlug: doc.slug,
          sectionAnchor: snippet.sectionAnchor,
          title: snippet.title,
          lang: snippet.lang,
          code: snippet.code,
          noteZh: snippet.noteZh,
        })),
      ),
    );

    await tx.insert(specTable).values(specFields);
    await tx.insert(lifecycleTable).values(
      lifecycleSteps.map((step) => ({
        step: step.step,
        titleZh: step.titleZh,
        titleEn: step.titleEn,
        goalZh: step.goalZh,
        detailsZh: step.detailsZh,
        pitfallsZh: step.pitfallsZh,
      })),
    );

    await tx.insert(glossaryTerms).values(glossary);
    await tx.insert(quizTable).values(
      quizQuestions.map((question, index) => ({
        docSlug: question.docSlug,
        difficulty: question.difficulty,
        prompt: question.prompt,
        options: question.options,
        answerIndex: question.answerIndex,
        explanationZh: question.explanationZh,
        orderIndex: index + 1,
      })),
    );
    await tx.insert(clientProducts).values(
      clients.map((client) => ({
        name: client.name,
        url: client.url,
        docsUrl: client.docsUrl,
        sourceUrl: client.sourceUrl,
        category: client.category,
        descriptionEn: client.descriptionEn,
        descriptionZh: client.descriptionZh,
        orderIndex: client.orderIndex,
      })),
    );

    await tx
      .insert(appMeta)
      .values([
        { key: "seed_version", value: SEED_VERSION },
        { key: "source_site", value: "https://agentskills.io" },
        { key: "checklist_count", value: String(checklist.length) },
      ]);
  });
}

let seedPromise: Promise<void> | null = null;

/** Ensure the study content tables exist and match the current content version. */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const rows = await db.select().from(appMeta).limit(50);
      const version = rows.find((row) => row.key === "seed_version")?.value;
      if (version !== SEED_VERSION) {
        await seedContent();
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
