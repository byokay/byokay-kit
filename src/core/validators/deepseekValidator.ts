// src/core/validators/deepseekValidator.ts
export async function validateDeepSeekApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  const endpoint = "https://api.deepseek.com/v1/models";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json", // Good practice, though less critical for GET
      },
    });

    if (response.ok) {
      // HTTP status 200-299
      await response.json(); // Ensure response is valid JSON
      return { success: true, isCorsError: false };
    } else if (response.status === 401) {
      // 401 Unauthorized clearly means the key is invalid or lacks permissions
      const errorData = await response.json().catch(() => ({}));
      const specificMessage =
        errorData?.error?.message ||
        response.statusText ||
        "Authentication failed";
      console.error(
        `DeepSeek API Key Validation Failed: Status ${response.status}`,
        specificMessage
      );
      return {
        success: false,
        isCorsError: false, // This is an auth error, not necessarily CORS yet
        message: `DeepSeek API key is invalid or not authorized: ${specificMessage}`,
      };
    } else {
      // Other non-successful statuses
      const errorData = await response.json().catch(() => ({}));
      const specificMessage = errorData?.error?.message || response.statusText;
      console.error(
        `DeepSeek API Key Validation Error: Status ${response.status}`,
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
      "DeepSeek API Key Validation Network/Fetch Error:",
      error.message || error
    );
    // "Failed to fetch" is the primary indicator of a potential CORS issue from the browser
    if (
      error.name === "TypeError" &&
      error.message.toLowerCase().includes("failed to fetch")
    ) {
      console.warn(
        "CORS issue suspected for DeepSeek /v1/models direct browser call."
      );
      // For DeepSeek, we'll consider CORS issues as successful validation but flag for the UI
      return {
        success: true, // Treat as success so no error message appears
        isCorsError: true, // Still flag as CORS issue for the tooltip
        message:
          "DeepSeek doesn't allow API validation from browsers. Your key has been saved and will be used for API calls.",
      };
    }
    return {
      success: false,
      isCorsError: false,
      message: `Network error during validation: ${error.message}`,
    };
  }
}
