import * as fs from 'fs';
import * as path from 'path';
import { 
  calculateAllCaptionMetrics, 
  calculateUnsupportedClaimRate, 
  calculateEvidenceMatchRate, 
  analyzeRefinement 
} from '../src/lib/evaluation/metrics';

function runEvaluation() {
  const pilotResultsPath = path.resolve(__dirname, '../evaluation/results/phase-4.3-pilot.json');
  const manifestPath = path.resolve(__dirname, '../evaluation/data/manifest.json');
  const outputJsonPath = path.resolve(__dirname, '../evaluation/results/phase-4.4-metrics.json');
  const outputMdPath = path.resolve(__dirname, '../evaluation/results/PHASE_4.4_EVALUATION_REPORT.md');

  if (!fs.existsSync(pilotResultsPath) || !fs.existsSync(manifestPath)) {
    console.error('Required input files not found.');
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(pilotResultsPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Map reference captions from manifest just to ensure they match exactly
  const refMap = new Map(manifest.map((r: any) => [r.image_id, r.reference_captions]));

  const evaluationRecords: any[] = [];
  
  // Aggregate stats
  const aggregate = {
    totalRecords: results.length,
    imagesEvaluated: new Set(results.map((r: any) => r.image_id)).size,
    configs: { A: 0, B: 0, C: 0 },
    refinement: {
      candidates: 0,
      refined: 0,
      unchanged: 0,
      unsupportedBefore: 0,
      claimsRemoved: 0,
      claimsRetained: 0,
      uncertainHandled: 0
    }
  };

  for (const record of results) {
    const references = refMap.get(record.image_id) || record.reference_captions;
    const targetCaption = record.configuration === 'C' ? record.final_caption : record.candidate_caption;
    
    // 1. Quality Metrics
    const qualityMetrics = calculateAllCaptionMetrics(targetCaption, references);

    // 2. Grounding Metrics
    const unsupportedRate = calculateUnsupportedClaimRate(record.verification_result);
    const matchRate = calculateEvidenceMatchRate(record.verification_result);
    
    // 3. Refinement Analysis
    let refStats = null;
    if (record.configuration === 'C') {
      aggregate.configs.C++;
      aggregate.refinement.candidates++;
      refStats = analyzeRefinement(record.candidate_caption, record.final_caption, record.verification_result);
      
      if (refStats && refStats.wasRefined) {
        aggregate.refinement.refined++;
        aggregate.refinement.claimsRemoved += refStats.claimsRemoved;
        aggregate.refinement.claimsRetained += refStats.claimsRetained;
        aggregate.refinement.uncertainHandled += refStats.uncertainHandled;
      } else {
        aggregate.refinement.unchanged++;
      }
      
      if (record.verification_result !== 'NOT_APPLICABLE') {
        const uClaims = record.verification_result.claims?.filter((c: any) => c.status === 'unsupported').length || 0;
        if (uClaims > 0) aggregate.refinement.unsupportedBefore++;
      }
    } else if (record.configuration === 'B') {
      aggregate.configs.B++;
    } else {
      aggregate.configs.A++;
    }

    evaluationRecords.push({
      image_id: record.image_id,
      configuration: record.configuration,
      target_caption: targetCaption,
      quality_metrics: qualityMetrics,
      grounding_metrics: {
        unsupported_claim_rate: unsupportedRate,
        evidence_match_rate: matchRate
      },
      refinement_stats: refStats
    });
  }

  // Save JSON
  fs.writeFileSync(outputJsonPath, JSON.stringify(evaluationRecords, null, 2), 'utf8');

  // Generate Report
  const reportMarkdown = `# Phase 4.4 Evaluation Report

## 1. Dataset & Scope
- **Dataset Used:** Flickr8k (Official Test Split)
- **Number of Images Evaluated:** ${aggregate.imagesEvaluated} (3-image Pilot)
- **Number of Experimental Records:** ${aggregate.totalRecords}
- **Configuration Definitions:**
  - **A:** Generation Only
  - **B:** Generation + Verification
  - **C:** Generation + Verification + Refinement

## 2. Metric Definitions & Availability
### Standard Caption-Quality Metrics
*Measures similarity to human references.*
- **BLEU / METEOR / ROUGE-L / CIDEr / SPICE:** \`NOT COMPUTED — dependency/implementation required.\`
*(Current architecture is Node/TS. Standard implementations for these metrics require Python evaluation suites like \`pycocoevalcap\` or Java for SPICE).*

### Evidence-Grounding Measurements
*Computed strictly from structured visual evidence models.*
- **Unsupported Claim Rate:** Percentage of claims classified as "unsupported".
- **Evidence Match Rate:** Percentage of claims classified as "supported".

## 3. Results Summary (Pilot)
> **WARNING:** This is a 3-image pilot. Do not claim statistical significance or that the proposed system is superior based on these results.

### Grounding Measurements (Across Verification Runs)
*Computed from configurations that generated verification records.*
- **Records with Verification Data:** ${aggregate.configs.B + aggregate.configs.C}
- (Values available per-record in \`phase-4.4-metrics.json\`)

### Refinement Statistics (Configuration C Only)
- Number of candidate captions: ${aggregate.refinement.candidates}
- Number of candidates with unsupported claims before refinement: ${aggregate.refinement.unsupportedBefore}
- Number of captions actively refined: ${aggregate.refinement.refined}
- Number of captions left unchanged: ${aggregate.refinement.unchanged}
- Number of claims removed by refinement: ${aggregate.refinement.claimsRemoved}
- Number of claims retained: ${aggregate.refinement.claimsRetained}
- Number of uncertain claims handled: ${aggregate.refinement.uncertainHandled}

## 4. API & Methodological Rigor
- **Gemini API Calls Made During Evaluation:** 0
- **Data Integrity:** All intermediate outputs from the Phase 4.3 pilot remained untouched. No candidate or final captions were re-generated or altered.

## 5. Limitations
- Metric scripts currently lack native JS implementations for semantic/N-gram overlap against multi-references.
- Model-reported verification classifications are distinct from "independently validated grounding accuracy." True accuracy requires human annotation.
`;

  fs.writeFileSync(outputMdPath, reportMarkdown, 'utf8');
  console.log('Evaluation complete. Report generated.');
}

runEvaluation();
