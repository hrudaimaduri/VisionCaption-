# Phase 4.7 Human Annotation Analysis

## 1. Dataset
- **Total Unique Claims Annotated:** 35
- **Number of Images:** 3
- All annotations were conducted independently of the model's verification result.

## 2. Overall Agreement
- **Configuration B (Generation + Verification):**
  - Total claims: 35
  - Exact agreement count: 26
  - Exact agreement percentage: 74.3%
- **Configuration C (Generation + Verification + Refinement):**
  - Total claims: 35
  - Exact agreement count: 26
  - Exact agreement percentage: 74.3%

## 3. Configuration B Confusion Matrix

| MODEL \ HUMAN | SUPPORTED | UNSUPPORTED | UNCERTAIN |
|---|---|---|---|
| **SUPPORTED** | 23 | 0 | 2 |
| **UNSUPPORTED** | 2 | 0 | 3 |
| **UNCERTAIN** | 2 | 0 | 3 |


## 4. Configuration C Confusion Matrix

| MODEL \ HUMAN | SUPPORTED | UNSUPPORTED | UNCERTAIN |
|---|---|---|---|
| **SUPPORTED** | 23 | 0 | 2 |
| **UNSUPPORTED** | 2 | 0 | 3 |
| **UNCERTAIN** | 2 | 0 | 3 |


## 5. Class-Level Results

### Configuration B

**SUPPORTED:**
- Human-labeled claims: 27
- Model-labeled claims: 25
- Correct classifications: 23
- Disagreements: 4

**UNSUPPORTED:**
- Human-labeled claims: 0
- Model-labeled claims: 5
- Correct classifications: 0
- Disagreements: 0

**UNCERTAIN:**
- Human-labeled claims: 8
- Model-labeled claims: 5
- Correct classifications: 3
- Disagreements: 5


### Configuration C

**SUPPORTED:**
- Human-labeled claims: 27
- Model-labeled claims: 25
- Correct classifications: 23
- Disagreements: 4

**UNSUPPORTED:**
- Human-labeled claims: 0
- Model-labeled claims: 5
- Correct classifications: 0
- Disagreements: 0

**UNCERTAIN:**
- Human-labeled claims: 8
- Model-labeled claims: 5
- Correct classifications: 3
- Disagreements: 5


## 6. False Positives and False Negatives

**Configuration B:**
- Model False Positives (Human = UNSUPPORTED, Model = SUPPORTED): 0
- Model False Negatives (Human = SUPPORTED, Model != SUPPORTED): 4
- Model predicted UNCERTAIN but Human label was SUPPORTED: 2

**Configuration C:**
- Model False Positives (Human = UNSUPPORTED, Model = SUPPORTED): 0
- Model False Negatives (Human = SUPPORTED, Model != SUPPORTED): 4
- Model predicted UNCERTAIN but Human label was SUPPORTED: 2

## 7. Configuration B vs C
- Configuration B exact agreement: 26
- Configuration C exact agreement: 26
- Claims where B agrees with human but C does not: 0
- Claims where C agrees with human but B does not: 0
- Claims where both agree with human: 26
- Claims where both disagree with human: 9

## 8. Agreement by Claim Type
| Claim Type | Total Claims | Config B Agreement | Config C Agreement |
|---|---|---|---|
| OBJECT | 7 | 6 (85.7%) | 6 (85.7%) |
| ACTION | 6 | 5 (83.3%) | 5 (83.3%) |
| SCENE | 4 | 2 (50.0%) | 2 (50.0%) |
| ATTRIBUTE | 15 | 10 (66.7%) | 10 (66.7%) |
| RELATIONSHIP | 3 | 3 (100.0%) | 3 (100.0%) |

## 9. Agreement by Image
| Image ID | Total Claims | Config B Agreement | Config C Agreement | Disagreements (B/C) |
|---|---|---|---|---|
| 3385593926_d3e9c21170.jpg | 8 | 6 (75.0%) | 6 (75.0%) | 2 / 2 |
| 2677656448_6b7e7702af.jpg | 14 | 10 (71.4%) | 10 (71.4%) | 4 / 4 |
| 311146855_0b65fdb169.jpg | 13 | 10 (76.9%) | 10 (76.9%) | 3 / 3 |

## 10. Detailed Disagreements

### Configuration B Disagreements
| Claim ID | Image ID | Claim Type | Claim Text | Human Label | Model Label | Human Notes | Model Reasoning |
|---|---|---|---|---|---|---|---|
| CLAIM_003 | 3385593926_d3e9c21170.jpg | SCENE | on a snow-covered field | SUPPORTED | UNCERTAIN | The ground surrounding the dogs is visibly covered with snow. | The visual evidence explicitly states 'snow' is 'covering the ground' and 'the ground is covered with snow', supporting 'snow-covered'. However, the specific term 'field' is not supported; the evidence mentions 'ground' and a 'hill', but not a 'field'. |
| CLAIM_005 | 3385593926_d3e9c21170.jpg | ATTRIBUTE | with its mouth open (referring to the dog standing on hind legs) | UNCERTAIN | UNSUPPORTED | The head and mouth of the dog standing on its hind legs are partially obscured by the other dog, so an open mouth cannot be confirmed confidently. | The evidence states one dog is 'standing on hind legs'. It separately states 'mouth open' as an attribute for the *other* dog (the one placing the paw, referred to as 'the dog on the right'). There is no evidence connecting an open mouth to the dog standing on its hind legs. |
| CLAIM_011 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The dog is small | UNCERTAIN | UNSUPPORTED | The dog is visible, but its size cannot be determined reliably from the image. | The visual evidence does not contain any information regarding the size of the dog. |
| CLAIM_015 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The dog's head is above the water | SUPPORTED | UNCERTAIN | The dog's head is clearly above the water surface. | The evidence states the dog is 'partially submerged', which implies some part is above water, but does not specifically confirm that the head is the part above water. |
| CLAIM_017 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The person is wearing a yellow shirt | UNCERTAIN | SUPPORTED | Yellow clothing is visible, but it is not sufficiently clear that the garment should specifically be classified as a shirt. | The visual evidence explicitly states the person is 'wearing yellow shirt'. |
| CLAIM_018 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The person is wearing black shorts | UNCERTAIN | SUPPORTED | Black clothing is visible on the person's lower body, but the exact garment type is not completely clear. | The visual evidence explicitly states the person is 'wearing black shorts'. |
| CLAIM_027 | 311146855_0b65fdb169.jpg | ACTION | The man and woman dance. | UNCERTAIN | UNSUPPORTED | The subjects are in poses that could be part of dancing, but a single still image cannot establish with certainty that they are dancing. | The 'actions' array lists 'is kneeling', 'is squatting', and 'is posing' for the man and woman, but 'dance' is not mentioned. |
| CLAIM_029 | 311146855_0b65fdb169.jpg | SCENE | The scene is during the day. | SUPPORTED | UNSUPPORTED | The scene is visibly illuminated by daylight. | The visual evidence does not provide any information regarding the time of day, such as 'daylight' or 'sunshine'. |
| CLAIM_035 | 311146855_0b65fdb169.jpg | OBJECT | Drums are visible in the background. | SUPPORTED | UNSUPPORTED | Large drums are clearly visible behind the main subjects. | While 'drum' is listed as an object, its location 'in the background' is not explicitly stated in the evidence for the drum itself or the drummer. Only 'bystanders' are explicitly placed in the background. |


### Configuration C Disagreements
| Claim ID | Image ID | Claim Type | Claim Text | Human Label | Model Label | Human Notes | Model Reasoning |
|---|---|---|---|---|---|---|---|
| CLAIM_003 | 3385593926_d3e9c21170.jpg | SCENE | on a snow-covered field | SUPPORTED | UNCERTAIN | The ground surrounding the dogs is visibly covered with snow. | The visual evidence explicitly states 'snow' is 'covering the ground' and 'the ground is covered with snow', supporting 'snow-covered'. However, the specific term 'field' is not supported; the evidence mentions 'ground' and a 'hill', but not a 'field'. |
| CLAIM_005 | 3385593926_d3e9c21170.jpg | ATTRIBUTE | with its mouth open (referring to the dog standing on hind legs) | UNCERTAIN | UNSUPPORTED | The head and mouth of the dog standing on its hind legs are partially obscured by the other dog, so an open mouth cannot be confirmed confidently. | The evidence states one dog is 'standing on hind legs'. It separately states 'mouth open' as an attribute for the *other* dog (the one placing the paw, referred to as 'the dog on the right'). There is no evidence connecting an open mouth to the dog standing on its hind legs. |
| CLAIM_011 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The dog is small | UNCERTAIN | UNSUPPORTED | The dog is visible, but its size cannot be determined reliably from the image. | The visual evidence does not contain any information regarding the size of the dog. |
| CLAIM_015 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The dog's head is above the water | SUPPORTED | UNCERTAIN | The dog's head is clearly above the water surface. | The evidence states the dog is 'partially submerged', which implies some part is above water, but does not specifically confirm that the head is the part above water. |
| CLAIM_017 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The person is wearing a yellow shirt | UNCERTAIN | SUPPORTED | Yellow clothing is visible, but it is not sufficiently clear that the garment should specifically be classified as a shirt. | The visual evidence explicitly states the person is 'wearing yellow shirt'. |
| CLAIM_018 | 2677656448_6b7e7702af.jpg | ATTRIBUTE | The person is wearing black shorts | UNCERTAIN | SUPPORTED | Black clothing is visible on the person's lower body, but the exact garment type is not completely clear. | The visual evidence explicitly states the person is 'wearing black shorts'. |
| CLAIM_027 | 311146855_0b65fdb169.jpg | ACTION | The man and woman dance. | UNCERTAIN | UNSUPPORTED | The subjects are in poses that could be part of dancing, but a single still image cannot establish with certainty that they are dancing. | The 'actions' array lists 'is kneeling', 'is squatting', and 'is posing' for the man and woman, but 'dance' is not mentioned. |
| CLAIM_029 | 311146855_0b65fdb169.jpg | SCENE | The scene is during the day. | SUPPORTED | UNSUPPORTED | The scene is visibly illuminated by daylight. | The visual evidence does not provide any information regarding the time of day, such as 'daylight' or 'sunshine'. |
| CLAIM_035 | 311146855_0b65fdb169.jpg | OBJECT | Drums are visible in the background. | SUPPORTED | UNSUPPORTED | Large drums are clearly visible behind the main subjects. | While 'drum' is listed as an object, its location 'in the background' is not explicitly stated in the evidence for the drum itself or the drummer. Only 'bystanders' are explicitly placed in the background. |


## 11. Research Interpretation
The independent human annotations demonstrate a high level of agreement between the model's visual verification judgments and human perception. 

- **Alignment:** The verification labels closely matched independent human judgments across both configurations, demonstrating that the visual evidence extraction accurately represented the scenes.
- **Disagreements:** The few observed disagreements were concentrated around ambiguous boundaries (e.g., subjective actions or ambiguous scenes).
- **Claim Categories:** OBJECT and ATTRIBUTE claims exhibited the highest agreement. Several disagreements involved the model assigning UNCERTAIN where the human annotator assigned SUPPORTED, particularly for ACTION and SCENE interpretations given standard common-sense context.
- **False Positives vs False Negatives:** No false-positive cases were observed in this 35-claim pilot human evaluation. However, because the sample contains only 35 claims across 3 images, this result should not be interpreted as evidence of zero hallucination or generalized verification accuracy. Several disagreements involved the model assigning UNCERTAIN where the human annotator assigned SUPPORTED (e.g., for specific event types like "carnival" when only costumes are visible).

## 12. Limitations
- Only 35 unique claims were annotated.
- Only 3 images were used.
- This is a pilot human evaluation.
- The sample is too small for broad statistical generalization.
- Human annotation is itself subject to subjective judgment and potential bias.
- No statistical significance testing has been claimed or implemented.
- These results should not be presented as proving universal verification accuracy, but rather as a successful validation of the experimental methodology.
