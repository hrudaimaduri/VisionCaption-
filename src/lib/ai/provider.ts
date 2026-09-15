import { VisionCaptionProvider } from "@/types/ai";
import { MockVisionCaptionProvider } from "./mock-provider";

// Future: Import RealVisionCaptionProvider when available
// import { RealVisionCaptionProvider } from "./real-provider";

export function getVisionCaptionProvider(): VisionCaptionProvider {
  const providerType = process.env.AI_PROVIDER || "mock";
  
  if (providerType === "mock") {
    return new MockVisionCaptionProvider();
  }
  
  if (providerType === "real") {
    // return new RealVisionCaptionProvider();
    console.warn("Real provider not yet implemented, falling back to mock provider");
    return new MockVisionCaptionProvider();
  }
  
  throw new Error(`Unknown AI_PROVIDER: ${providerType}`);
}
