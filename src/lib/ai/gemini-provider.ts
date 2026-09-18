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

  async analyzeImage(input: { imageUrl: string; inlineData?: { data: string; mimeType: string } }): Promise<VisualEvidence> {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    
    const promptText = `Analyze this image and extract factual visual evidence. 
Return ONLY a valid JSON object matching this schema:
{
  "objects": [{"name": "string", "attributes": ["string"]}],
  "actions": [{"subject": "string", "action": "string"}],
  "relationships": [{"subject": "string", "relation": "string", "object": "string"}],
  "uncertain": ["string"]
}
CRITICAL: 
- Only report visually supported information.
- Do not invent exact identities, unsupported locations, emotions (unless visually clear), intentions, hidden objects, or facts outside the image.
- If something is uncertain, put it in the "uncertain" array rather than asserting it as a fact.
`;

    const contents: any[] = [promptText];
    if (input.inlineData) {
      contents.push({
        inlineData: {
          data: input.inlineData.data,
          mimeType: input.inlineData.mimeType,
        }
      });
    }

    const config = {
      responseMimeType: "application/json",
    };

    const text = await this.generateWithRetry(model, contents, config);
    try {
      return JSON.parse(text) as VisualEvidence;
    } catch (e) {
      console.error("Failed to parse analyzeImage response", text);
      throw new Error("Invalid JSON returned from analyzeImage.");
    }
  }

  private async generateWithRetry(model: string, contents: any[], config?: any) {
    let response;
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        response = await this.ai.models.generateContent({
          model,
          contents,
          config
        });
        break; // Success
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

        const backoffMs = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
    
    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response.");
    }
    
    return response.text;
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

    const contents: any[] = [promptText];
    if (input.inlineData) {
      contents.push({
        inlineData: {
          data: input.inlineData.data,
          mimeType: input.inlineData.mimeType,
        }
      });
    }

    const text = await this.generateWithRetry(model, contents);
    return text.trim();
  }

  async verifyCaption(input: { caption: string; evidence: VisualEvidence }): Promise<VerificationResult> {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!input.caption) {
      return {
        overallScore: 0,
        unsupportedClaims: 1,
        uncertainClaims: 0,
        claims: [{
          type: "OTHER",
          text: "No caption provided",
          status: "unsupported",
          confidence: 1.0,
          reasoning: "The generation step failed to produce a caption."
        }]
      };
    }

    const promptText = `You are a strict verification system.
Compare the CANDIDATE CAPTION against the provided VISUAL EVIDENCE.
Break the caption into distinct factual claims (objects, attributes, actions, relationships, scene).
For each claim, check if it is supported by the VISUAL EVIDENCE JSON.
- If it is clearly supported, status is "supported".
- If there is partial or weak evidence but not conclusive, status is "uncertain".
- If it contradicts or is completely missing from the evidence, status is "unsupported".

CANDIDATE CAPTION:
${input.caption}

VISUAL EVIDENCE:
${JSON.stringify(input.evidence, null, 2)}

Return ONLY a valid JSON array of claims matching this schema:
[
  {
    "type": "OBJECT" | "ATTRIBUTE" | "ACTION" | "RELATIONSHIP" | "SCENE" | "OTHER",
    "text": "The extracted claim text",
    "status": "supported" | "uncertain" | "unsupported",
    "confidence": 0.0 to 1.0,
    "evidence": "Brief string referencing the evidence (or lack thereof)",
    "reasoning": "Explain why this status was chosen"
  }
]
`;

    const config = {
      responseMimeType: "application/json",
    };

    const text = await this.generateWithRetry(model, [promptText], config);
    let claims: any[] = [];
    try {
      claims = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse verifyCaption response", text);
      throw new Error("Invalid JSON returned from verifyCaption.");
    }

    const factualClaims = claims.length || 1;
    const supported = claims.filter((c) => c.status === "supported").length;
    const unsupported = claims.filter((c) => c.status === "unsupported").length;
    const uncertain = claims.filter((c) => c.status === "uncertain").length;

    const overallScore = Math.round((supported / factualClaims) * 100);

    return {
      overallScore,
      unsupportedClaims: unsupported,
      uncertainClaims: uncertain,
      claims
    };
  }

  async refineCaption(input: { caption: string; verification: VerificationResult; evidence: VisualEvidence; language: string }): Promise<string> {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (input.verification.unsupportedClaims === 0 && input.verification.uncertainClaims === 0) {
      return input.caption;
    }

    const promptText = `You are an image caption refinement system.
Your task is to rewrite the candidate caption based on the verification results.

CANDIDATE CAPTION:
${input.caption}

LANGUAGE REQUIRED: ${input.language}

VERIFICATION RESULTS:
${JSON.stringify(input.verification.claims, null, 2)}

VISUAL EVIDENCE:
${JSON.stringify(input.evidence, null, 2)}

INSTRUCTIONS:
1. Preserve supported visual information.
2. Remove unsupported claims.
3. Weaken uncertain claims when appropriate (e.g. use words like "appears to be" or remove if highly uncertain).
4. Do not add new visual facts.
5. Do not introduce facts that were absent from the candidate caption unless they are required to make the sentence grammatical.
6. Preserve the original tone and language (${input.language}).
7. Preserve the original purpose and detail level style as much as possible.
8. Keep the final caption natural and readable.

Return ONLY the refined caption text. Do not output JSON. Do not add formatting.`;

    const text = await this.generateWithRetry(model, [promptText]);
    return text.trim();
  }
}
