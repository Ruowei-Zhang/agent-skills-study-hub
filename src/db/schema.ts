import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/** Small key/value table used to version the seeded study content. */
export const appMeta = pgTable("app_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One row per documentation page harvested from agentskills.io */
export const docs = pgTable(
  "docs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    titleZh: text("title_zh").notNull(),
    titleEn: text("title_en").notNull(),
    groupKey: text("group_key").notNull(),
    groupZh: text("group_zh").notNull(),
    orderIndex: integer("order_index").notNull(),
    sourceUrl: text("source_url").notNull(),
    summaryZh: text("summary_zh").notNull(),
    difficulty: text("difficulty").notNull(),
    readMinutes: integer("read_minutes").notNull(),
    keyPoints: jsonb("key_points").$type<string[]>().notNull(),
    tags: jsonb("tags").$type<string[]>().notNull(),
  },
  (table) => [uniqueIndex("docs_slug_unique").on(table.slug)],
);

/** Study sections (Chinese notes + original English excerpt) for each page */
export const docSections = pgTable("doc_sections", {
  id: serial("id").primaryKey(),
  docSlug: text("doc_slug").notNull(),
  orderIndex: integer("order_index").notNull(),
  anchor: text("anchor").notNull(),
  headingZh: text("heading_zh").notNull(),
  headingEn: text("heading_en").notNull(),
  contentZh: text("content_zh").notNull(),
  contentEn: text("content_en").notNull(),
});

/** Code examples pulled from the docs (fenced blocks) */
export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  docSlug: text("doc_slug").notNull(),
  sectionAnchor: text("section_anchor").notNull(),
  title: text("title").notNull(),
  lang: text("lang").notNull(),
  code: text("code").notNull(),
  noteZh: text("note_zh").notNull(),
});

/** Frontmatter field reference table from the specification page */
export const specFields = pgTable("spec_fields", {
  id: serial("id").primaryKey(),
  field: text("field").notNull(),
  required: boolean("required").notNull(),
  constraints: text("constraints").notNull(),
  detailZh: text("detail_zh").notNull(),
  example: text("example").notNull(),
  orderIndex: integer("order_index").notNull(),
});

/** The 5-step integration lifecycle for client implementors */
export const lifecycleSteps = pgTable("lifecycle_steps", {
  id: serial("id").primaryKey(),
  step: integer("step").notNull(),
  titleZh: text("title_zh").notNull(),
  titleEn: text("title_en").notNull(),
  goalZh: text("goal_zh").notNull(),
  detailsZh: jsonb("details_zh").$type<string[]>().notNull(),
  pitfallsZh: jsonb("pitfalls_zh").$type<string[]>().notNull(),
});

/** Glossary of the terminology used by the standard */
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  termZh: text("term_zh").notNull(),
  definitionZh: text("definition_zh").notNull(),
  category: text("category").notNull(),
  docSlug: text("doc_slug").notNull(),
});

/** Multiple-choice questions used by the quiz / spaced-repetition trainer */
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  docSlug: text("doc_slug").notNull(),
  difficulty: text("difficulty").notNull(),
  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  answerIndex: integer("answer_index").notNull(),
  explanationZh: text("explanation_zh").notNull(),
  orderIndex: integer("order_index").notNull(),
});

/** Every quiz submission, so we can show accuracy trends */
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  docSlug: text("doc_slug").notNull(),
  total: integer("total").notNull(),
  correct: integer("correct").notNull(),
  answers: jsonb("answers").$type<
    { questionId: number; chosenIndex: number; correct: boolean }[]
  >().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Reader progress / mastery state per document */
export const docProgress = pgTable(
  "doc_progress",
  {
    id: serial("id").primaryKey(),
    docSlug: text("doc_slug").notNull(),
    status: text("status").notNull().default("unread"),
    percent: integer("percent").notNull().default(0),
    starred: boolean("starred").notNull().default(false),
    readCount: integer("read_count").notNull().default(0),
    completedSections: jsonb("completed_sections").$type<string[]>().notNull(),
    lastOpenedAt: timestamp("last_opened_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("doc_progress_slug_unique").on(table.docSlug)],
);

/** Free-form study notes, one row per note */
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  docSlug: text("doc_slug").notNull(),
  sectionAnchor: text("section_anchor"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Agent / tool products that support the Agent Skills format */
export const clientProducts = pgTable(
  "client_products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    docsUrl: text("docs_url"),
    sourceUrl: text("source_url"),
    category: text("category").notNull(),
    descriptionEn: text("description_en").notNull(),
    descriptionZh: text("description_zh").notNull(),
    orderIndex: integer("order_index").notNull(),
  },
  (table) => [uniqueIndex("client_products_name_unique").on(table.name)],
);
