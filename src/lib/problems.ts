import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/theme";
import {
  Difficulty,
  LanguageId,
  Problem,
  ProblemListItem,
  SubmissionListItem,
  LANGUAGE_ORDER,
  LANGUAGE_BADGE,
  LANGUAGE_TINT,
  LanguageExample,
  LANGUAGE_KEYS,
  LANGUAGE_LABEL,
} from "@/types/problem";

export function difficultyLabel(difficulty: Difficulty) {
  return difficulty[0] + difficulty.slice(1).toLowerCase();
}

export function difficultyTint(difficulty: Difficulty) {
  if (difficulty === "EASY")
    return { fg: colors.success, bg: colors.successBg };
  if (difficulty === "MEDIUM")
    return { fg: colors.warning, bg: colors.warningBg };
  return { fg: colors.danger, bg: colors.dangerBg };
}

export function getAvailableLanguages(problem: Problem) {
  return LANGUAGE_ORDER.filter(
    (lang) => problem.code_snippets?.[LANGUAGE_KEYS[lang]],
  );
}

export function getStarterCode(problem: Problem, language: LanguageId) {
  return problem.code_snippets?.[LANGUAGE_KEYS[language]] ?? "";
}

export function getExamples(problem: Problem): LanguageExample[] {
  const examples = problem.examples;
  if (!examples) return [];
  if (Array.isArray(examples)) return examples;
  return Object.values(examples);
}

export function getConstraintLines(constraints: string) {
  return constraints
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export async function fetchProblems() {
  const { data, error } = await supabase
    .from("problems")
    .select("id, title, difficulty, tags, created_at")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProblemListItem[];
}

export async function fetchProblemById(id: string) {
  const { data, error } = await supabase
    .from("problems")
    .select(
      "id, title, description, difficulty, tags, examples, constraints, hints, editorial, code_snippets, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Problem | null;
}

export async function fetchSolvedCount(userId: string) {
  const { count, error } = await supabase
    .from("problem_solved")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) throw error;
  return count ?? 0;
}

export async function fetchUserSubmissionsForProblem(
  userId: string,
  problemId: string,
) {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, language, status, memory, time, created_at")
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionListItem[];
}

export async function fetchUserSubmissionActivity(userId: string, days = 365) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const { data, error } = await supabase
    .from("submissions")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", start.toISOString());

  if (error) throw error;

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const key = toDateKey(new Date(row.created_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
