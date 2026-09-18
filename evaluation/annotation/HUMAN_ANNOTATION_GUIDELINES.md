# VisionCaption+ Human Annotation Guidelines

## 1. Objective
The goal of this independent human annotation phase is to rigorously evaluate the accuracy of the model's visual claim verification system. 

**Research Note:**
Once this human annotation is complete, it will be used later to independently evaluate:
- verification accuracy
- supported-claim precision
- unsupported-claim detection
- uncertain-claim handling
- agreement between model verification and human judgment

*Methodological Note on Deduplication:* Human annotation is performed once per unique visual claim. Identical claims appearing in both Configuration B and Configuration C are collapsed into a single row to prevent double-counting. The resulting independent human judgment is subsequently compared with the verification labels produced under Configurations B and C.

## 2. Research Principle
**Independence:** The human annotation must be completely independent of the model's verification result. 

To preserve this independence:
- Evaluators must review the original source image directly.
- The `human_label` field in the annotation template has been explicitly left `null`.
- While the template contains the model's judgments (`model_label_B` and `model_label_C`) stored separately, the annotator must make an independent assessment based strictly on the image.

## 3. Annotation Schema
Each record in the `pilot-human-annotation-template.json` represents a single unique semantic claim extracted from a generated candidate caption.

You must fill out exactly two fields for each claim:
- `human_label`: (Required) Must be exactly one of the three supported categories below.
- `human_notes`: (Optional) Free-text explanation for your decision.

### 3.1 Allowed Labels

- **SUPPORTED:** The image provides sufficient visual evidence for the claim.
- **UNSUPPORTED:** The image does not provide sufficient visual evidence for the claim, or the claim contradicts visible evidence.
- **UNCERTAIN:** The image contains insufficient/ambiguous evidence to confidently classify the claim as supported or unsupported.

## 4. Comparison Schema for Future Analysis
Do **not** calculate these yet, as human labels do not exist. Future scripts will implement this schema per unique claim:
- `model_label_B` / `model_label_C`: The original verification labels.
- `human_label`: The independent human annotation.
- `agreement_B` / `agreement_C`: `true` if model label equals human label, else `false`.
- `correct_supported`: True Positive (both are SUPPORTED).
- `correct_unsupported`: True Negative (both are UNSUPPORTED).
- `correct_uncertain`: Both are UNCERTAIN.
- `model_false_positive`: Model claimed SUPPORTED, but human flagged UNSUPPORTED/UNCERTAIN.
- `model_false_negative`: Model claimed UNSUPPORTED/UNCERTAIN, but human flagged SUPPORTED.

