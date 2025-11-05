const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const outputPath = path.join(__dirname, 'mock_images.zip');
const sourceDir = path.join(__dirname, 'profile-images');

// Create a write stream
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Listen to stream events
output.on('close', () => {
  console.log(`✅ ZIP file created: ${outputPath}`);
  console.log(`📦 Total size: ${archive.pointer()} bytes`);
  console.log(`📁 Contents: 5 profile images (1.jpg through 5.jpg)`);
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files from the profile-images directory
console.log('📦 Creating ZIP file...\n');
archive.directory(sourceDir, false);

// Finalize the archive
archive.finalize();
