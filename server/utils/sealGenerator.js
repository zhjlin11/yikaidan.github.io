const { createCanvas } = require('canvas');

function generateSeal(text = 'Official Seal') {
  const size = 200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'red';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  return canvas.toDataURL();
}

module.exports = generateSeal;
