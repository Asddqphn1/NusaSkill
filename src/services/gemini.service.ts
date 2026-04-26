const apiKey = process.env.GOOGLE_API_KEY || ""; // API Key disediakan oleh environment runtime

export class GeminiService {
  private static async fetchWithRetry(
    prompt: string,
    systemPrompt: string,
    retries = 1,
  ): Promise<any> {
    const modelId = "gemini-pro-latest";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Gemini API Error Detail:", errorData);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        return JSON.parse(text);
      } catch (error) {
        if (i === retries - 1) throw error;
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  static async generateStructuredContent(prompt: string, systemPrompt: string) {
    return await this.fetchWithRetry(prompt, systemPrompt);
  }
}
