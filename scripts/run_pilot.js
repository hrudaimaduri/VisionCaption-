"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
// Load .env
var envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    var envContent = fs.readFileSync(envPath, 'utf8');
    for (var _i = 0, _a = envContent.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        if (line.trim().startsWith('GEMINI_API_KEY=')) {
            process.env.GEMINI_API_KEY = line.split('=')[1].trim().replace(/^"|"$/g, '');
        }
    }
}
function runPilot() {
    return __awaiter(this, void 0, void 0, function () {
        var manifestPath, resultsDir, manifest, pilotSubset;
        return __generator(this, function (_a) {
            console.log('Starting Phase 4.3 Pilot Experiment (Caching Optimization)...');
            manifestPath = path.resolve(__dirname, '../evaluation/data/manifest.json');
            resultsDir = path.resolve(__dirname, '../evaluation/results');
            if (!fs.existsSync(resultsDir)) {
                fs.mkdirSync(resultsDir, { recursive: true });
            }
            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            pilotSubset = manifest.slice(0, 3);
            console.log('--- VALIDATION BEFORE EXECUTION ---');
            console.log("Selected ${pilotSubset.length} images for pilot.`);\n  console.log('Image IDs:');\n  pilotSubset.forEach((img: any) => console.log(`  - ${img.image_id}`));\n  \n  // Calculate expected calls\n  const maxCallsPerImage = 4; // generate, analyze, verify, refine\n  const totalMaxCalls = pilotSubset.length * maxCallsPerImage;\n  console.log(`\\nExpected maximum base API calls: ${totalMaxCalls}`);\n  console.log('Validating reuse structure: Candidate and Evidence will be fetched ONCE and passed to A, B, and C.');\n\n  // If we run with a flag to stop before Gemini calls, we stop here.\n  if (process.argv.includes('--dry-run')) {\n    console.log('\\n[DRY RUN] Stopping before making Gemini API calls.');\n    return;\n  }\n\n  const provider = new GeminiVisionCaptionProvider();\n  \n  const results: any[] = [];\n  let successfulCompleted = 0;\n  let failed = 0;\n  let apiErrors = 0;\n\n  for (const record of pilotSubset) {\n    console.log(`\\nProcessing image ${record.image_id}...`);\n    let apiCallCount = 0;\n    \n    try {\n      const imageBase64 = fs.readFileSync(record.image_path).toString('base64');\n      const inlineData = { data: imageBase64, mimeType: 'image/jpeg' };\n      \n      const generationInput = {\n        imageUrl: '',\n        inlineData,\n        purpose: 'General',\n        language: 'English',\n        detailLevel: 'Medium'\n      };\n\n      // 1. GENERATE SHARED CANDIDATE\n      console.log('  -> Generating shared candidate caption...');\n      apiCallCount++;\n      const candidateCaption = await provider.generateCaption(generationInput, {} as any);\n\n      // 2. EXTRACT SHARED VISUAL EVIDENCE\n      console.log('  -> Extracting shared visual evidence...');\n      apiCallCount++;\n      const visualEvidence = await provider.analyzeImage({ imageUrl: '', inlineData });\n\n      // 3. RUN SHARED VERIFICATION\n      console.log('  -> Verifying shared candidate against shared evidence...');\n      apiCallCount++;\n      const verificationResult = await provider.verifyCaption({ caption: candidateCaption, evidence: visualEvidence });\n\n      // 4. RUN SHARED REFINEMENT (if needed)\n      let refinedCaption = 'NOT_APPLICABLE';\n      if (verificationResult.unsupportedClaims > 0 || verificationResult.uncertainClaims > 0) {\n        console.log('  -> Refining caption based on verification...');\n        apiCallCount++;\n        refinedCaption = await provider.refineCaption({ \n          caption: candidateCaption, \n          verification: verificationResult, \n          evidence: visualEvidence, \n          language: 'English' \n        });\n      } else {\n        console.log('  -> Skipping refinement (0 unsupported/uncertain claims).');\n        refinedCaption = candidateCaption;\n      }\n\n      // ---------------------------------------------------------\n      // Push Configuration A (Generation Only)\n      // ---------------------------------------------------------\n      results.push({\n        image_id: record.image_id,\n        image_path: record.image_path,\n        reference_captions: record.reference_captions,\n        purpose: 'General',\n        language: 'English',\n        detail: 'Medium',\n        configuration: 'A',\n        candidate_caption: candidateCaption,\n        visual_evidence: 'NOT_APPLICABLE',\n        verification_result: 'NOT_APPLICABLE',\n        refined_caption: 'NOT_APPLICABLE',\n        final_caption: candidateCaption,\n        api_call_count: apiCallCount,\n        retry_count: 0,\n        errors: null,\n        timestamp: new Date().toISOString(),\n        model: 'gemini-2.5-flash'\n      });\n\n      // ---------------------------------------------------------\n      // Push Configuration B (Generation + Verification)\n      // ---------------------------------------------------------\n      results.push({\n        image_id: record.image_id,\n        image_path: record.image_path,\n        reference_captions: record.reference_captions,\n        purpose: 'General',\n        language: 'English',\n        detail: 'Medium',\n        configuration: 'B',\n        candidate_caption: candidateCaption,\n        visual_evidence: visualEvidence,\n        verification_result: verificationResult,\n        refined_caption: 'NOT_APPLICABLE',\n        final_caption: candidateCaption,\n        api_call_count: apiCallCount,\n        retry_count: 0,\n        errors: null,\n        timestamp: new Date().toISOString(),\n        model: 'gemini-2.5-flash'\n      });\n\n      // ---------------------------------------------------------\n      // Push Configuration C (Generation + Verification + Refinement)\n      // ---------------------------------------------------------\n      results.push({\n        image_id: record.image_id,\n        image_path: record.image_path,\n        reference_captions: record.reference_captions,\n        purpose: 'General',\n        language: 'English',\n        detail: 'Medium',\n        configuration: 'C',\n        candidate_caption: candidateCaption,\n        visual_evidence: visualEvidence,\n        verification_result: verificationResult,\n        refined_caption: refinedCaption,\n        final_caption: refinedCaption,\n        api_call_count: apiCallCount,\n        retry_count: 0,\n        errors: null,\n        timestamp: new Date().toISOString(),\n        model: 'gemini-2.5-flash'\n      });\n\n      successfulCompleted++;\n    } catch (e: any) {\n      console.error(`  Error processing image ${record.image_id}: ${e.message}`);\n      apiErrors++;\n      failed++;\n      \n      // Stop safely on rate limits rather than consuming quota blindly\n      if (e.message?.includes('429') || e.status === 429) {\n        console.error('  [QUOTA] Rate limit hit. Safely stopping experiment to avoid exceeding quota.');\n        break;\n      }\n    }\n  }\n\n  const resultsFile = path.join(resultsDir, 'phase-4.3-pilot.json');\n  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2), 'utf8');\n\n  const reportFile = path.join(resultsDir, 'PHASE_4.3_PILOT_REPORT.md');\n  const reportContent = `# Phase 4.3 Pilot Report\n\n## Execution Summary\n- Number of images attempted: ${pilotSubset.length}\n- Number successfully completed: ${successfulCompleted}\n- Number failed: ${failed}\n- API Errors/Retries Encountered: ${apiErrors}\n- Configurations Generated per Success: A, B, C\n\n## Metric Calculation Status\n- BLEU: NOT COMPUTED \u2014 dependency/implementation required.\n- METEOR: NOT COMPUTED \u2014 dependency/implementation required.\n- ROUGE-L: NOT COMPUTED \u2014 dependency/implementation required.\n- CIDEr: NOT COMPUTED \u2014 dependency/implementation required.\n- SPICE: NOT COMPUTED \u2014 dependency/implementation required.\n\n## Grounding Evaluation Status\n- Unsupported Claim Rate: Computable from JSON.\n- Evidence Match Rate: Computable from JSON.\n- Verification Accuracy: Requires human ground-truth for claims.\n- Refinement Success Rate: Computable from JSON.\n\n## Implementation Details\n- Caching logic was implemented: Generation and analysis performed once per image and effectively reused across configurations. Total base API calls per image maxed out at 4.\n`;\n  \n  fs.writeFileSync(reportFile, reportContent, 'utf8');\n  console.log('Pilot experiment complete. Report written.');\n}\n\nrunPilot();\n");
            return [2 /*return*/];
        });
    });
}
