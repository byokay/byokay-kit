// src/core/validators/openaiValidator.ts
export async function validateOpenAIApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.trim()) {
    return false;
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
      return true;
    } else if (response.status === 401) {
      console.error("OpenAI API Key Validation Failed: Unauthorized (401)");
      return false;
    } else {
      console.error(
        `OpenAI API Key Validation Error: Status ${response.status}`
      );
      return false;
    }
  } catch (error) {
    console.error("OpenAI API Key Validation Network Error:", error);
    return false;
  }
}
