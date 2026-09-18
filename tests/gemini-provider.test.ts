import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GeminiVisionCaptionProvider } from "../src/lib/ai/gemini-provider";

// Mock the entire GoogleGenAI module
vi.mock("@google/genai", () => {
  class MockGoogleGenAI {
    static retryCount = 0;
    models = {
      generateContent: vi.fn().mockImplementation(async ({ contents }) => {
        // Throw an error if a specific string is detected (for API failure testing)
        const promptText = contents[0];

        // Mock a stateful retry mechanism
        if (typeof promptText === "string" && promptText.includes("RETRY_503")) {
          // Store attempt count globally on the mock object instance or simply use a global variable
          // For simplicity in vi.mock, use a closure variable attached to the mock
          MockGoogleGenAI.retryCount = (MockGoogleGenAI.retryCount || 0) + 1;
          if (MockGoogleGenAI.retryCount < 3) {
            const error = new Error("503 Service Unavailable");
            (error as any).status = 503;
            throw error;
          }
          return { text: "Mocked Gemini Response after retry" };
        }

        if (typeof promptText === "string" && promptText.includes("THROW_ERROR")) {
          throw new Error("Simulated API failure");
        }
        if (typeof promptText === "string" && promptText.includes("EMPTY_RESPONSE")) {
          return { text: "" };
        }
        if (typeof promptText === "string" && promptText.includes("Analyze this image")) {
          if (promptText.includes("THROW_ERROR")) throw new Error("Simulated API failure");
          return { text: JSON.stringify({ objects: [{ name: "person", attributes: [] }], actions: [], relationships: [], uncertain: [] }) };
        }
        
        if (typeof promptText === "string" && promptText.includes("You are a strict verification system")) {
          if (promptText.includes("THROW_ERROR")) throw new Error("Simulated API failure");
          return { text: JSON.stringify([{ type: "OBJECT", text: "person", status: "supported", confidence: 1.0 }]) };
        }
        
        if (typeof promptText === "string" && promptText.includes("You are an image caption refinement system")) {
          if (promptText.includes("THROW_ERROR")) throw new Error("Simulated API failure");
          return { text: "Refined mocked caption" };
        }

        return { text: "Mocked Gemini Response" };
      }),
    };
  }
  return { GoogleGenAI: MockGoogleGenAI };
});

describe("GeminiVisionCaptionProvider", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, GEMINI_API_KEY: "test_api_key", GEMINI_MODEL: "gemini-2.5-flash" };
  });

  afterEach(() => {
    process.env = originalEnv;
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
