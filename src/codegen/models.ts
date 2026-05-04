export type ProjectModelKey = "grok" | "codex" | "gemini";

export const DEFAULT_PROJECT_MODEL: ProjectModelKey = "codex";

const LEGACY_MODEL_MAPPING: Record<ProjectModelKey, string> = {
  grok: "x-ai/grok-4-fast:free",
  codex: "openai/gpt-5-codex",
  gemini: "google/gemini-2.5-flash",
};

export function resolveLegacyProjectModel(model: ProjectModelKey | undefined) {
  return LEGACY_MODEL_MAPPING[model ?? DEFAULT_PROJECT_MODEL];
}

export function resolveLegacyFallbackModel() {
  return process.env.OPENAI_FREE2_MODEL ?? "openai/gpt-oss-120b:free";
}
