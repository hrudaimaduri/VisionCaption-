# Evaluation Dataset Manifest

## 1. Dataset Name
Flickr8k

## 2. Dataset Source
Official: https://illinois.edu/fb/sec/229675 (or via Kaggle: https://www.kaggle.com/adityajn105/flickr8k)

## 3. Dataset Version
UNKNOWN / NOT INSTALLED

## 4. Number of Images Available
0 (STATUS: DATASET NOT YET INSTALLED)

## 5. Number of Reference Captions
0 (STATUS: DATASET NOT YET INSTALLED)

## 6. Annotation Format
UNKNOWN / NOT INSTALLED (Typically tokens.txt format: `image_id.jpg#caption_number caption_text`)

## 7. Intended Evaluation Subset
Pilot Subset: First 10-50 images from the test split to verify data loading, metric computation, and the automated pipeline before full execution.
Full Evaluation: The official Flickr8k test split (typically 1000 images).

## 8. Dataset Split Information
Preserve the official Flickr8k splits (Train: 6000, Val: 1000, Test: 1000). The `test` split will be used exclusively for Phase 4 metrics.

## 9. License/Usage Information
UNKNOWN / NOT INSTALLED (Typically research-only use for Flickr8k)

## 10. Data Leakage Precautions
- **No Evaluation Tuning:** No evaluation image may be used to tune the frozen prompt after evaluation starts.
- **No Prompt Leakage:** No evaluation reference caption may be inserted into generation prompts.
- **No Ground Truth Corruption:** No generated caption may become ground truth.
- **No Manual Edits:** No manual editing of model outputs before metric calculation.
- **Consistent Comparison:** Baseline and proposed system must use the identical evaluation images. Both systems must use the identical reference captions.

## 11. Evidence-Grounding Annotation Requirement
Caption-reference metrics (e.g., BLEU, CIDEr) and evidence-grounding metrics are distinct.
Reference metrics measure similarity to human captions.
Evidence-grounding evaluation requires claim-level evidence assessment (unsupported vs. supported visual claims). The dataset infrastructure must support tracking:
- visual evidence
- claims
- supported claims
- unsupported claims
- uncertain claims
- verification correctness
- refinement correctness
