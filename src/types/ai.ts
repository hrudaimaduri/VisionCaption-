export interface VisualEvidence {
  objects: Array<{
    label: string;
    confidence: number;
    bbox?: [number, number, number, number];
  }>;
  attributes: Array<{
    object: string;
    attribute: string;
    confidence: number;
  }>;
  actions: Array<{
    subject: string;
    action: string;
    confidence: number;
  }>;
  relationships: Array<{
    subject: string;
    relation: string;
    object: string;
    confidence: number;
  }>;
}

export interface VerificationClaim {
  type: 'OBJECT' | 'ATTRIBUTE' | 'ACTION' | 'RELATIONSHIP' | 'OTHER';
  text: string;
  isSupported: boolean;
  confidence: number;
  reasoning?: string;
}

export interface VerificationResult {
  overallScore: number;
  unsupportedClaims: number;
  uncertainClaims: number;
  claims: VerificationClaim[];
}

export interface GenerationInput {
  imageUrl: string;
  inlineData?: {
    data: string;
    mimeType: string;
  };
  purpose: string;
  language: string;
  detailLevel: string;
}

export interface VisionCaptionProvider {
  analyzeImage(input: { imageUrl: string }): Promise<VisualEvidence>;
  generateCaption(input: GenerationInput, evidence: VisualEvidence): Promise<string>;
  verifyCaption(input: { caption: string; evidence: VisualEvidence }): Promise<VerificationResult>;
  refineCaption(input: { caption: string; verification: VerificationResult; evidence: VisualEvidence; language: string }): Promise<string>;
}
