const fs = require('fs');

const pilotData = JSON.parse(fs.readFileSync('evaluation/results/phase-4.3-pilot.json', 'utf8'));

// Map to store unique claims: key = image_id + claim_text
const uniqueClaimsMap = new Map();

pilotData.forEach(record => {
  if (record.verification_result && record.verification_result !== 'NOT_APPLICABLE' && Array.isArray(record.verification_result.claims)) {
    record.verification_result.claims.forEach(claim => {
      const key = `${record.image_id}_${claim.text}`;
      
      if (!uniqueClaimsMap.has(key)) {
        uniqueClaimsMap.set(key, {
          image_id: record.image_id,
          claim_text: claim.text,
          claim_type: claim.type,
          model_label_B: null,
          model_label_C: null,
          model_reasoning_B: null,
          model_reasoning_C: null
        });
      }
      
      const entry = uniqueClaimsMap.get(key);
      if (record.configuration === 'B') {
        entry.model_label_B = claim.status;
        entry.model_reasoning_B = claim.reasoning;
      } else if (record.configuration === 'C') {
        entry.model_label_C = claim.status;
        entry.model_reasoning_C = claim.reasoning;
      }
    });
  }
});

const annotationTemplate = [];
let claimIdCounter = 1;

uniqueClaimsMap.forEach(entry => {
  annotationTemplate.push({
    claim_id: `CLAIM_${String(claimIdCounter++).padStart(3, '0')}`,
    image_id: entry.image_id,
    claim_text: entry.claim_text,
    claim_type: entry.claim_type,
    model_label_B: entry.model_label_B,
    model_label_C: entry.model_label_C,
    model_reasoning_B: entry.model_reasoning_B, // Useful for post-analysis
    model_reasoning_C: entry.model_reasoning_C,
    human_label: null, // STRICTLY NULL
    human_notes: null
  });
});

fs.writeFileSync('evaluation/annotation/pilot-human-annotation-template.json', JSON.stringify(annotationTemplate, null, 2));

console.log(`Generated deduplicated annotation template with ${annotationTemplate.length} claims.`);
