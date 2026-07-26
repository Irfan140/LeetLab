import  { CaseResult } from "@/types/judge";

export type SubmitResponse = {
  submissionId: string;
  status: string;
  solved: boolean;
  passed: number;
  total: number;
  results: CaseResult[];
};

export type CodeBoxResponse = {
  stdout: string | null;
  stderr: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
};