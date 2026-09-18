# Phase 4.5 Pilot Analysis

## 1. Overview
- **Sample Size:** 3 images
- **Experimental Records:** 9 total (Configurations A, B, C per image)
- **Data Source:** `evaluation/results/phase-4.3-pilot.json`
- **Constraint Checklist:** 0 Gemini API calls made. No test annotations were fabricated. No code was modified.

## 2. Global Metric Summaries (Computed Offline)

### Grounding & Refinement Statistics
- **Total Verified Claims:** 35
- **Unsupported Claims Found:** 5
- **Supported (Matched) Claims Found:** 25
- **Uncertain Claims Found:** 5
- **Overall Unsupported Claim Rate (Observed):** 14.3%
- **Overall Evidence Match Rate (Observed):** 71.4%
- **Refinement Intervention Rate:** 3/3 (100.0%)
- **Total Claims Removed via Refinement:** 5
- **Total Claims Retained via Refinement:** 25

## 3. Configuration Comparison (Descriptive)
**Configuration A (Generation Only):**
The base model generated descriptive and plausible captions for all 3 images. However, it exhibited minor hallucinations/assumptions (e.g., asserting subjective relations like "interacting", assuming invisible contexts, or inferring actions like "dance").

**Configuration B (Generation + Verification):**
Verification successfully constrained the evaluation by explicitly testing the candidate's claims against independent visual evidence. It correctly flagged subjective assertions and unverified actions as `unsupported` or `uncertain`.

**Configuration C (Generation + Verification + Refinement):**
Refinement acted upon the verification signals, systematically stripping out the unsupported or uncertain claims while preserving the supported core structure. It resulted in highly factual descriptions grounded entirely in the visual evidence.

> **Limitations:** These observations are based on only 3 images. They do not constitute statistical significance. Metric values are purely *model-reported classifications* and require human ground-truth annotation for true "accuracy."

---

## 4. Image-by-Image Analysis

### Image 1: `3385593926_d3e9c21170.jpg`

#### Captions
- **Config A (Candidate):** Two brown Doberman pinscher dogs are actively interacting on a snow-covered field. One dog is standing on its hind legs with its mouth open, while the other places a paw on its shoulder, also with an open mouth. A fence and a snow-covered hillside with trees are visible in the background.
- **Config B (Candidate):** Two brown Doberman pinscher dogs are actively interacting on a snow-covered field. One dog is standing on its hind legs with its mouth open, while the other places a paw on its shoulder, also with an open mouth. A fence and a snow-covered hillside with trees are visible in the background.
- **Config C (Candidate):** Two brown Doberman pinscher dogs are actively interacting on a snow-covered field. One dog is standing on its hind legs with its mouth open, while the other places a paw on its shoulder, also with an open mouth. A fence and a snow-covered hillside with trees are visible in the background.
- **Config C (Refined):** Two dark brown dogs, possibly Doberman Pinschers, are actively interacting on snow-covered ground. One dog is standing on its hind legs, while the other places a paw on its back and has its mouth open. A fence and a snow-covered hillside with trees are visible in the background.

#### Verification & Refinement Behavior
- **Did Refinement Occur?** Yes
- **Unsupported Claims Detected:**
- with its mouth open (referring to the dog standing on hind legs) (Reason: The evidence states one dog is 'standing on hind legs'. It separately states 'mouth open' as an attribute for the *other* dog (the one placing the paw, referred to as 'the dog on the right'). There is no evidence connecting an open mouth to the dog standing on its hind legs.)
- **Uncertain Claims Detected:**
- Two brown Doberman pinscher dogs (Reason: The visual evidence confirms 'two dogs' with 'dark brown coat'. However, the 'uncertain' section explicitly states that 'The specific breed of the dogs' is uncertain, despite characteristics consistent with Doberman Pinschers.)
- on a snow-covered field (Reason: The visual evidence explicitly states 'snow' is 'covering the ground' and 'the ground is covered with snow', supporting 'snow-covered'. However, the specific term 'field' is not supported; the evidence mentions 'ground' and a 'hill', but not a 'field'.)
- while the other places a paw on its shoulder (Reason: The visual evidence supports the action of 'the other' dog placing a paw, specifically having its 'right front paw on the back of the dog on the left'. However, the caption specifies 'on its shoulder', while the evidence consistently states 'on the back', which is a broader area. This creates uncertainty regarding the precise location.)

#### Evidence Match & Action Highlights
- **Verification Action:** The verifier checked the candidate against the visual evidence graph.
- **Refinement Action:** The refinement prompt successfully excised the unsupported/uncertain claims from the candidate string.

### Image 2: `2677656448_6b7e7702af.jpg`

#### Captions
- **Config A (Candidate):** A small brown and white dog swims in a blue pool with its head above the water. A person, wearing a yellow shirt and black shorts, is partially submerged in the pool next to the dog, with one hand near its head.
- **Config B (Candidate):** A small brown and white dog swims in a blue pool with its head above the water. A person, wearing a yellow shirt and black shorts, is partially submerged in the pool next to the dog, with one hand near its head.
- **Config C (Candidate):** A small brown and white dog swims in a blue pool with its head above the water. A person, wearing a yellow shirt and black shorts, is partially submerged in the pool next to the dog, with one hand near its head.
- **Config C (Refined):** A brown and white dog swims in a blue pool. A person, wearing a yellow shirt and black shorts, is partially submerged in the pool next to the dog, with one hand near its head.

#### Verification & Refinement Behavior
- **Did Refinement Occur?** Yes
- **Unsupported Claims Detected:**
- The dog is small (Reason: The visual evidence does not contain any information regarding the size of the dog.)
- **Uncertain Claims Detected:**
- The dog's head is above the water (Reason: The evidence states the dog is 'partially submerged', which implies some part is above water, but does not specifically confirm that the head is the part above water.)

#### Evidence Match & Action Highlights
- **Verification Action:** The verifier checked the candidate against the visual evidence graph.
- **Refinement Action:** The refinement prompt successfully excised the unsupported/uncertain claims from the candidate string.

### Image 3: `311146855_0b65fdb169.jpg`

#### Captions
- **Config A (Candidate):** A man and a woman in vibrant carnival costumes dance in a street during the day. The shirtless man wears green and yellow pants, while the woman sports a feathered headdress and a sequined outfit. Onlookers and drums are visible in the background.
- **Config B (Candidate):** A man and a woman in vibrant carnival costumes dance in a street during the day. The shirtless man wears green and yellow pants, while the woman sports a feathered headdress and a sequined outfit. Onlookers and drums are visible in the background.
- **Config C (Candidate):** A man and a woman in vibrant carnival costumes dance in a street during the day. The shirtless man wears green and yellow pants, while the woman sports a feathered headdress and a sequined outfit. Onlookers and drums are visible in the background.
- **Config C (Refined):** A man and a woman in vibrant costumes pose in a street. The shirtless man wears green and yellow pants, while the woman sports a feathered headdress and a sequined outfit. Onlookers are visible in the background.

#### Verification & Refinement Behavior
- **Did Refinement Occur?** Yes
- **Unsupported Claims Detected:**
- The man and woman dance. (Reason: The 'actions' array lists 'is kneeling', 'is squatting', and 'is posing' for the man and woman, but 'dance' is not mentioned.)
- The scene is during the day. (Reason: The visual evidence does not provide any information regarding the time of day, such as 'daylight' or 'sunshine'.)
- Drums are visible in the background. (Reason: While 'drum' is listed as an object, its location 'in the background' is not explicitly stated in the evidence for the drum itself or the drummer. Only 'bystanders' are explicitly placed in the background.)
- **Uncertain Claims Detected:**
- The costumes are carnival costumes. (Reason: While the attire is consistent with carnival costumes (feathered headdress, sequins, vibrant colors), the visual evidence explicitly lists 'The exact type of event (e.g., carnival, parade, performance)' as uncertain, preventing a definitive 'supported' status.)

#### Evidence Match & Action Highlights
- **Verification Action:** The verifier checked the candidate against the visual evidence graph.
- **Refinement Action:** The refinement prompt successfully excised the unsupported/uncertain claims from the candidate string.
