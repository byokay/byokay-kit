// src/core/validators/claudeValidator.ts
export async function validateClaudeApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.trim()) {
    return false;
  }

  const endpoint = "https://api.anthropic.com/v1/models";
  // It's good practice to use a recent, stable version.
  // Refer to Anthropic's official documentation for the latest recommended version.
  const anthropicVersion = "2023-06-01";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": anthropicVersion,
        "Content-Type": "application/json", // Good practice, though less critical for GET
      },
    });

    if (response.ok) {
      // HTTP status 200-299
      // A successful response (e.g., 200 OK with a list of models)
      // indicates the key is valid and authenticated.
      return true;
    } else if (response.status === 401 || response.status === 403) {
      // 401 Unauthorized or 403 Forbidden clearly indicates an issue with the key
      // (invalid, expired, or lacks permissions for this basic call).
      const errorData = await response.json().catch(() => ({})); // Try to get error details
      console.error(
        `Anthropic API Key Validation Failed: Status ${response.status}`,
        errorData?.error?.message || response.statusText
      );
      return false;
    } else {
      // Other non-successful statuses (e.g., 400, 404, 5xx)
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `Anthropic API Key Validation Error: Status ${response.status}`,
        errorData?.error?.message || response.statusText
      );
      return false;
    }
  } catch (error) {
    // Network errors or other issues with the fetch call itself
    console.error("Anthropic API Key Validation Network Error:", error);
    return false;
  }
}
