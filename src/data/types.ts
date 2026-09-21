export type DocSectionSeed = {
  anchor: string;
  headingZh: string;
  headingEn: string;
  /** Detailed Chinese study notes (lightweight markdown is supported). */
  contentZh: string;
  /** Faithful English excerpt / gist from the original page. */
  contentEn: string;
};

export type SnippetSeed = {
  docSlug: string;
  sectionAnchor: string;
  title: string;
  lang: string;
  code: string;
  noteZh: string;
};

export type DocSeed = {
  slug: string;
  titleZh: string;
  titleEn: string;
  groupKey: "foundations" | "creators" | "implementors";
  groupZh: string;
  orderIndex: number;
  sourceUrl: string;
  summaryZh: string;
  difficulty: "入门" | "进阶" | "深入";
  readMinutes: number;
  keyPoints: string[];
  tags: string[];
  sections: DocSectionSeed[];
  snippets: Omit<SnippetSeed, "docSlug">[];
};

export type SpecFieldSeed = {
  field: string;
  required: boolean;
  constraints: string;
  detailZh: string;
  example: string;
  orderIndex: number;
};

export type LifecycleStepSeed = {
  step: number;
  titleZh: string;
  titleEn: string;
  goalZh: string;
  detailsZh: string[];
  pitfallsZh: string[];
};

export type GlossarySeed = {
  term: string;
  termZh: string;
  definitionZh: string;
  category: "核心概念" | "格式规范" | "技能创作" | "客户端实现" | "脚本工程";
  docSlug: string;
};

export type QuizSeed = {
  docSlug: string;
  difficulty: "基础" | "理解" | "实战";
  prompt: string;
  options: string[];
  answerIndex: number;
  explanationZh: string;
};

export type ClientSeed = {
  name: string;
  url: string;
  docsUrl: string | null;
  sourceUrl: string | null;
  category: string;
  descriptionEn: string;
  descriptionZh: string;
  orderIndex: number;
};
