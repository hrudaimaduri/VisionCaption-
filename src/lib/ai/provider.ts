import { VisionCaptionProvider } from "@/types/ai";
import { MockVisionCaptionProvider } from "./mock-provider";
import { GeminiVisionCaptionProvider } from "./gemini-provider";

export function getVisionCaptionProvider(): VisionCaptionProvider {
  const providerType = process.env.AI_PROVIDER || "mock";
  
  if (providerType === "mock") {
    return new MockVisionCaptionProvider();
  }
  
  if (providerType === "gemini") {
    return new GeminiVisionCaptionProvider();
  }
  
  throw new Error(`Unknown AI_PROVIDER: ${providerType}`);
}
