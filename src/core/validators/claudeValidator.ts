// src/core/validators/claudeValidator.ts
import { UNVERIFIED_BROWSER_MESSAGE } from "../constants";

export async function validateClaudeApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  return {
    success: false,
    isCorsError: true,
    message: UNVERIFIED_BROWSER_MESSAGE,
  };
}
