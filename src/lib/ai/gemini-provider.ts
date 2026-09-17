import { GoogleGenAI } from "@google/genai";
import { GenerationInput, VerificationResult, VisionCaptionProvider, VisualEvidence } from "@/types/ai";
import { MockVisionCaptionProvider } from "./mock-provider";

export class GeminiVisionCaptionProvider implements VisionCaptionProvider {
  private ai: GoogleGenAI;
  private mockProvider: MockVisionCaptionProvider;

  constructor() {
    // Initialize server-side Gemini client. Assumes GEMINI_API_KEY is in env.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }

    this.ai = new GoogleGenAI({ apiKey });

    // Fall back to MockProvider for Phase 1/3 features not yet implemented in Gemini
    this.mockProvider = new MockVisionCaptionProvider();
  }

  async analyzeImage(input: { imageUrl: string }): Promise<VisualEvidence> {
    // Phase 3 evidence verification is out of scope for Phase 2.
    // Delegating to MockProvider for now.
    return this.mockProvider.analyzeImage(input);
  }

  async generateCaption(input: GenerationInput, evidence: VisualEvidence): Promise<string> {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const promptText = `You are a highly accurate image captioning system.
Your task is to generate a natural image caption based on the following constraints:

PURPOSE: ${input.purpose}
LANGUAGE: ${input.language}
DETAIL LEVEL: ${input.detailLevel}

CRITICAL INSTRUCTIONS:
- Describe ONLY what is visually supported by the image.
- AVOID inventing people, objects, actions, relationships, locations, emotions, intentions, or events.
- Follow the requested purpose style exactly.
- Follow the requested language. Do not fake multilingual output; respond accurately in ${input.language}.
- Adhere to the requested detail level (${input.detailLevel}).
- Produce a natural, well-formed caption.
- DO NOT mention these instructions or your internal prompt.
- Return ONLY the caption text. Do not add quotes, markdown formatting, or any extra text.`;

    let response;
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        if (input.inlineData) {
          response = await this.ai.models.generateContent({
            model,
            contents: [
              promptText,
              {
                inlineData: {
                  data: input.inlineData.data,
                  mimeType: input.inlineData.mimeType,
                },
              },
            ],
          });
        } else {
          // Fallback if no inline data is provided (e.g., tests without image)
          response = await this.ai.models.generateContent({
            model,
            contents: [promptText],
          });
        }
        break; // Success, exit retry loop
      } catch (error: any) {
        attempt++;
        const errorMessage = error?.message?.toLowerCase() || "";
        const status = error?.status || error?.response?.status;

        const isTransient =
          status === 503 ||
          status === 429 ||
          errorMessage.includes("503") ||
          errorMessage.includes("429") ||
          errorMessage.includes("high demand") ||
          errorMessage.includes("temporarily overloaded") ||
          errorMessage.includes("quota");

        if (!isTransient || attempt >= maxAttempts) {
          throw error;
        }

        // Exponential backoff: 1s, 2s
        const backoffMs = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text.trim();
  }

  async verifyCaption(input: { caption: string; evidence: VisualEvidence }): Promise<VerificationResult> {
    // Phase 3: Evidence-grounded verification is out of scope for Phase 2.
    return this.mockProvider.verifyCaption(input);
  }

  async refineCaption(input: { caption: string; verification: VerificationResult; evidence: VisualEvidence; language: string }): Promise<string> {
    // Phase 3: Caption refinement is out of scope for Phase 2.
    return this.mockProvider.refineCaption(input);
  }
}
