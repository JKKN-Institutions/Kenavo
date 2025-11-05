const fs = require('fs');
const https = require('https');
const path = require('path');

// Alumni data with their names
const alumni = [
  { id: 1, name: 'A Arjoon', initials: 'AA' },
  { id: 2, name: 'Annamalai Natarajan', initials: 'AN' },
  { id: 3, name: 'A S Syed Ahamed Khan', initials: 'SAK' },
  { id: 4, name: 'Antony G Prakash', initials: 'AP' },
  { id: 5, name: 'Abishek Valluru', initials: 'AV' }
];

// Colors for variety
const colors = ['3498db', 'e74c3c', '2ecc71', 'f39c12', '9b59b6'];

const outputDir = path.join(__dirname, 'profile-images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function generateAllImages() {
  console.log('🎨 Generating mock profile images...\n');

  for (let i = 0; i < alumni.length; i++) {
    const alum = alumni[i];
    const color = colors[i];

    // UI Avatars API: https://ui-avatars.com/
    // Parameters: name, background color, size, format
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(alum.initials)}&background=${color}&color=fff&size=400&format=png&bold=true&font-size=0.4`;

    const filename = `${alum.id}.jpg`;
    const filepath = path.join(outputDir, filename);

    try {
      await downloadImage(url, filepath);
    } catch (error) {
      console.error(`❌ Failed to download image for ${alum.name}:`, error.message);
    }
  }

  console.log('\n✨ Image generation complete!');
  console.log(`📁 Images saved to: ${outputDir}`);
}

generateAllImages().catch(console.error);
