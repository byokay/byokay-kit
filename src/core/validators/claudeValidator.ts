// src/core/validators/claudeValidator.ts
// Claude currently does not support browser-based API key validation.
// It gets blocked by CORS.
// This file is a placeholder for the Claude API key validator.
// It is not used in the current implementation.
// It is here to serve as a template if they ever add support for browser-based API key validation.

export async function validateClaudeApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  const endpoint = "https://api.anthropic.com/v1/models";
  const anthropicVersion = "2023-06-01";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": anthropicVersion,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      await response.json(); // Ensure response is valid
      return { success: true, isCorsError: false };
    } else if (response.status === 401 || response.status === 403) {
      const errorData = await response.json().catch(() => ({}));
      const specificMessage = errorData?.error?.message || response.statusText;
      console.error(
        `Anthropic Validation Failed: Status ${response.status}`,
        specificMessage
      );
      return {
        success: false,
        isCorsError: false,
        message: `Key is invalid or lacks permissions: ${specificMessage}`,
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      const specificMessage = errorData?.error?.message || response.statusText;
      console.error(
        `Anthropic Validation Error: Status ${response.status}`,
        specificMessage
      );
      return {
        success: false,
        isCorsError: false,
        message: `Validation error (${response.status}): ${specificMessage}`,
      };
    }
  } catch (error: any) {
    console.error(
      "Anthropic Validation Network/Fetch Error:",
      error.message || error
    );
    if (
      error.name === "TypeError" &&
      error.message.toLowerCase().includes("failed to fetch")
    ) {
      console.warn(
        "CORS issue suspected for Anthropic /v1/models direct browser call."
      );
      return {
        success: false, // CRITICAL FIX: Validation was not successful
        isCorsError: true,
        message:
          "Claude API doesn't allow browser-based validation. Your key has been saved.", // Simple informative message
      };
    }
    return {
      success: false,
      isCorsError: false,
      message: `Network error during validation: ${error.message}`,
    };
  }
}
