export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type LanguageId = "javascript" | "python" | "java";

export type LanguageExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ProblemListItem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  created_at: string;
};

export type Problem = ProblemListItem & {
  description: string;
  constraints: string;
  hints: string | null;
  editorial: string | null;
  examples: Record<string, LanguageExample>;
  code_snippets: Record<string, string>;
  updated_at: string;
};

export type SubmissionListItem = {
  id: string;
  language: string;
  status: string;
  memory: string | null;
  time: string | null;
  created_at: string;
};

export const LANGUAGE_KEYS: Record<LanguageId, string> = {
  javascript: "JAVASCRIPT",
  python: "PYTHON",
  java: "JAVA",
};

export const LANGUAGE_ORDER: LanguageId[] = ["javascript", "python", "java"];

export const LANGUAGE_LABEL: Record<LanguageId, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
};

export const LANGUAGE_TINT: Record<LanguageId, string> = {
  javascript: "#f7df1e",
  python: "#3776ab",
  java: "#f89820",
};

export const LANGUAGE_BADGE: Record<LanguageId, string> = {
  javascript: "JS",
  python: "PY",
  java: "JV",
};