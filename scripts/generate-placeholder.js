// Generate a simple placeholder profile image
const fs = require('fs');
const path = require('path');

// Create a simple SVG avatar
const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="200" cy="200" r="200" fill="#6B7280"/>

  <!-- Head -->
  <circle cx="200" cy="160" r="60" fill="#9CA3AF"/>

  <!-- Body -->
  <ellipse cx="200" cy="320" rx="100" ry="80" fill="#9CA3AF"/>
</svg>`;

// Save SVG file
const svgPath = path.join(__dirname, '..', 'public', 'placeholder-profile.svg');
fs.writeFileSync(svgPath, svg);

console.log('✅ Generated placeholder-profile.svg');

// Also create a simple HTML file to convert to PNG manually if needed
const html = `<!DOCTYPE html>
<html>
<head>
  <title>Placeholder Profile</title>
</head>
<body style="margin: 0; padding: 0;">
  <canvas id="canvas" width="400" height="400"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#6B7280';
    ctx.beginPath();
    ctx.arc(200, 200, 200, 0, 2 * Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = '#9CA3AF';
    ctx.beginPath();
    ctx.arc(200, 160, 60, 0, 2 * Math.PI);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.ellipse(200, 320, 100, 80, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Download as PNG
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = 'placeholder-profile.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 100);
  </script>
</body>
</html>`;

const htmlPath = path.join(__dirname, '..', 'public', 'generate-placeholder.html');
fs.writeFileSync(htmlPath, html);

console.log('✅ Generated generate-placeholder.html (open in browser to download PNG)');
console.log('   File location:', htmlPath);
