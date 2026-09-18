import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GeminiVisionCaptionProvider } from "../src/lib/ai/gemini-provider";

describe("GeminiVisionCaptionProvider", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, GEMINI_API_KEY: "test_api_key", GEMINI_MODEL: "gemini-2.5-flash" };
    
    // Mock global fetch for the SDK using native Response
    let retryCount = 0;
    global.fetch = vi.fn().mockImplementation(async (url: any, options: any) => {
      const body = JSON.parse(options.body);
      const contents = body.contents;
      
      let promptText = "";
      if (Array.isArray(contents)) {
        const content = contents[0];
        if (content.parts && Array.isArray(content.parts)) {
          promptText = content.parts.find((p: any) => p.text)?.text || "";
        } else if (typeof content === 'string') {
          promptText = content;
        } else if (content.text) {
          promptText = content.text;
        }
      }

      const headers = new Headers({ 'Content-Type': 'application/json' });

      if (promptText.includes("RETRY_503")) {
        retryCount++;
        if (retryCount < 3) {
          return new Response(
            JSON.stringify({ error: { message: "503 Service Unavailable" } }),
            { status: 503, statusText: "Service Unavailable", headers }
          );
        }
        return new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: "Mocked Gemini Response after retry" }] } }] }),
          { status: 200, headers }
        );
      }

      if (promptText.includes("THROW_ERROR")) {
        return new Response(
          JSON.stringify({ error: { message: "Simulated API failure" } }),
          { status: 500, statusText: "Internal Server Error", headers }
        );
      }
      
      if (promptText.includes("EMPTY_RESPONSE")) {
        return new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: "" }] } }] }),
          { status: 200, headers }
        );
      }
      
      if (promptText.includes("Analyze this image")) {
        return new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ objects: [{ name: "person", attributes: [] }], actions: [], relationships: [], uncertain: [] }) }] } }] }),
          { status: 200, headers }
        );
      }
      
      if (promptText.includes("strict verification system")) {
        return new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify([{ type: "OBJECT", text: "person", status: "supported", confidence: 1.0 }]) }] } }] }),
          { status: 200, headers }
        );
      }
      
      if (promptText.includes("image caption refinement system")) {
        return new Response(
          JSON.stringify({ candidates: [{ content: { parts: [{ text: "Refined mocked caption" }] } }] }),
          { status: 200, headers }
        );
      }

      return new Response(
        JSON.stringify({ candidates: [{ content: { parts: [{ text: "Mocked Gemini Response" }] } }] }),
        { status: 200, headers }
      );
    });
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it("should initialize successfully when GEMINI_API_KEY is present", () => {
    const provider = new GeminiVisionCaptionProvider();
    expect(provider).toBeDefined();
  });

  it("should throw an error when GEMINI_API_KEY is missing", () => {
    delete process.env.GEMINI_API_KEY;
    expect(() => new GeminiVisionCaptionProvider()).toThrow("GEMINI_API_KEY environment variable is missing.");
  });

  it("should generate a caption successfully (English + General + Medium)", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const result = await provider.generateCaption(
      {
        purpose: "General",
        language: "English",
        detailLevel: "Medium",
        imageUrl: "",
        inlineData: { data: "base64data", mimeType: "image/jpeg" },
      },
      { objects: [], attributes: [], actions: [], relationships: [] }
    );
    expect(result).toBe("Mocked Gemini Response");
  });

  it("should generate a caption successfully (English + Accessibility + Short)", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const result = await provider.generateCaption(
      {
        purpose: "Accessibility",
        language: "English",
        detailLevel: "Short",
        imageUrl: "",
      },
      { objects: [], attributes: [], actions: [], relationships: [] }
    );
    expect(result).toBe("Mocked Gemini Response");
  });

  it("should handle API failures", async () => {
    const provider = new GeminiVisionCaptionProvider();

    await expect(
      provider.generateCaption(
        {
          purpose: "THROW_ERROR", // Special keyword for mock
          language: "English",
          detailLevel: "Medium",
          imageUrl: "",
        },
        { objects: [], attributes: [], actions: [], relationships: [] }
      )
    ).rejects.toThrow("Simulated API failure");
  });

  it("should handle empty Gemini responses", async () => {
    const provider = new GeminiVisionCaptionProvider();

    await expect(
      provider.generateCaption(
        {
          purpose: "EMPTY_RESPONSE", // Special keyword for mock
          language: "English",
          detailLevel: "Medium",
          imageUrl: "",
        },
        { objects: [], attributes: [], actions: [], relationships: [] }
      )
    ).rejects.toThrow("Gemini returned an empty response.");
  });

  it("should retry on 503 errors and eventually succeed", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const result = await provider.generateCaption(
      {
        purpose: "RETRY_503", // Special keyword for mock
        language: "English",
        detailLevel: "Medium",
        imageUrl: "",
      },
      { objects: [], attributes: [], actions: [], relationships: [] }
    );
    expect(result).toBe("Mocked Gemini Response after retry");
  });

  it("should analyze image successfully", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const result = await provider.analyzeImage({ imageUrl: "test", inlineData: { data: "base64", mimeType: "image/jpeg" } });
    expect(result.objects[0].name).toBe("person");
  });

  it("should verify caption successfully", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const result = await provider.verifyCaption({ caption: "A person", evidence: { objects: [], attributes: [], actions: [], relationships: [] } });
    expect(result.claims[0].status).toBe("supported");
    expect(result.overallScore).toBe(100);
  });

  it("should refine caption successfully", async () => {
    const provider = new GeminiVisionCaptionProvider();
    const verification = { overallScore: 50, unsupportedClaims: 1, uncertainClaims: 0, claims: [] };
    const result = await provider.refineCaption({ caption: "A person flying", verification, evidence: { objects: [], attributes: [], actions: [], relationships: [] }, language: "English" });
    expect(result).toBe("Refined mocked caption");
  });
});
