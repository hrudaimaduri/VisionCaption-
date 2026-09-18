import * as fs from 'fs';
import * as path from 'path';
import { GeminiVisionCaptionProvider } from '../src/lib/ai/gemini-provider';

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.trim().startsWith('GEMINI_API_KEY=')) {
      process.env.GEMINI_API_KEY = line.split('=')[1].trim().replace(/^"|"$/g, '');
    }
  }
}

async function runPilot() {
  console.log('Starting Phase 4.3 Pilot Experiment (Caching Optimization)...');
  const manifestPath = path.resolve(__dirname, '../evaluation/data/manifest.json');
  const resultsDir = path.resolve(__dirname, '../evaluation/results');
  
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pilotSubset = manifest.slice(0, 3);
  
  console.log('--- VALIDATION BEFORE EXECUTION ---');
  console.log(`Selected ${pilotSubset.length} images for pilot.`);
  console.log('Image IDs:');
  pilotSubset.forEach((img: any) => console.log(`  - ${img.image_id}`));
  
  // Calculate expected calls
  const maxCallsPerImage = 4; // generate, analyze, verify, refine
  const totalMaxCalls = pilotSubset.length * maxCallsPerImage;
  console.log(`\nExpected maximum base API calls: ${totalMaxCalls}`);
  console.log('Validating reuse structure: Candidate and Evidence will be fetched ONCE and passed to A, B, and C.');

  // If we run with a flag to stop before Gemini calls, we stop here.
  if (process.argv.includes('--dry-run')) {
    console.log('\n[DRY RUN] Stopping before making Gemini API calls.');
    return;
  }

  const provider = new GeminiVisionCaptionProvider();
  
  const results: any[] = [];
  let successfulCompleted = 0;
  let failed = 0;
  let apiErrors = 0;

  for (const record of pilotSubset) {
    console.log(`\nProcessing image ${record.image_id}...`);
    let apiCallCount = 0;
    
    try {
      const imageBase64 = fs.readFileSync(record.image_path).toString('base64');
      const inlineData = { data: imageBase64, mimeType: 'image/jpeg' };
      
      const generationInput = {
        imageUrl: '',
        inlineData,
        purpose: 'General',
        language: 'English',
        detailLevel: 'Medium'
      };

      // 1. GENERATE SHARED CANDIDATE
      console.log('  -> Generating shared candidate caption...');
      apiCallCount++;
      const candidateCaption = await provider.generateCaption(generationInput, {} as any);

      // 2. EXTRACT SHARED VISUAL EVIDENCE
      console.log('  -> Extracting shared visual evidence...');
      apiCallCount++;
      const visualEvidence = await provider.analyzeImage({ imageUrl: '', inlineData });

      // 3. RUN SHARED VERIFICATION
      console.log('  -> Verifying shared candidate against shared evidence...');
      apiCallCount++;
      const verificationResult = await provider.verifyCaption({ caption: candidateCaption, evidence: visualEvidence });

      // 4. RUN SHARED REFINEMENT (if needed)
      let refinedCaption = 'NOT_APPLICABLE';
      if (verificationResult.unsupportedClaims > 0 || verificationResult.uncertainClaims > 0) {
        console.log('  -> Refining caption based on verification...');
        apiCallCount++;
        refinedCaption = await provider.refineCaption({ 
          caption: candidateCaption, 
          verification: verificationResult, 
          evidence: visualEvidence, 
          language: 'English' 
        });
      } else {
        console.log('  -> Skipping refinement (0 unsupported/uncertain claims).');
        refinedCaption = candidateCaption;
      }

      // ---------------------------------------------------------
      // Push Configuration A (Generation Only)
      // ---------------------------------------------------------
      results.push({
        image_id: record.image_id,
        image_path: record.image_path,
        reference_captions: record.reference_captions,
        purpose: 'General',
        language: 'English',
        detail: 'Medium',
        configuration: 'A',
        candidate_caption: candidateCaption,
        visual_evidence: 'NOT_APPLICABLE',
        verification_result: 'NOT_APPLICABLE',
        refined_caption: 'NOT_APPLICABLE',
        final_caption: candidateCaption,
        api_call_count: apiCallCount,
        retry_count: 0,
        errors: null,
        timestamp: new Date().toISOString(),
        model: 'gemini-2.5-flash'
      });

      // ---------------------------------------------------------
      // Push Configuration B (Generation + Verification)
      // ---------------------------------------------------------
      results.push({
        image_id: record.image_id,
        image_path: record.image_path,
        reference_captions: record.reference_captions,
        purpose: 'General',
        language: 'English',
        detail: 'Medium',
        configuration: 'B',
        candidate_caption: candidateCaption,
        visual_evidence: visualEvidence,
        verification_result: verificationResult,
        refined_caption: 'NOT_APPLICABLE',
        final_caption: candidateCaption,
        api_call_count: apiCallCount,
        retry_count: 0,
        errors: null,
        timestamp: new Date().toISOString(),
        model: 'gemini-2.5-flash'
      });

      // ---------------------------------------------------------
      // Push Configuration C (Generation + Verification + Refinement)
      // ---------------------------------------------------------
      results.push({
        image_id: record.image_id,
        image_path: record.image_path,
        reference_captions: record.reference_captions,
        purpose: 'General',
        language: 'English',
        detail: 'Medium',
        configuration: 'C',
        candidate_caption: candidateCaption,
        visual_evidence: visualEvidence,
        verification_result: verificationResult,
        refined_caption: refinedCaption,
        final_caption: refinedCaption,
        api_call_count: apiCallCount,
        retry_count: 0,
        errors: null,
        timestamp: new Date().toISOString(),
        model: 'gemini-2.5-flash'
      });

      successfulCompleted++;
    } catch (e: any) {
      console.error(`  Error processing image ${record.image_id}: ${e.message}`);
      apiErrors++;
      failed++;
      
      // Stop safely on rate limits or service unavailability
      if (e.message?.includes('429') || e.status === 429 || e.message?.includes('503') || e.status === 503) {
        console.error(`  [API] Transient error (429/503). Safely stopping experiment to preserve partial results.`);
        break;
      }
    }
  }

  const resultsFile = path.join(resultsDir, 'phase-4.3-pilot.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');

  const reportFile = path.join(resultsDir, 'PHASE_4.3_PILOT_REPORT.md');
  const reportContent = `# Phase 4.3 Pilot Report

## Execution Summary
- Number of images attempted: ${pilotSubset.length}
- Number successfully completed: ${successfulCompleted}
- Number failed: ${failed}
- API Errors/Retries Encountered: ${apiErrors}
- Configurations Generated per Success: A, B, C

## Metric Calculation Status
- BLEU: NOT COMPUTED - dependency/implementation required.
- METEOR: NOT COMPUTED - dependency/implementation required.
- ROUGE-L: NOT COMPUTED - dependency/implementation required.
- CIDEr: NOT COMPUTED - dependency/implementation required.
- SPICE: NOT COMPUTED - dependency/implementation required.

## Grounding Evaluation Status
- Unsupported Claim Rate: Computable from JSON.
- Evidence Match Rate: Computable from JSON.
- Verification Accuracy: Requires human ground-truth for claims.
- Refinement Success Rate: Computable from JSON.

## Implementation Details
- Caching logic was implemented: Generation and analysis performed once per image and effectively reused across configurations. Total base API calls per image maxed out at 4.
`;
  
  fs.writeFileSync(reportFile, reportContent, 'utf8');
  console.log('Pilot experiment complete. Report written.');
}

runPilot();
