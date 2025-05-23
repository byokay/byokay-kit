// src/core/validators/claudeValidator.ts
export async function validateClaudeApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  // Browser validation disabled: Claude's endpoint blocks CORS.
  return {
    success: false, // not validated
    isCorsError: true, // flag for "saved but unverified"
    message:
      "Claude cannot be validated client-side. Key saved; please test with a real API call.",
  };
}
