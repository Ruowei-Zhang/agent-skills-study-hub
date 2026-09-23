import { clients, docs, glossary, lifecycleSteps, quizQuestions, specFields } from "@/data";
import type {
  ClientSeed,
  DocSeed,
  GlossarySeed,
  LifecycleStepSeed,
  QuizSeed,
  SpecFieldSeed,
} from "@/data/types";

/**
 * 静态内容访问层：全部学习内容直接来自 src/data/* 的结构化数据，
 * 不经过数据库。这里只做整形、排序与跨表聚合。
 */

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
};

/** 全站文档目录（元信息，不含正文，适合传给客户端组件）。 */
export function getDocsCatalog(): DocCard[] {
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
    keyPoints: doc.keyPoints,
    tags: doc.tags,
    sectionCount: doc.sections.length,
    snippetCount: doc.snippets.length,
  }));
}

export type SectionSnippet = {
  id: number;
  title: string;
  lang: string;
  code: string;
  noteZh: string;
  sectionAnchor: string;
};

export type DocSectionDetail = {
  id: number;
  docSlug: string;
  orderIndex: number;
  anchor: string;
  headingZh: string;
  headingEn: string;
  contentZh: string;
  contentEn: string;
  snippets: SectionSnippet[];
};

export type DocDetail = {
  doc: DocSeed;
  sections: DocSectionDetail[];
};

/** 单篇文档的完整内容（章节 + 代码示例，id 为稳定的顺序号）。 */
export function getDocDetail(slug: string): DocDetail | null {
  const doc = docs.find((item) => item.slug === slug);
  if (!doc) return null;

  return {
    doc,
    sections: doc.sections.map((section, index) => ({
      id: index + 1,
      docSlug: doc.slug,
      orderIndex: index + 1,
      anchor: section.anchor,
      headingZh: section.headingZh,
      headingEn: section.headingEn,
      contentZh: section.contentZh,
      contentEn: section.contentEn,
      snippets: doc.snippets
        .map((snippet, snippetIndex) => ({ ...snippet, id: snippetIndex + 1 }))
        .filter((snippet) => snippet.sectionAnchor === section.anchor),
    })),
  };
}

export type QuizQuestion = QuizSeed & { id: number };

/** 题库，id 为稳定的顺序号（1 起），供答题记录引用。 */
export function getQuizBank(): QuizQuestion[] {
  return quizQuestions.map((question, index) => ({ ...question, id: index + 1 }));
}

export function getSpecFields(): SpecFieldSeed[] {
  return [...specFields].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getLifecycleSteps(): LifecycleStepSeed[] {
  return [...lifecycleSteps].sort((a, b) => a.step - b.step);
}

export function getGlossary(): GlossarySeed[] {
  return [...glossary].sort(
    (a, b) => a.category.localeCompare(b.category) || a.term.localeCompare(b.term),
  );
}

export function getClients(): ClientSeed[] {
  return [...clients].sort((a, b) => a.orderIndex - b.orderIndex);
}

export type SearchHit = {
  docSlug: string;
  docTitleZh: string;
  kind: "章节" | "代码示例" | "术语" | "客户端";
  title: string;
  snippet: string;
  href: string;
};

/** 全文搜索：章节正文、代码示例、术语、客户端四类内容，大小写不敏感。 */
export function searchEverything(term: string, limit = 40): SearchHit[] {
  const q = term.trim().toLowerCase();
  if (q.length < 1) return [];

  const includes = (value: string) => value.toLowerCase().includes(q);
  const hits: SearchHit[] = [];

  for (const doc of docs) {
    for (const section of doc.sections) {
      if (
        includes(section.headingZh) ||
        includes(section.headingEn) ||
        includes(section.contentZh)
      ) {
        hits.push({
          docSlug: doc.slug,
          docTitleZh: doc.titleZh,
          kind: "章节",
          title: section.headingZh,
          snippet: section.contentZh.replace(/\s+/g, " ").slice(0, 160),
          href: `/docs/${doc.slug}#${section.anchor}`,
        });
      }
    }
    for (const snippet of doc.snippets) {
      if (includes(snippet.title) || includes(snippet.code)) {
        hits.push({
          docSlug: doc.slug,
          docTitleZh: doc.titleZh,
          kind: "代码示例",
          title: snippet.title,
          snippet: snippet.code.replace(/\s+/g, " ").slice(0, 160),
          href: `/docs/${doc.slug}#${snippet.sectionAnchor}`,
        });
      }
    }
  }

  for (const termRow of glossary) {
    if (
      includes(termRow.term) ||
      includes(termRow.termZh) ||
      includes(termRow.definitionZh)
    ) {
      const docTitle = docs.find((doc) => doc.slug === termRow.docSlug)?.titleZh ?? termRow.docSlug;
      hits.push({
        docSlug: termRow.docSlug,
        docTitleZh: docTitle,
        kind: "术语",
        title: `${termRow.term} · ${termRow.termZh}`,
        snippet: termRow.definitionZh.slice(0, 160),
        href: `/glossary?q=${encodeURIComponent(termRow.term)}`,
      });
    }
  }

  for (const client of clients) {
    if (
      includes(client.name) ||
      includes(client.descriptionEn) ||
      includes(client.descriptionZh)
    ) {
      hits.push({
        docSlug: "clients",
        docTitleZh: "客户端清单",
        kind: "客户端",
        title: client.name,
        snippet: (client.descriptionZh || client.descriptionEn).slice(0, 160),
        href: `/clients?q=${encodeURIComponent(client.name)}`,
      });
    }
  }

  return hits.slice(0, limit);
}
