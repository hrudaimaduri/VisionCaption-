import { describe, it, expect } from 'vitest';
import { 
  calculateUnsupportedClaimRate, 
  calculateEvidenceMatchRate, 
  analyzeRefinement,
  calculateAllCaptionMetrics
} from './metrics';

describe('Evaluation Metrics', () => {
  describe('calculateUnsupportedClaimRate', () => {
    it('returns null for NOT_APPLICABLE', () => {
      expect(calculateUnsupportedClaimRate('NOT_APPLICABLE')).toBeNull();
    });

    it('calculates correct rate for claims', () => {
      const mockVerification: any = {
        claims: [
          { status: 'supported' },
          { status: 'unsupported' },
          { status: 'supported' },
          { status: 'uncertain' }
        ]
      };
      expect(calculateUnsupportedClaimRate(mockVerification)).toBe(0.25);
    });
  });

  describe('calculateEvidenceMatchRate', () => {
    it('returns null for NOT_APPLICABLE', () => {
      expect(calculateEvidenceMatchRate('NOT_APPLICABLE')).toBeNull();
    });

    it('calculates correct rate for claims', () => {
      const mockVerification: any = {
        claims: [
          { status: 'supported' },
          { status: 'unsupported' },
          { status: 'supported' },
          { status: 'uncertain' }
        ]
      };
      // 2 supported out of 4 total
      expect(calculateEvidenceMatchRate(mockVerification)).toBe(0.5);
    });
  });

  describe('analyzeRefinement', () => {
    it('returns null for NOT_APPLICABLE', () => {
      expect(analyzeRefinement('c', 'f', 'NOT_APPLICABLE')).toBeNull();
    });

    it('detects no refinement correctly', () => {
      const mockVerification: any = { claims: [] };
      const stats = analyzeRefinement('same', 'same', mockVerification);
      expect(stats?.wasRefined).toBe(false);
      expect(stats?.claimsRemoved).toBe(0);
    });

    it('calculates refinement stats when caption changed', () => {
      const mockVerification: any = {
        claims: [
          { status: 'supported' },
          { status: 'unsupported' },
          { status: 'uncertain' }
        ]
      };
      const stats = analyzeRefinement('candidate', 'final', mockVerification);
      expect(stats?.wasRefined).toBe(true);
      expect(stats?.claimsRemoved).toBe(1); // 1 unsupported
      expect(stats?.claimsRetained).toBe(1); // 1 supported
      expect(stats?.uncertainHandled).toBe(1); // 1 uncertain
    });
  });

  describe('calculateAllCaptionMetrics', () => {
    it('returns uncomputed nulls for dependencies', () => {
      const metrics = calculateAllCaptionMetrics('test', ['ref1', 'ref2']);
      expect(metrics.BLEU).toBeNull();
      expect(metrics.CIDEr).toBeNull();
      expect(metrics.SPICE).toBeNull();
    });
  });
});
