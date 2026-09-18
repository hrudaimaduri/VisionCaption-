/**
 * Metrics Integration and Computation
 *
 * Implements standard integrations for NLP caption quality metrics and 
 * proprietary evidence-grounding metrics.
 */

// ------------------------------------------------------------------
// AUTOMATED CAPTION QUALITY METRICS
// ------------------------------------------------------------------

export interface CaptionMetrics {
  BLEU: number | null;
  METEOR: number | null;
  ROUGE_L: number | null;
  CIDEr: number | null;
  SPICE: number | null;
}

/**
 * Calculates BLEU score comparing generated text to human references.
 * Currently UNAVAILABLE natively in JS/TS. Requires external python-based pycocoevalcap.
 */
export function calculateBLEU(candidate: string, references: string[]): number | null {
  // TODO: Implement external integration (e.g. child_process to python script)
  return null;
}

export function calculateMETEOR(candidate: string, references: string[]): number | null {
  return null;
}

export function calculateROUGE_L(candidate: string, references: string[]): number | null {
  return null;
}

export function calculateCIDEr(candidate: string, references: string[]): number | null {
  return null;
}

export function calculateSPICE(candidate: string, references: string[]): number | null {
  // Requires Java backend and specific dependency parsing tools.
  return null;
}

export function calculateAllCaptionMetrics(candidate: string, references: string[]): CaptionMetrics {
  if (!candidate || !references || references.length === 0) {
    return { BLEU: null, METEOR: null, ROUGE_L: null, CIDEr: null, SPICE: null };
  }
  return {
    BLEU: calculateBLEU(candidate, references),
    METEOR: calculateMETEOR(candidate, references),
    ROUGE_L: calculateROUGE_L(candidate, references),
    CIDEr: calculateCIDEr(candidate, references),
    SPICE: calculateSPICE(candidate, references)
  };
}

// ------------------------------------------------------------------
// GROUNDING & REFINEMENT METRICS
// ------------------------------------------------------------------

export interface VerificationData {
  overallScore: number;
  unsupportedClaims: number;
  uncertainClaims: number;
  claims: Array<{
    claim: string;
    status: 'supported' | 'unsupported' | 'uncertain';
  }>;
}

export function calculateUnsupportedClaimRate(verification: VerificationData | 'NOT_APPLICABLE'): number | null {
  if (verification === 'NOT_APPLICABLE' || !verification || !verification.claims) {
    return null;
  }
  if (verification.claims.length === 0) return 0;
  
  const unsupportedCount = verification.claims.filter(c => c.status === 'unsupported').length;
  return unsupportedCount / verification.claims.length;
}

export function calculateEvidenceMatchRate(verification: VerificationData | 'NOT_APPLICABLE'): number | null {
  if (verification === 'NOT_APPLICABLE' || !verification || !verification.claims) {
    return null;
  }
  if (verification.claims.length === 0) return 1.0;
  
  const supportedCount = verification.claims.filter(c => c.status === 'supported').length;
  return supportedCount / verification.claims.length;
}

export interface RefinementStats {
  wasRefined: boolean;
  claimsRemoved: number;
  claimsRetained: number;
  uncertainHandled: number;
}

export function analyzeRefinement(
  candidate: string, 
  final: string, 
  verification: VerificationData | 'NOT_APPLICABLE'
): RefinementStats | null {
  if (verification === 'NOT_APPLICABLE' || !verification) {
    return null;
  }
  
  const wasRefined = candidate !== final && final !== 'NOT_APPLICABLE';
  
  // Note: Deep semantic analysis of which exact claims were removed requires an LLM call.
  // Here we use the verification data to report what *should* have been removed.
  const unsupportedClaims = verification.claims.filter(c => c.status === 'unsupported').length;
  const uncertainClaims = verification.claims.filter(c => c.status === 'uncertain').length;
  const supportedClaims = verification.claims.filter(c => c.status === 'supported').length;

  return {
    wasRefined,
    claimsRemoved: wasRefined ? unsupportedClaims : 0, 
    claimsRetained: wasRefined ? supportedClaims : verification.claims.length,
    uncertainHandled: wasRefined ? uncertainClaims : 0
  };
}
