console.log('Testing pdf-parse import...');

try {
  const pdfParse = require('pdf-parse');
  console.log('✅ pdf-parse imported successfully');
  console.log('Type:', typeof pdfParse);
  console.log('Is function?', typeof pdfParse === 'function');
} catch (error) {
  console.error('❌ Failed to import:', error.message);
}