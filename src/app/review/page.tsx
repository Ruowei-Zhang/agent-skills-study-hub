import { ReviewBoard } from "@/components/ReviewBoard";
import type { QuizCard } from "@/components/QuizRunner";
import { getDocsCatalog, getQuizBank } from "@/lib/content";

export const metadata = {
  title: "错题本 · Agent Skills 学习中心",
  description: "把做错过的题目集中重练：按错误次数加权出题，附正确答案与解析。",
};

export default function ReviewPage() {
  const docTitles = new Map(getDocsCatalog().map((doc) => [doc.slug, doc.titleZh]));
  const cards: QuizCard[] = getQuizBank().map((question) => ({
    id: question.id,
    docSlug: question.docSlug,
    docTitleZh: docTitles.get(question.docSlug) ?? question.docSlug,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options: question.options,
    answerIndex: question.answerIndex,
    explanationZh: question.explanationZh,
  }));

  return <ReviewBoard bank={cards} />;
}
