# Phase 4.4 Evaluation Report

## 1. Dataset & Scope
- **Dataset Used:** Flickr8k (Official Test Split)
- **Number of Images Evaluated:** 3 (3-image Pilot)
- **Number of Experimental Records:** 9
- **Configuration Definitions:**
  - **A:** Generation Only
  - **B:** Generation + Verification
  - **C:** Generation + Verification + Refinement

## 2. Metric Definitions & Availability
### Standard Caption-Quality Metrics
*Measures similarity to human references.*
- **BLEU / METEOR / ROUGE-L / CIDEr / SPICE:** `NOT COMPUTED — dependency/implementation required.`
*(Current architecture is Node/TS. Standard implementations for these metrics require Python evaluation suites like `pycocoevalcap` or Java for SPICE).*

### Evidence-Grounding Measurements
*Computed strictly from structured visual evidence models.*
- **Unsupported Claim Rate:** Percentage of claims classified as "unsupported".
- **Evidence Match Rate:** Percentage of claims classified as "supported".

## 3. Results Summary (Pilot)
> **WARNING:** This is a 3-image pilot. Do not claim statistical significance or that the proposed system is superior based on these results.

### Grounding Measurements (Across Verification Runs)
*Computed from configurations that generated verification records.*
- **Records with Verification Data:** 6
- (Values available per-record in `phase-4.4-metrics.json`)

### Refinement Statistics (Configuration C Only)
- Number of candidate captions: 3
- Number of candidates with unsupported claims before refinement: 3
- Number of captions actively refined: 3
- Number of captions left unchanged: 0
- Number of claims removed by refinement: 5
- Number of claims retained: 25
- Number of uncertain claims handled: 5

## 4. API & Methodological Rigor
- **Gemini API Calls Made During Evaluation:** 0
- **Data Integrity:** All intermediate outputs from the Phase 4.3 pilot remained untouched. No candidate or final captions were re-generated or altered.

## 5. Limitations
- Metric scripts currently lack native JS implementations for semantic/N-gram overlap against multi-references.
- Model-reported verification classifications are distinct from "independently validated grounding accuracy." True accuracy requires human annotation.
