import { foundationDocs } from "./docs-foundations";
import { authoringDocsA } from "./docs-authoring-a";
import { authoringDocsB } from "./docs-authoring-b";
import { implementorDocs } from "./docs-implementation";
import { clients } from "./clients";
import { checklist, disclosureTiers, lifecycleSteps, specFields } from "./reference";
import { glossary, quizQuestions } from "./study";
import type { DocSeed } from "./types";

/** Every documentation page from agentskills.io, in reading order. */
export const docs: DocSeed[] = [
  ...foundationDocs,
  ...authoringDocsA,
  ...authoringDocsB,
  ...implementorDocs,
].sort((a, b) => a.orderIndex - b.orderIndex);

export const SOURCE_SITE = "https://agentskills.io";

/** Reading paths by audience, mirroring the site's own navigation groups. */
export const learningPaths = [
  {
    key: "creators",
    titleZh: "技能创作者路线",
    subtitleZh: "写出能被触发、能被信任的技能",
    docSlugs: [
      "quickstart",
      "best-practices",
      "optimizing-descriptions",
      "evaluating-skills",
      "using-scripts",
    ],
  },
  {
    key: "implementors",
    titleZh: "客户端实现者路线",
    subtitleZh: "把技能加载进你自己的 agent",
    docSlugs: ["specification", "clients", "adding-skills-support"],
  },
  {
    key: "overview",
    titleZh: "快速科普路线",
    subtitleZh: "30 分钟理解这套标准在解决什么",
    docSlugs: ["overview", "quickstart", "specification", "clients"],
  },
];

export const docStats = {
  pageCount: docs.length,
  sectionCount: docs.reduce((sum, doc) => sum + doc.sections.length, 0),
  snippetCount: docs.reduce((sum, doc) => sum + doc.snippets.length, 0),
  questionCount: quizQuestions.length,
  glossaryCount: glossary.length,
  clientCount: clients.length,
  checklistCount: checklist.length,
  totalReadMinutes: docs.reduce((sum, doc) => sum + doc.readMinutes, 0),
};

export { clients, checklist, disclosureTiers, glossary, lifecycleSteps, quizQuestions, specFields };
export type { DocSeed };
