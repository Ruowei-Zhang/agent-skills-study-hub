"use client";

import { useSyncExternalStore } from "react";

/**
 * 学习状态存储：阅读进度、笔记、测验记录全部保存在浏览器 localStorage，
 * 每位访客的数据彼此独立，无需账号与后端。
 *
 * 本模块刻意不 import @/data：需要的文档标题、章节数、题目明细等静态内容
 * 一律由服务端页面以 props 传入客户端组件，避免把全部文档正文打进客户端 bundle。
 */

export type ProgressEntry = {
  status: string; // unread | reading | mastered
  percent: number;
  starred: boolean;
  readCount: number;
  completedSections: string[];
  lastOpenedAt: string | null;
  completedAt: string | null;
};

export type NoteEntry = {
  id: number;
  docSlug: string;
  sectionAnchor: string | null;
  content: string;
  updatedAt: string;
};

export type AttemptAnswer = { questionId: number; chosenIndex: number; correct: boolean };

export type AttemptEntry = {
  id: number;
  docSlug: string; // 文档 slug，或聚合作用域 "all" / "wrong"
  total: number;
  correct: number;
  answers: AttemptAnswer[];
  createdAt: string;
};

export type StudyState = {
  progress: Record<string, ProgressEntry>;
  notes: NoteEntry[];
  attempts: AttemptEntry[];
};

const EMPTY: StudyState = { progress: {}, notes: [], attempts: [] };

const KEYS = {
  progress: "agentskills-progress-v1",
  notes: "agentskills-notes-v1",
  attempts: "agentskills-quiz-attempts-v1",
} as const;

let cache: StudyState | null = null;
const listeners = new Set<() => void>();

function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** 当前状态（客户端惰性读取并缓存；服务端永远返回空快照）。 */
export function getState(): StudyState {
  if (typeof window === "undefined") return EMPTY;
  if (!cache) {
    cache = {
      progress: readKey(KEYS.progress, {}),
      notes: readKey(KEYS.notes, []),
      attempts: readKey(KEYS.attempts, []),
    };
  }
  return cache;
}

function setState(next: StudyState) {
  cache = next;
  try {
    window.localStorage.setItem(KEYS.progress, JSON.stringify(next.progress));
    window.localStorage.setItem(KEYS.notes, JSON.stringify(next.notes));
    window.localStorage.setItem(KEYS.attempts, JSON.stringify(next.attempts));
  } catch {
    // 忽略配额错误：界面状态仍然生效，只是不持久化
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 响应式读取学习状态。SSR 与首次 hydration 使用空快照，
 * 挂载后自动切换为 localStorage 里的真实数据，不会产生 hydration 不一致。
 */
export function useStudy(): StudyState {
  return useSyncExternalStore(subscribe, getState, () => EMPTY);
}

/* ------------------------------ 进度变更 ------------------------------ */

function updateProgress(slug: string, fn: (prev: ProgressEntry | undefined, now: string) => ProgressEntry) {
  const state = getState();
  const now = new Date().toISOString();
  setState({
    ...state,
    progress: { ...state.progress, [slug]: fn(state.progress[slug], now) },
  });
}

function withSectionStats(
  prev: ProgressEntry | undefined,
  completedSections: string[],
  totalSections: number,
  now: string,
): ProgressEntry {
  const percent = Math.round((completedSections.length / Math.max(totalSections, 1)) * 100);
  const status =
    percent >= 100 ? "mastered" : percent > 0 ? "reading" : (prev?.status ?? "unread");
  return {
    status,
    percent,
    starred: prev?.starred ?? false,
    readCount: (prev?.readCount ?? 0) + 1,
    completedSections,
    lastOpenedAt: now,
    completedAt: status === "mastered" ? (prev?.completedAt ?? now) : null,
  };
}

/** 打开文档：更新最近打开时间与阅读次数（不改变完成状态）。 */
export function touchDoc(slug: string) {
  updateProgress(slug, (prev, now) => ({
    status: prev?.status ?? "unread",
    percent: prev?.percent ?? 0,
    starred: prev?.starred ?? false,
    readCount: (prev?.readCount ?? 0) + 1,
    completedSections: prev?.completedSections ?? [],
    lastOpenedAt: now,
    completedAt: prev?.completedAt ?? null,
  }));
}

/** 切换某一节的「已精读」勾选。 */
export function toggleSection(slug: string, anchor: string, totalSections: number) {
  updateProgress(slug, (prev, now) => {
    const completed = new Set(prev?.completedSections ?? []);
    if (completed.has(anchor)) completed.delete(anchor);
    else completed.add(anchor);
    return withSectionStats(prev, [...completed], totalSections, now);
  });
}

/** 直接设置整篇文档的已完成小节（用于「全部标读 / 全部取消」）。 */
export function setSections(slug: string, anchors: string[], totalSections: number) {
  updateProgress(slug, (prev, now) => withSectionStats(prev, anchors, totalSections, now));
}

/** 设置掌握状态（未读 / 学习中 / 已掌握）。 */
export function setStatus(slug: string, status: string) {
  updateProgress(slug, (prev, now) => ({
    status,
    percent: status === "mastered" ? 100 : (prev?.percent ?? 0),
    starred: prev?.starred ?? false,
    readCount: (prev?.readCount ?? 0) + 1,
    completedSections: prev?.completedSections ?? [],
    lastOpenedAt: now,
    completedAt: status === "mastered" ? (prev?.completedAt ?? now) : null,
  }));
}

/** 设置 / 取消「重点复习」标星。 */
export function setStarred(slug: string, starred: boolean) {
  updateProgress(slug, (prev, now) => ({
    status: prev?.status ?? "unread",
    percent: prev?.percent ?? 0,
    starred,
    readCount: (prev?.readCount ?? 0) + 1,
    completedSections: prev?.completedSections ?? [],
    lastOpenedAt: now,
    completedAt: prev?.completedAt ?? null,
  }));
}

/* ------------------------------ 笔记 ------------------------------ */

export function addNote(docSlug: string, content: string): void {
  const state = getState();
  const note: NoteEntry = {
    id: Date.now(),
    docSlug,
    sectionAnchor: null,
    content,
    updatedAt: new Date().toISOString(),
  };
  setState({ ...state, notes: [note, ...state.notes] });
}

export function deleteNote(id: number): void {
  const state = getState();
  setState({ ...state, notes: state.notes.filter((note) => note.id !== id) });
}

/* ------------------------------ 测验记录 ------------------------------ */

/** 记录一轮作答（最新一轮排在最前），返回本轮统计。 */
export function saveAttempt(
  docSlug: string,
  answers: AttemptAnswer[],
): { total: number; correct: number } {
  const state = getState();
  const attempt: AttemptEntry = {
    id: Date.now(),
    docSlug,
    total: answers.length,
    correct: answers.filter((answer) => answer.correct).length,
    answers,
    createdAt: new Date().toISOString(),
  };
  setState({ ...state, attempts: [attempt, ...state.attempts] });
  return { total: attempt.total, correct: attempt.correct };
}

export type QuizStats = { attempts: number; answered: number; correct: number; accuracy: number };

export function getQuizStats(state: StudyState): QuizStats {
  const answered = state.attempts.reduce((sum, row) => sum + row.total, 0);
  const correct = state.attempts.reduce((sum, row) => sum + row.correct, 0);
  return {
    attempts: state.attempts.length,
    answered,
    correct,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
  };
}

export function getQuizHistory(state: StudyState, limit = 8): AttemptEntry[] {
  return state.attempts.slice(0, limit);
}

export type WrongStat = {
  questionId: number;
  wrongCount: number;
  correctCount: number;
  totalCount: number;
  lastWrongAt: string | null;
};

/** 按题目聚合历史作答明细，筛出「答错过」的题，按错误次数降序。 */
export function getWrongStats(state: StudyState): WrongStat[] {
  const stats = new Map<number, WrongStat>();
  for (const attempt of state.attempts) {
    for (const answer of attempt.answers) {
      const entry =
        stats.get(answer.questionId) ?? {
          questionId: answer.questionId,
          wrongCount: 0,
          correctCount: 0,
          totalCount: 0,
          lastWrongAt: null,
        };
      entry.totalCount += 1;
      if (answer.correct) {
        entry.correctCount += 1;
      } else {
        entry.wrongCount += 1;
        if (!entry.lastWrongAt || attempt.createdAt > entry.lastWrongAt) {
          entry.lastWrongAt = attempt.createdAt;
        }
      }
      stats.set(answer.questionId, entry);
    }
  }
  return [...stats.values()]
    .filter((entry) => entry.wrongCount > 0)
    .sort(
      (a, b) =>
        b.wrongCount - a.wrongCount || (b.lastWrongAt ?? "").localeCompare(a.lastWrongAt ?? ""),
    );
}

export type WrongSummary = {
  wrongQuestions: number;
  wrongTotal: number;
  attemptedQuestions: number;
};

export function getWrongSummary(state: StudyState): WrongSummary {
  const perQuestion = new Map<number, number>();
  for (const attempt of state.attempts) {
    for (const answer of attempt.answers) {
      const wrong = perQuestion.get(answer.questionId) ?? 0;
      perQuestion.set(answer.questionId, wrong + (answer.correct ? 0 : 1));
    }
  }
  let wrongQuestions = 0;
  let wrongTotal = 0;
  perQuestion.forEach((wrong) => {
    if (wrong > 0) wrongQuestions += 1;
    wrongTotal += wrong;
  });
  return { wrongQuestions, wrongTotal, attemptedQuestions: perQuestion.size };
}

