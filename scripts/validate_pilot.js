const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../evaluation/data/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const pilotSubset = manifest.slice(0, 3);

console.log('--- VALIDATION BEFORE EXECUTION ---');
console.log(`Selected ${pilotSubset.length} images for pilot.`);
console.log('Image IDs:');
pilotSubset.forEach((img) => console.log(`  - ${img.image_id}`));

const maxCallsPerImage = 4; // generate, analyze, verify, refine
const totalMaxCalls = pilotSubset.length * maxCallsPerImage;
console.log(`\nExpected maximum base API calls: ${totalMaxCalls}`);
console.log('Validating reuse structure: Candidate and Evidence will be fetched ONCE and passed to A, B, and C.');
