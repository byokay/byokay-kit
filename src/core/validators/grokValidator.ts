// src/core/validators/grokValidator.ts
import { UNVERIFIED_BROWSER_MESSAGE } from "../constants";

export async function validateGrokApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    success: false,
    isCorsError: true,
    message: UNVERIFIED_BROWSER_MESSAGE,
  };
}
