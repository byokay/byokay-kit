// src/core/apiValidationService.ts
import { SupportedProvider } from "./ByokayKeyManager"; // Ensure this path and type name are correct
import { validateOpenAIApiKey } from "./validators/openaiValidator";
import { validateClaudeApiKey } from "./validators/claudeValidator";
import { validateGeminiApiKey } from "./validators/geminiValidator";
import { validateDeepSeekApiKey } from "./validators/deepseekValidator"; // Import new validator
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
      const claudeResult = await validateClaudeApiKey(apiKey);
      return {
        isValid: claudeResult.success,
        message: claudeResult.message,
        isCorsError: claudeResult.isCorsError,
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
    // Add cases for grok, llama as you implement them
    default:
      console.warn(
        `Real validation for ${provider} is not implemented. Simulating success for now.`
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { isValid: true, message: undefined, isCorsError: false }; // Simulate success
  }
}
