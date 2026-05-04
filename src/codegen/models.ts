export type ProjectModelKey = "grok" | "codex" | "gemini";

export const DEFAULT_PROJECT_MODEL: ProjectModelKey = "codex";

const OPENAI_MODEL_MAPPING: Record<ProjectModelKey, string> = {
  grok: "gpt-5-mini",
  codex: "gpt-5",
  gemini: "gpt-4.1-mini",
};

export function resolveProjectModel(model: ProjectModelKey | undefined) {
  return OPENAI_MODEL_MAPPING[model ?? DEFAULT_PROJECT_MODEL];
}

export function resolveFallbackModel() {
  return "gpt-5-mini";
}
