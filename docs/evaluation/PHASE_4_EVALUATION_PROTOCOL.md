# Phase 4 Evaluation Protocol

## 1. Research Question
"Can evidence-grounded verification and evidence-constrained refinement reduce unsupported visual claims in automatically generated image captions while maintaining caption quality across different purposes and levels of detail?"

## 2. Hypothesis
**H1:** Evidence-grounded verification and evidence-constrained refinement reduce unsupported visual claims compared with the unverified candidate caption.
**H2:** The proposed verification/refinement process maintains acceptable caption quality while reducing unsupported claims.
*(Note: These are experimental hypotheses that Phase 4 will test. They are not yet proven.)*

## 3. Experimental Systems

### Frozen Experimental Configuration
The experimental system represents the Phase 3 frozen configuration:
- **Model:** `gemini-2.5-flash`
- **Provider:** GeminiVisionCaptionProvider (Real Gemini API)
- **Verification:** Enabled via independent evidence extraction and claim-level checking.

### Baseline Definition (Layer 1)
- Image → Gemini → Candidate Caption
- The standard single-pass generation using the frozen purpose, language, and detail controls.

### Proposed System Definition (Layer 2)
- Image → Gemini → Candidate Caption → Evidence Verification → Evidence-Constrained Refinement → Final Caption
- The verifiable, multi-stage pipeline utilizing structured visual evidence extraction.

## 4. Independent Variables
- **System Type:** Baseline vs. Proposed System
- **Purpose Modes:** Accessibility, Social Media, Education, E-commerce, General, Safety
- **Languages:** English, Hindi, Telugu, Tamil
- **Detail Levels:** Short, Medium, Detailed

## 5. Dependent Variables
- Unsupported visual claims rate
- Evidence match rate
- Standard caption quality metrics (BLEU, METEOR, ROUGE-L, CIDEr, SPICE)
- Human evaluation scores

## 6. Dataset Requirements
- Evaluation data must be kept entirely separate from any examples used for prompt development or manual demonstration.
- Test images must not influence prompt engineering after evaluation begins.
- **STATUS:** NOT YET PREPARED

## 7. Evaluation Metrics

### Caption Quality (Automated)
- **BLEU:** N-gram precision against reference captions.
- **METEOR:** Exact, stem, synonym, and paraphrase matches.
- **ROUGE-L:** Longest common subsequence.
- **CIDEr:** Consensus-based image description evaluation.
- **SPICE:** Semantic propositional image caption evaluation.

### Evidence-Grounding (Automated/Semi-Automated)
- **Unsupported Claim Rate:** Percentage of generated claims lacking visual evidence.
- **Evidence Match Rate:** Degree of alignment between caption facts and independent visual evidence.
- **Verification Accuracy:** Accuracy of the verification model in detecting unsupported claims.
- **Refinement Success Rate:** Frequency of refinement successfully eliminating unsupported claims without losing supported claims.

### Human Evaluation
- **Factual/Visual Accuracy:** Does the caption accurately describe the image?
- **Relevance:** Does it capture the salient parts?
- **Fluency:** Is the language natural?
- **Purpose Suitability:** Does it match the selected purpose mode?
- **Appropriate Level of Detail:** Does it match the selected detail setting?

*(Note: No metric is automatically equivalent to human quality. Numerical results are not yet generated.)*

## 8. The Main Experiment
For every evaluation image in the dataset, perform the following comparison:
1. **A.** Generate candidate caption using the frozen Layer-1 configuration.
2. **B.** Evaluate candidate caption metrics.
3. **C.** Run independent evidence extraction and verification.
4. **D.** Run evidence-constrained refinement.
5. **E.** Evaluate the verified final caption using the same framework.

**Primary Comparison:** Candidate Caption vs. Verified Final Caption.
This will calculate changes in unsupported claims, evidence-supported claims, and caption quality.

## 9. Ablation Plan
Evaluate the following configurations to determine component contributions:
- **A. Generation only:** Image → Gemini → Candidate
- **B. Generation + verification:** Image → Gemini → Candidate → Verification
- **C. Generation + verification + refinement:** Image → Gemini → Candidate → Verification → Refinement

## 10. Error Analysis Categories
- **Hallucination:** Inventing objects/actions not present.
- **Over-inference:** Inferring intent, emotions, or invisible properties.
- **Omission:** Missing critical visual facts requested by detail level.
- **Refinement Failure:** Failing to remove an unsupported claim during refinement.
- **Over-refinement:** Erasing supported facts during refinement.

## 11. Reproducibility Requirements
- **Model Name:** `gemini-2.5-flash`
- **Provider:** Gemini API (`@google/genai`)
- **Software Commit:** `c37f66e` (Phase 3 Checkpoint) + Evaluation commit (TBD)
- **Evaluation Dataset Version:** TBD
- **Date of Experiment:** TBD
- **Control States:** Purpose, language, detail, and verification settings must be explicitly logged for each generation.
- **Limitation:** Gemini generation is inherently nondeterministic. Results represent statistical trends rather than perfectly deterministic outcomes.

## 12. Safety Against Experiment Contamination
The following rules are strictly enforced:
- DO NOT modify the verification algorithm during evaluation.
- DO NOT modify refinement logic during evaluation.
- DO NOT modify Gemini prompts to improve expected results on the test set.
- DO NOT add random AI features or change the model.
- DO NOT fabricate ground truth, metrics, benchmark results, or human evaluations.
- DO NOT call mock verification "real" or use demo values as experimental results.
- DO NOT allow data leakage between test set and prompt development.
