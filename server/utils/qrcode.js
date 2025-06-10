const QRCode = require('qrcode');

async function generatePayCode(text) {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error('QR generation failed', err);
    return '';
  }
}

module.exports = generatePayCode;
