const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../evaluation/data/manifest.json');

function validateDataset() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('ERROR: Manifest file not found at', MANIFEST_PATH);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    console.error('ERROR: Manifest is not valid JSON.');
    process.exit(1);
  }

  if (!Array.isArray(manifest)) {
    console.error('ERROR: Manifest must be an array of objects.');
    process.exit(1);
  }

  if (manifest.length === 0) {
    console.warn('WARNING: Dataset manifest is empty. (DATASET NOT YET INSTALLED)');
    return;
  }

  const seenImages = new Set();
  let errors = 0;

  for (let i = 0; i < manifest.length; i++) {
    const record = manifest[i];
    
    // Schema validation
    if (!record.image_id || typeof record.image_id !== 'string') {
      console.error(`ERROR at index ${i}: Missing or invalid image_id.`);
      errors++;
    }
    
    if (!record.image_path || typeof record.image_path !== 'string') {
      console.error(`ERROR at index ${i}: Missing or invalid image_path.`);
      errors++;
    }

    if (!record.split || !['train', 'val', 'test'].includes(record.split)) {
      console.error(`ERROR at index ${i}: Missing or invalid split.`);
      errors++;
    }

    if (!Array.isArray(record.reference_captions) || record.reference_captions.length === 0) {
      console.error(`ERROR at index ${i}: Missing or empty reference_captions.`);
      errors++;
    }

    // Duplicate detection
    if (seenImages.has(record.image_id)) {
      console.error(`ERROR: Duplicate image_id found: ${record.image_id}`);
      errors++;
    }
    seenImages.add(record.image_id);

    // Image path validation
    if (record.image_path) {
      const fullImagePath = path.resolve(__dirname, '..', record.image_path);
      if (!fs.existsSync(fullImagePath)) {
        console.error(`ERROR: Image file not found for ${record.image_id} at ${fullImagePath}`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`Dataset validation failed with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log(`Dataset validation passed. ${manifest.length} records verified.`);
  }
}

validateDataset();
