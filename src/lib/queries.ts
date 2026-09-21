import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  clientProducts,
  docProgress,
  docSections,
  docs as docsTable,
  glossaryTerms,
  lifecycleSteps,
  notes as notesTable,
  quizAttempts,
  quizQuestions,
  snippets as snippetsTable,
  specFields,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export type ProgressRow = {
  docSlug: string;
  status: string;
  percent: number;
  starred: boolean;
  readCount: number;
  completedSections: string[];
  lastOpenedAt: Date | null;
  completedAt: Date | null;
};

export type DocCard = {
  slug: string;
  titleZh: string;
  titleEn: string;
  groupKey: string;
  groupZh: string;
  orderIndex: number;
  sourceUrl: string;
  summaryZh: string;
  difficulty: string;
  readMinutes: number;
  keyPoints: string[];
  tags: string[];
  sectionCount: number;
  snippetCount: number;
  progress: ProgressRow | null;
};

export type SectionRow = {
  id: number;
  docSlug: string;
  orderIndex: number;
  anchor: string;
  headingZh: string;
  headingEn: string;
  contentZh: string;
  contentEn: string;
  snippets: {
    id: number;
    title: string;
    lang: string;
    code: string;
    noteZh: string;
    sectionAnchor: string;
  }[];
};

export type NoteRow = {
  id: number;
  docSlug: string;
  sectionAnchor: string | null;
  content: string;
  updatedAt: Date;
};

async function progressRows(): Promise<Map<string, ProgressRow>> {
  const rows = await db.select().from(docProgress);
  return new Map(
    rows.map((row) => [
      row.docSlug,
      {
        docSlug: row.docSlug,
        status: row.status,
        percent: row.percent,
        starred: row.starred,
        readCount: row.readCount,
        completedSections: row.completedSections ?? [],
        lastOpenedAt: row.lastOpenedAt,
        completedAt: row.completedAt,
      },
    ]),
  );
}

export async function getDocsCatalog(): Promise<DocCard[]> {
  await ensureSeeded();
  const [docs, progress, sectionCounts, snippetCounts] = await Promise.all([
    db.select().from(docsTable).orderBy(asc(docsTable.orderIndex)),
    progressRows(),
    db
      .select({ docSlug: docSections.docSlug, count: sql<number>`count(*)::int` })
      .from(docSections)
      .groupBy(docSections.docSlug),
    db
      .select({ docSlug: snippetsTable.docSlug, count: sql<number>`count(*)::int` })
      .from(snippetsTable)
      .groupBy(snippetsTable.docSlug),
  ]);

  const sectionMap = new Map(sectionCounts.map((row) => [row.docSlug, row.count]));
  const snippetMap = new Map(snippetCounts.map((row) => [row.docSlug, row.count]));

  return docs.map((doc) => ({
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
    keyPoints: doc.keyPoints ?? [],
    tags: doc.tags ?? [],
    sectionCount: sectionMap.get(doc.slug) ?? 0,
    snippetCount: snippetMap.get(doc.slug) ?? 0,
    progress: progress.get(doc.slug) ?? null,
  }));
}

export async function getDocDetail(slug: string) {
  await ensureSeeded();
  const [doc] = await db.select().from(docsTable).where(eq(docsTable.slug, slug)).limit(1);
  if (!doc) return null;

  const [sections, snippetRows, progress, noteRows] = await Promise.all([
    db
      .select()
      .from(docSections)
      .where(eq(docSections.docSlug, slug))
      .orderBy(asc(docSections.orderIndex)),
    db
      .select()
      .from(snippetsTable)
      .where(eq(snippetsTable.docSlug, slug))
      .orderBy(asc(snippetsTable.id)),
    db.select().from(docProgress).where(eq(docProgress.docSlug, slug)).limit(1),
    db
      .select()
      .from(notesTable)
      .where(eq(notesTable.docSlug, slug))
      .orderBy(desc(notesTable.updatedAt)),
  ]);

  const snippetByAnchor = new Map<string, SectionRow["snippets"]>();
  for (const snippet of snippetRows) {
    const list = snippetByAnchor.get(snippet.sectionAnchor) ?? [];
    list.push({
      id: snippet.id,
      title: snippet.title,
      lang: snippet.lang,
      code: snippet.code,
      noteZh: snippet.noteZh,
      sectionAnchor: snippet.sectionAnchor,
    });
    snippetByAnchor.set(snippet.sectionAnchor, list);
  }

  const row = progress[0];
  return {
    doc: {
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
      keyPoints: doc.keyPoints ?? [],
      tags: doc.tags ?? [],
    },
    sections: sections.map<SectionRow>((section) => ({
      id: section.id,
      docSlug: section.docSlug,
      orderIndex: section.orderIndex,
      anchor: section.anchor,
      headingZh: section.headingZh,
      headingEn: section.headingEn,
      contentZh: section.contentZh,
      contentEn: section.contentEn,
      snippets: snippetByAnchor.get(section.anchor) ?? [],
    })),
    progress: row
      ? {
          docSlug: row.docSlug,
          status: row.status,
          percent: row.percent,
          starred: row.starred,
          readCount: row.readCount,
          completedSections: row.completedSections ?? [],
          lastOpenedAt: row.lastOpenedAt,
          completedAt: row.completedAt,
        }
      : null,
    notes: noteRows.map<NoteRow>((note) => ({
      id: note.id,
      docSlug: note.docSlug,
      sectionAnchor: note.sectionAnchor,
      content: note.content,
      updatedAt: note.updatedAt,
    })),
  };
}

export type DocDetail = NonNullable<Awaited<ReturnType<typeof getDocDetail>>>;

export async function setDocProgress(input: {
  docSlug: string;
  status?: string;
  starred?: boolean;
  toggleSection?: string;
  sections?: string[];
  totalSections: number;
  touch?: boolean;
}) {
  const [existing] = await db
    .select()
    .from(docProgress)
    .where(eq(docProgress.docSlug, input.docSlug))
    .limit(1);

  const completed = new Set(input.sections ?? existing?.completedSections ?? []);
  if (input.toggleSection) {
    if (completed.has(input.toggleSection)) completed.delete(input.toggleSection);
    else completed.add(input.toggleSection);
  }

  const completedSections = [...completed];
  const total = Math.max(input.totalSections, 1);
  const computedPercent = Math.round((completedSections.length / total) * 100);
  const status =
    input.status ??
    (computedPercent >= 100 ? "mastered" : computedPercent > 0 ? "reading" : existing?.status ?? "unread");
  const percent = input.status === "mastered" ? 100 : computedPercent;

  const values = {
    docSlug: input.docSlug,
    status,
    percent,
    starred: input.starred ?? existing?.starred ?? false,
    readCount: (existing?.readCount ?? 0) + (input.touch ? 1 : 0),
    completedSections,
    lastOpenedAt: input.touch || existing === undefined ? new Date() : existing.lastOpenedAt,
    completedAt: status === "mastered" ? existing?.completedAt ?? new Date() : null,
  };

  await db
    .insert(docProgress)
    .values(values)
    .onConflictDoUpdate({ target: docProgress.docSlug, set: values });

  return values;
}

export async function listNotes() {
  await ensureSeeded();
  const rows = await db.select().from(notesTable).orderBy(desc(notesTable.updatedAt));
  const docRows = await db
    .select({ slug: docsTable.slug, titleZh: docsTable.titleZh, orderIndex: docsTable.orderIndex })
    .from(docsTable);
  const docMap = new Map(docRows.map((doc) => [doc.slug, doc]));
  return rows.map((note) => ({
    id: note.id,
    docSlug: note.docSlug,
    docTitleZh: docMap.get(note.docSlug)?.titleZh ?? note.docSlug,
    sectionAnchor: note.sectionAnchor,
    content: note.content,
    updatedAt: note.updatedAt,
  }));
}

export async function addNote(input: { docSlug: string; sectionAnchor?: string | null; content: string }) {
  const [row] = await db
    .insert(notesTable)
    .values({
      docSlug: input.docSlug,
      sectionAnchor: input.sectionAnchor ?? null,
      content: input.content,
    })
    .returning();
  return row;
}

export async function deleteNote(id: number) {
  await db.delete(notesTable).where(eq(notesTable.id, id));
}

export async function getSpecFields() {
  await ensureSeeded();
  return db.select().from(specFields).orderBy(asc(specFields.orderIndex));
}

export async function getLifecycleSteps() {
  await ensureSeeded();
  return db.select().from(lifecycleSteps).orderBy(asc(lifecycleSteps.step));
}

export async function getGlossary() {
  await ensureSeeded();
  return db.select().from(glossaryTerms).orderBy(asc(glossaryTerms.category), asc(glossaryTerms.term));
}

export async function getClients() {
  await ensureSeeded();
  return db.select().from(clientProducts).orderBy(asc(clientProducts.orderIndex));
}

export async function getQuizBank(docSlug?: string) {
  await ensureSeeded();
  if (docSlug && docSlug !== "all") {
    return db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.docSlug, docSlug))
      .orderBy(asc(quizQuestions.orderIndex));
  }
  return db.select().from(quizQuestions).orderBy(asc(quizQuestions.orderIndex));
}

export async function getQuizHistory(limit = 8) {
  await ensureSeeded();
  const rows = await db.select().from(quizAttempts).orderBy(desc(quizAttempts.createdAt)).limit(limit);
  const docRows = await db
    .select({ slug: docsTable.slug, titleZh: docsTable.titleZh })
    .from(docsTable);
  const docMap = new Map(docRows.map((doc) => [doc.slug, doc.titleZh]));
  return rows.map((row) => ({
    id: row.id,
    docSlug: row.docSlug,
    docTitleZh:
      row.docSlug === "all"
        ? "混合作答"
        : row.docSlug === "wrong"
          ? "错题重练"
          : docMap.get(row.docSlug) ?? row.docSlug,
    total: row.total,
    correct: row.correct,
    createdAt: row.createdAt,
  }));
}

export async function saveQuizAttempt(docSlug: string, answers: { questionId: number; chosenIndex: number }[]) {
  const ids = answers.map((answer) => answer.questionId);
  if (ids.length === 0) return { total: 0, correct: 0, results: [] as { questionId: number; correct: boolean }[] };

  const questions = await db.select().from(quizQuestions);
  const byId = new Map(questions.filter((q) => ids.includes(q.id)).map((q) => [q.id, q]));

  const results = answers
    .map((answer) => {
      const question = byId.get(answer.questionId);
      if (!question) return null;
      return {
        questionId: answer.questionId,
        chosenIndex: answer.chosenIndex,
        correct: question.answerIndex === answer.chosenIndex,
      };
    })
    .filter((row): row is { questionId: number; chosenIndex: number; correct: boolean } => row !== null);

  const correct = results.filter((row) => row.correct).length;
  await db.insert(quizAttempts).values({
    docSlug,
    total: results.length,
    correct,
    answers: results,
  });
  return { total: results.length, correct, results };
}

export async function getQuizStats() {
  await ensureSeeded();
  const [row] = await db
    .select({
      attempts: sql<number>`count(*)::int`,
      answered: sql<number>`coalesce(sum(${quizAttempts.total}), 0)::int`,
      correct: sql<number>`coalesce(sum(${quizAttempts.correct}), 0)::int`,
    })
    .from(quizAttempts);
  return {
    attempts: row?.attempts ?? 0,
    answered: row?.answered ?? 0,
    correct: row?.correct ?? 0,
    accuracy: row && row.answered > 0 ? Math.round((row.correct / row.answered) * 100) : 0,
  };
}

export async function getInterruptedDocs(limit = 3) {
  const catalog = await getDocsCatalog();
  return catalog
    .filter((doc) => doc.progress && doc.progress.percent > 0 && doc.progress.percent < 100)
    .sort((a, b) => {
      const aTime = a.progress?.lastOpenedAt ? new Date(a.progress.lastOpenedAt).getTime() : 0;
      const bTime = b.progress?.lastOpenedAt ? new Date(b.progress.lastOpenedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

export async function getNextDoc(): Promise<DocCard | null> {
  const catalog = await getDocsCatalog();
  const unfinished = catalog.find((doc) => !doc.progress || doc.progress.percent < 100);
  return unfinished ?? catalog[0] ?? null;
}

export type SearchHit = {
  docSlug: string;
  docTitleZh: string;
  kind: "章节" | "代码示例" | "术语" | "客户端";
  title: string;
  snippet: string;
  href: string;
};

export async function searchEverything(term: string, limit = 40): Promise<SearchHit[]> {
  await ensureSeeded();
  const q = term.trim();
  if (q.length < 1) return [];
  const like = `%${q}%`;

  const [sectionRows, snippetRows, glossaryRows, clientRows] = await Promise.all([
    db
      .select({
        docSlug: docSections.docSlug,
        headingZh: docSections.headingZh,
        contentZh: docSections.contentZh,
        anchor: docSections.anchor,
      })
      .from(docSections)
      .where(
        and(
          sql`(${docSections.headingZh} ILIKE ${like} OR ${docSections.contentZh} ILIKE ${like} OR ${docSections.headingEn} ILIKE ${like})`,
        ),
      )
      .limit(limit),
    db
      .select({
        docSlug: snippetsTable.docSlug,
        title: snippetsTable.title,
        code: snippetsTable.code,
        anchor: snippetsTable.sectionAnchor,
      })
      .from(snippetsTable)
      .where(sql`(${snippetsTable.title} ILIKE ${like} OR ${snippetsTable.code} ILIKE ${like})`)
      .limit(limit),
    db
      .select()
      .from(glossaryTerms)
      .where(sql`(${glossaryTerms.term} ILIKE ${like} OR ${glossaryTerms.termZh} ILIKE ${like} OR ${glossaryTerms.definitionZh} ILIKE ${like})`)
      .limit(limit),
    db
      .select()
      .from(clientProducts)
      .where(sql`(${clientProducts.name} ILIKE ${like} OR ${clientProducts.descriptionEn} ILIKE ${like} OR ${clientProducts.descriptionZh} ILIKE ${like})`)
      .limit(limit),
  ]);

  const docRows = await db
    .select({ slug: docsTable.slug, titleZh: docsTable.titleZh })
    .from(docsTable);
  const docMap = new Map(docRows.map((doc) => [doc.slug, doc.titleZh]));

  const hits: SearchHit[] = [
    ...sectionRows.map((row) => ({
      docSlug: row.docSlug,
      docTitleZh: docMap.get(row.docSlug) ?? row.docSlug,
      kind: "章节" as const,
      title: row.headingZh,
      snippet: row.contentZh.replace(/\s+/g, " ").slice(0, 160),
      href: `/docs/${row.docSlug}#${row.anchor}`,
    })),
    ...snippetRows.map((row) => ({
      docSlug: row.docSlug,
      docTitleZh: docMap.get(row.docSlug) ?? row.docSlug,
      kind: "代码示例" as const,
      title: row.title,
      snippet: row.code.replace(/\s+/g, " ").slice(0, 160),
      href: `/docs/${row.docSlug}#${row.anchor}`,
    })),
    ...glossaryRows.map((row) => ({
      docSlug: row.docSlug,
      docTitleZh: docMap.get(row.docSlug) ?? row.docSlug,
      kind: "术语" as const,
      title: `${row.term} · ${row.termZh}`,
      snippet: row.definitionZh.slice(0, 160),
      href: `/glossary?q=${encodeURIComponent(row.term)}`,
    })),
    ...clientRows.map((row) => ({
      docSlug: "clients",
      docTitleZh: "客户端清单",
      kind: "客户端" as const,
      title: row.name,
      snippet: (row.descriptionZh || row.descriptionEn).slice(0, 160),
      href: `/clients?q=${encodeURIComponent(row.name)}`,
    })),
  ];

  return hits.slice(0, limit);
}

export type WrongQuestion = {
  id: number;
  docSlug: string;
  docTitleZh: string;
  difficulty: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanationZh: string;
  wrongCount: number;
  correctCount: number;
  totalCount: number;
  lastWrongAt: Date | null;
};

/** 错题明细：从 quiz_attempts.answers 的逐题明细里聚合出「答错过」的题目。 */
export async function getWrongQuestions(): Promise<WrongQuestion[]> {
  await ensureSeeded();
  const stats = await db.execute<{
    question_id: number;
    wrong_count: number;
    correct_count: number;
    total_count: number;
    last_wrong_at: string | null;
  }>(sql`
    select
      (item->>'questionId')::int as question_id,
      sum(case when (item->>'correct')::boolean then 0 else 1 end)::int as wrong_count,
      sum(case when (item->>'correct')::boolean then 1 else 0 end)::int as correct_count,
      count(*)::int as total_count,
      max(case when (item->>'correct')::boolean then null else quiz_attempts.created_at end) as last_wrong_at
    from quiz_attempts, jsonb_array_elements(quiz_attempts.answers) as item
    group by 1
    having sum(case when (item->>'correct')::boolean then 0 else 1 end) > 0
    order by wrong_count desc, last_wrong_at desc
  `);

  const rows = stats.rows ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.question_id);
  const questions = await db.select().from(quizQuestions).where(inArray(quizQuestions.id, ids));
  const byId = new Map(questions.map((question) => [question.id, question]));

  const docRows = await db
    .select({ slug: docsTable.slug, titleZh: docsTable.titleZh })
    .from(docsTable);
  const docMap = new Map(docRows.map((doc) => [doc.slug, doc.titleZh]));

  return rows
    .map((row) => {
      const question = byId.get(row.question_id);
      if (!question) return null;
      return {
        id: question.id,
        docSlug: question.docSlug,
        docTitleZh: docMap.get(question.docSlug) ?? question.docSlug,
        difficulty: question.difficulty,
        prompt: question.prompt,
        options: question.options,
        answerIndex: question.answerIndex,
        explanationZh: question.explanationZh,
        wrongCount: row.wrong_count,
        correctCount: row.correct_count,
        totalCount: row.total_count,
        lastWrongAt: row.last_wrong_at ? new Date(row.last_wrong_at) : null,
      };
    })
    .filter((row): row is WrongQuestion => row !== null);
}

export type WrongSummary = {
  wrongQuestions: number;
  wrongTotal: number;
  attemptedQuestions: number;
};

/** 错题本汇总统计：错题数、累计错误次数、已练过的题目总数。 */
export async function getWrongSummary(): Promise<WrongSummary> {
  await ensureSeeded();
  const result = await db.execute<{
    wrong_questions: number;
    wrong_total: number;
    attempted_questions: number;
  }>(sql`
    select
      coalesce(sum(case when t.wrong_count > 0 then 1 else 0 end), 0)::int as wrong_questions,
      coalesce(sum(t.wrong_count), 0)::int as wrong_total,
      count(*)::int as attempted_questions
    from (
      select (item->>'questionId')::int as question_id,
             sum(case when (item->>'correct')::boolean then 0 else 1 end)::int as wrong_count
      from quiz_attempts, jsonb_array_elements(quiz_attempts.answers) as item
      group by 1
    ) t
  `);
  const row = (result.rows ?? [])[0];
  return {
    wrongQuestions: row?.wrong_questions ?? 0,
    wrongTotal: row?.wrong_total ?? 0,
    attemptedQuestions: row?.attempted_questions ?? 0,
  };
}
