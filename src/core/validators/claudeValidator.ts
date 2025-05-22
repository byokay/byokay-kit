// src/core/validators/claudeValidator.ts
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
        success: false,
        isCorsError: true,
        message:
          "Could not verify key from browser (potential CORS issue). Key will be saved; please test with an actual API call.",
      };
    }
    return {
      success: false,
      isCorsError: false,
      message: `Network error during validation: ${error.message}`,
    };
  }
}
