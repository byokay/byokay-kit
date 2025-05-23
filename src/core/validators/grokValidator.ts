// src/core/validators/grokValidator.ts
export async function validateGrokApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  // As direct client-side validation for Grok is not established/reliable,
  // we treat it as an "unverifiable from browser" scenario.
  console.warn(
    "Grok API key validation from the browser is not currently supported or reliable. " +
      "The key will be saved, but its validity cannot be checked client-side without a real API call."
  );

  // Simulate a slight delay as if an attempt was made
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    success: false, // Mark as not successfully "validated" via an API check
    isCorsError: true, // Use this flag to signal it's an unverifiable-from-browser scenario
    message:
      "Grok (xAI) doesn't allow API validation from browsers or a suitable endpoint isn't known. Your key has been saved; please test with an actual API call.",
  };
}
