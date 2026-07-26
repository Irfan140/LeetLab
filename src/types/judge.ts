import { LanguageId } from "@/types/problem";

export const LANGUAGE_ID_MAP: Record<LanguageId, number> = {
  javascript: 63,
  python: 71,
  java: 62,
};

export type RunOutcome = "accepted" | "wrong-answer" | "error";

export type CaseResult = {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  status: { id: number; description: string };
  outcome: RunOutcome;
  timeSec: number | null;
  memoryKb: number | null;
};

export type ProblemTestCase = { input: string; output: string };

