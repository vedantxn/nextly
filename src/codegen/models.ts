export type ProjectModelKey = "gpt-5.4";

export const DEFAULT_PROJECT_MODEL: ProjectModelKey = "gpt-5.4";

export function resolveProjectModel(model: ProjectModelKey | undefined) {
  return model ?? DEFAULT_PROJECT_MODEL;
}

export function resolveFallbackModel() {
  return "gpt-5.4";
}
