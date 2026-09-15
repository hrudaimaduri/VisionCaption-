import { GenerationInput, VerificationResult, VisionCaptionProvider, VisualEvidence } from "@/types/ai";

// A realistic development provider that produces deterministic results
// depending on the requested purpose and detail level.
export class MockVisionCaptionProvider implements VisionCaptionProvider {
  
  async analyzeImage(input: { imageUrl: string }): Promise<VisualEvidence> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      objects: [
        { label: "person", confidence: 0.98 },
        { label: "umbrella", confidence: 0.95 },
        { label: "road", confidence: 0.92 },
        { label: "car", confidence: 0.75 },
      ],
      attributes: [
        { object: "umbrella", attribute: "red", confidence: 0.88 },
        { object: "road", attribute: "wet", confidence: 0.94 },
      ],
      actions: [
        { subject: "person", action: "walking", confidence: 0.91 },
        { subject: "person", action: "holding umbrella", confidence: 0.96 },
      ],
      relationships: [
        { subject: "person", relation: "near", object: "road", confidence: 0.95 },
        { subject: "car", relation: "on", object: "road", confidence: 0.85 },
      ]
    };
  }

  async generateCaption(input: GenerationInput, evidence: VisualEvidence): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Return a purposeful caption with an intentional unsupported claim for demonstration,
    // especially when detail level is "Detailed" and purpose is "Safety".
    
    if (input.purpose === "Safety") {
      if (input.detailLevel === "Detailed") {
        return "A person is walking dangerously close to a wet road holding a red umbrella, while a speeding car approaches from behind.";
      }
      return "A person with a red umbrella is walking near a wet road with a car present.";
    }
    
    if (input.purpose === "Accessibility") {
      return "A person holding a red umbrella walking near a wet road with a car.";
    }
    
    if (input.purpose === "Social Media") {
      return "Rainy days call for a bright red umbrella! 🌧️☔ Stay safe by the road.";
    }
    
    if (input.purpose === "Education") {
      return "The image demonstrates a pedestrian environment during precipitation. Visible elements include a person, a red umbrella, and a wet road surface.";
    }

    if (input.language === "Telugu") {
      return "ఒక వ్యక్తి ఎర్రటి గొడుగు పట్టుకుని తడి రోడ్డు దగ్గర నడుస్తున్నాడు.";
    }

    // General / Default
    return "A person is standing near a road holding an umbrella, and a child is playing nearby.";
  }

  async verifyCaption(input: { caption: string; evidence: VisualEvidence }): Promise<VerificationResult> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerCaption = input.caption.toLowerCase();
    const claims = [];
    let unsupportedCount = 0;
    
    // Check known concepts
    if (lowerCaption.includes("person") || lowerCaption.includes("వ్యక్తి")) {
      claims.push({ type: "OBJECT" as const, text: "person", isSupported: true, confidence: 0.98 });
    }
    if (lowerCaption.includes("umbrella") || lowerCaption.includes("గొడుగు")) {
      claims.push({ type: "OBJECT" as const, text: "umbrella", isSupported: true, confidence: 0.95 });
    }
    if (lowerCaption.includes("red") || lowerCaption.includes("ఎర్రటి")) {
      claims.push({ type: "ATTRIBUTE" as const, text: "red umbrella", isSupported: true, confidence: 0.88 });
    }
    if (lowerCaption.includes("road") || lowerCaption.includes("రోడ్డు")) {
      claims.push({ type: "OBJECT" as const, text: "road", isSupported: true, confidence: 0.92 });
    }
    
    // Intentional unsupported claims for demo
    if (lowerCaption.includes("speeding")) {
      claims.push({ 
        type: "ATTRIBUTE" as const, 
        text: "speeding car", 
        isSupported: false, 
        confidence: 0.2,
        reasoning: "No sufficiently reliable visual evidence detected for the speed of the car."
      });
      unsupportedCount++;
    }
    if (lowerCaption.includes("dangerously")) {
      claims.push({ 
        type: "ACTION" as const, 
        text: "walking dangerously", 
        isSupported: false, 
        confidence: 0.1,
        reasoning: "Hazard level is an inference not directly supported by visual evidence."
      });
      unsupportedCount++;
    }
    if (lowerCaption.includes("child")) {
      claims.push({
        type: "OBJECT" as const,
        text: "child playing",
        isSupported: false,
        confidence: 0.05,
        reasoning: "No sufficiently reliable visual evidence detected for a child."
      });
      unsupportedCount++;
    }

    const totalClaims = claims.length || 1;
    const supportedClaims = claims.filter(c => c.isSupported).length;
    const overallScore = Math.round((supportedClaims / totalClaims) * 100);

    return {
      overallScore,
      unsupportedClaims: unsupportedCount,
      uncertainClaims: 0,
      claims
    };
  }

  async refineCaption(input: { caption: string; verification: VerificationResult; evidence: VisualEvidence; language: string }): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (input.verification.unsupportedClaims === 0) {
      return input.caption;
    }
    
    // Simulate refinement based on the demo outputs
    if (input.caption.includes("dangerously") || input.caption.includes("speeding")) {
      return "A person is walking near a wet road holding a red umbrella, with a car visible.";
    }
    
    if (input.caption.includes("child is playing")) {
      return "A person is standing near a road holding an umbrella.";
    }
    
    return input.caption + " (Refined)";
  }
}
