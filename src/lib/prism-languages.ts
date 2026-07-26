import Prism from "prismjs";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";

import { LanguageId, GRAMMAR } from "@/types/problem";

export function grammarForLanguage(language: LanguageId) {
  const name = GRAMMAR[language];
  return Prism.languages[name];
}
