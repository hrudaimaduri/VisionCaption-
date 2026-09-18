import { VisualEvidence, VerificationClaim } from './ai';

export interface EvaluationRecord {
  image_id: string;
  dataset_split: 'train' | 'val' | 'test';
  
  // Frozen Controls
  purpose: 'Accessibility' | 'Social Media' | 'Education' | 'E-commerce' | 'General' | 'Safety';
  language: 'English' | 'Hindi' | 'Telugu' | 'Tamil';
  detail: 'Short' | 'Medium' | 'Detailed';
  
  // Pipeline Outputs
  candidate_caption: string;
  final_caption: string | null;
  reference_captions: string[];
  visual_evidence: VisualEvidence | null;
  verification_claims: VerificationClaim[];
  
  // Quantitative Metrics
  unsupported_claim_count: number;
  supported_claim_count: number;
  uncertain_claim_count: number;
  verification_score: number | null;
  
  // Standard Quality Metrics (Automated)
  BLEU: number | null;
  METEOR: number | null;
  ROUGE_L: number | null;
  CIDEr: number | null;
  SPICE: number | null;
  
  // Qualitative Metrics (Human Evaluation)
  human_evaluation_fields?: {
    factual_visual_accuracy: number | null;
    relevance: number | null;
    fluency: number | null;
    purpose_suitability: number | null;
    appropriate_level_of_detail: number | null;
    notes?: string;
  };
  
  // Error Analysis
  error_categories?: Array<'Hallucination' | 'Over-inference' | 'Omission' | 'Refinement Failure' | 'Over-refinement' | 'Other'>;
}
