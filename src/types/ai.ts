export interface VisualEvidence {
  objects: Array<{
    name: string;
    attributes: string[];
    confidence?: number;
  }>;
  actions: Array<{
    subject: string;
    action: string;
    confidence?: number;
  }>;
  relationships: Array<{
    subject: string;
    relation: string;
    object: string;
    confidence?: number;
  }>;
  uncertain?: string[];
  [key: string]: any; // extensible
}

export interface VerificationClaim {
  type: 'OBJECT' | 'ATTRIBUTE' | 'ACTION' | 'RELATIONSHIP' | 'SCENE' | 'OTHER';
  text: string;
  status: 'supported' | 'uncertain' | 'unsupported';
  confidence: number;
  evidence?: string;
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
  analyzeImage(input: { imageUrl: string; inlineData?: { data: string; mimeType: string } }): Promise<VisualEvidence>;
  generateCaption(input: GenerationInput, evidence: VisualEvidence): Promise<string>;
  verifyCaption(input: { caption: string; evidence: VisualEvidence }): Promise<VerificationResult>;
  refineCaption(input: { caption: string; verification: VerificationResult; evidence: VisualEvidence; language: string }): Promise<string>;
}
