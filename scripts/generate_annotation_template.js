const fs = require('fs');
const pilotData = JSON.parse(fs.readFileSync('evaluation/results/phase-4.3-pilot.json', 'utf8'));

const annotationTemplate = [];
let claimIdCounter = 1;
const uniqueImages = new Set();

pilotData.forEach(record => {
  uniqueImages.add(record.image_id);
  
  if (record.verification_result && record.verification_result !== 'NOT_APPLICABLE' && Array.isArray(record.verification_result.claims)) {
    record.verification_result.claims.forEach(claim => {
      annotationTemplate.push({
        claim_id: `CLAIM_${String(claimIdCounter++).padStart(3, '0')}`,
        image_id: record.image_id,
        configuration: record.configuration,
        candidate_caption: record.candidate_caption,
        claim_text: claim.text,
        claim_type: claim.type,
        model_label: claim.status, // Stored separately
        model_reasoning: claim.reasoning,
        human_label: null, // STRICTLY NULL
        human_notes: null
      });
    });
  }
});

fs.writeFileSync('evaluation/annotation/pilot-human-annotation-template.json', JSON.stringify(annotationTemplate, null, 2));

console.log(`Generated annotation template with ${annotationTemplate.length} claims for ${uniqueImages.size} images.`);
