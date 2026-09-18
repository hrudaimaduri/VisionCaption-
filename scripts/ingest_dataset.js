const fs = require('fs');
const path = require('path');

const IMAGE_DIR = 'C:\\Users\\pc\\Downloads\\Flickr8k';
const TOKENS_FILE = 'C:\\Users\\pc\\Downloads\\Flickr8k_text\\Flickr8k.token.txt';
const TEST_SPLIT_FILE = 'C:\\Users\\pc\\Downloads\\Flickr8k_text\\Flickr_8k.testImages.txt';
const MANIFEST_PATH = path.join(__dirname, '../evaluation/data/manifest.json');

function parseDataset() {
  console.log('Loading test split...');
  const testSplitRaw = fs.readFileSync(TEST_SPLIT_FILE, 'utf8').split('\n').filter(Boolean);
  const testImages = new Set(testSplitRaw.map(line => line.trim()));
  console.log(`Found ${testImages.size} official test images.`);

  console.log('Loading annotations...');
  const tokensRaw = fs.readFileSync(TOKENS_FILE, 'utf8').split('\n').filter(Boolean);
  
  const annotationsMap = {};
  for (const line of tokensRaw) {
    // line format: "image_id.jpg#0\tA child in a pink dress..."
    const firstTab = line.indexOf('\t');
    if (firstTab === -1) continue;
    
    const idPart = line.substring(0, firstTab);
    const caption = line.substring(firstTab + 1).trim();
    
    const [imageId] = idPart.split('#');
    
    if (!annotationsMap[imageId]) {
      annotationsMap[imageId] = [];
    }
    annotationsMap[imageId].push(caption);
  }
  
  const totalImages = Object.keys(annotationsMap).length;
  const totalCaptions = tokensRaw.length;
  console.log(`Found ${totalCaptions} reference captions for ${totalImages} total images.`);

  const manifest = [];
  let missingImages = 0;
  let missingCaptions = 0;

  for (const imageId of testImages) {
    const captions = annotationsMap[imageId];
    if (!captions) {
      missingCaptions++;
      continue;
    }

    const imagePath = path.join(IMAGE_DIR, imageId);
    if (!fs.existsSync(imagePath)) {
      missingImages++;
      continue;
    }

    manifest.push({
      image_id: imageId,
      image_path: imagePath,
      split: 'test',
      reference_captions: captions
    });
  }

  console.log(`Successfully mapped ${manifest.length} test images to local files and annotations.`);
  console.log(`Missing images on disk: ${missingImages}`);
  console.log(`Missing captions in token file: ${missingCaptions}`);

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Wrote manifest to ${MANIFEST_PATH}`);
}

parseDataset();
