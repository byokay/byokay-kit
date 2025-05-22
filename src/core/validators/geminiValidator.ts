// src/core/validators/geminiValidator.ts
export async function validateGeminiApiKey(
  apiKey: string
): Promise<{ success: boolean; isCorsError: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, isCorsError: false, message: "API key is empty." };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // HTTP status 200-299
      await response.json(); // Ensure response is valid JSON, even if we don't use the content
      return { success: true, isCorsError: false };
    } else {
      // Attempt to parse error response for more details
      let errorMessage = `Validation failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        } else if (response.statusText) {
          errorMessage = response.statusText;
        }
      } catch (e) {
        // Ignore if error response isn't JSON
      }

      console.error(`Gemini API Key Validation Failed: ${errorMessage}`);

      // Check for specific statuses that might indicate invalid key vs. other issues
      if (
        response.status === 400 &&
        errorMessage.toLowerCase().includes("api key not valid")
      ) {
        return {
          success: false,
          isCorsError: false,
          message:
            "Google Gemini API key is not valid. Please check the key and try again.",
        };
      } else if (
        response.status === 403 &&
        errorMessage.toLowerCase().includes("permission denied")
      ) {
        return {
          success: false,
          isCorsError: false,
          message:
            "Google Gemini API key is valid but lacks permissions for this operation, or the API is not enabled.",
        };
      }
      // For other errors, it's harder to distinguish CORS from other server/network issues without more info
      // but Google APIs are generally more CORS-friendly for simple GET requests with API keys if the key is restricted correctly.
      return {
        success: false,
        isCorsError: false, // Assuming most errors here are key-related or config-related, not pure browser CORS block initially
        message: `Validation error (${response.status}): ${errorMessage}`,
      };
    }
  } catch (error: any) {
    console.error(
      "Gemini API Key Validation Network/Fetch Error:",
      error.message || error
    );
    // "Failed to fetch" is the primary indicator of a potential CORS issue from the browser
    if (
      error.name === "TypeError" &&
      error.message.toLowerCase().includes("failed to fetch")
    ) {
      console.warn(
        "CORS issue suspected for Google Gemini direct browser call."
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
