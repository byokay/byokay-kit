// src/core/apiValidationService.ts
import { SupportedProvider } from "./ByokayKeyManager"; // Ensure this path and type name are correct
import { validateOpenAIApiKey } from "./validators/openaiValidator";
import { validateClaudeApiKey } from "./validators/claudeValidator"; // <-- Import new validator
// Import other validators as you create them:
// import { validateGeminiApiKey } from "./validators/geminiValidator";

export async function validateApiKey(
  provider: SupportedProvider,
  apiKey: string
): Promise<{ isValid: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { isValid: false, message: "API key cannot be empty." };
  }

  switch (provider) {
    case "openai":
      const isOpenAIValid = await validateOpenAIApiKey(apiKey);
      return {
        isValid: isOpenAIValid,
        message: isOpenAIValid
          ? undefined
          : "OpenAI API key is invalid or lacks permissions.",
      };
    case "claude": // <-- Add case for Claude
      const isClaudeValid = await validateClaudeApiKey(apiKey);
      return {
        isValid: isClaudeValid,
        message: isClaudeValid
          ? undefined
          : "Anthropic API key is invalid or lacks permissions.",
      };
    // case "gemini":
    //   // const isGeminiValid = await validateGeminiApiKey(apiKey);
    //   // return { isValid: isGeminiValid, message: isGeminiValid ? undefined : "Google Gemini API key is invalid." };
    //   break;
    // Add cases for grok, deepseek, llama as you implement them
    default:
      console.warn(
        `Real validation for ${provider} is not implemented. Simulating success for now.`
      );
      // Simulate network delay for consistency in UX for unimplmented providers
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { isValid: true, message: undefined }; // Simulate success for now
  }
}
