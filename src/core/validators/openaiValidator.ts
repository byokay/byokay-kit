// src/core/validators/openaiValidator.ts
export async function validateOpenAIApiKey(
  apiKey: string
): Promise<{ success: boolean; message?: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: "API key is empty." };
  }

  const endpoint = "https://api.openai.com/v1/models";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      await response.json(); // Ensure response is valid JSON
      return { success: true };
    } else if (response.status === 401) {
      console.error("OpenAI API Key Validation Failed: Unauthorized (401)");
      return {
        success: false,
        message: "OpenAI API key is invalid or lacks permissions.",
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      const specificMessage = errorData?.error?.message || response.statusText;
      console.error(
        `OpenAI API Key Validation Error: Status ${response.status}`,
        specificMessage
      );
      return {
        success: false,
        message: `OpenAI API Validation Error (${response.status}): ${specificMessage}`,
      };
    }
  } catch (error: any) {
    console.error(
      "OpenAI API Key Validation Network Error:",
      error.message || error
    );
    return {
      success: false,
      message: `Network error during OpenAI validation: ${error.message}`,
    };
  }
}
