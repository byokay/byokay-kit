// src/core/apiValidationService.ts
import { SupportedProvider } from "./ByokayKeyManager"; // Ensure path is correct
import { validateOpenAIApiKey } from "./validators/openaiValidator";
import { validateClaudeApiKey } from "./validators/claudeValidator";
import { validateGeminiApiKey } from "./validators/geminiValidator";
import { validateDeepSeekApiKey } from "./validators/deepseekValidator";
import { validateGrokApiKey } from "./validators/grokValidator"; // Import Grok validator
// Import other validators as you create them:
// import { validateGrokApiKey } from "./validators/grokValidator";

export async function validateApiKey(
  provider: SupportedProvider,
  apiKey: string
): Promise<{ isValid: boolean; message?: string; isCorsError?: boolean }> {
  if (!apiKey || !apiKey.trim()) {
    return {
      isValid: false,
      message: "API key cannot be empty.",
      isCorsError: false,
    };
  }

  switch (provider) {
    case "openai":
      const openAIResult = await validateOpenAIApiKey(apiKey);
      return {
        isValid: openAIResult.success,
        message: openAIResult.message,
        isCorsError: false, // Assuming OpenAI /models endpoint is generally CORS friendly from browser
      };
    case "claude":
      // Skip network call: browser validation disabled
      return {
        isValid: false,
        message:
          "Claude cannot be validated in the browser. Key saved; test with an API call.",
        isCorsError: true,
      };
    case "gemini": // Add case for Gemini
      const geminiResult = await validateGeminiApiKey(apiKey);
      return {
        isValid: geminiResult.success,
        message: geminiResult.message,
        isCorsError: geminiResult.isCorsError,
      };
    case "deepseek": // Add case for DeepSeek
      const deepseekResult = await validateDeepSeekApiKey(apiKey);
      return {
        isValid: deepseekResult.success,
        message: deepseekResult.message,
        isCorsError: deepseekResult.isCorsError,
      };
    case "grok": // Add Grok case
      const grokResult = await validateGrokApiKey(apiKey);
      return {
        isValid: grokResult.success,
        message: grokResult.message,
        isCorsError: grokResult.isCorsError,
      };
    default:
      console.warn(
        `Validation for ${provider} is not implemented. Key will be saved as unverified.`
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      // For unhandled providers, treat as unverified and save.
      return {
        isValid: false, // Not API validated
        message: `Validation for ${provider} is not implemented. Key saved; please test with an API call.`,
        isCorsError: true, // Use this flag to trigger "save but unverified" UI
      };
  }
}
