// const fs = require('fs');
// const path = require('path');
// const pdfParse = require('pdf-parse');

// console.log('Testing pdf-parse...');
// console.log('Type of pdfParse:', typeof pdfParse);

// const pdfPath = path.join(__dirname, 'uploads', 'sample.pdf');

// if (!fs.existsSync(pdfPath)) {
//   console.error('PDF file not found at:', pdfPath);
//   process.exit(1);
// }

// const dataBuffer = fs.readFileSync(pdfPath);
// console.log('PDF file loaded, size:', dataBuffer.length, 'bytes');

// pdfParse(dataBuffer).then(data => {
//   console.log('\n✅ SUCCESS!');
//   console.log('Number of pages:', data.numpages);
//   console.log('Text length:', data.text.length, 'characters');
//   console.log('\nFirst 300 characters:');
//   console.log(data.text.substring(0, 300));
// }).catch(err => {
//   console.error('\n❌ ERROR:', err.message);
//   console.error(err.stack);
// });


// const fs = require('fs');
// const path = require('path');
// const pdfParseModule = require('pdf-parse');

// console.log('Testing pdf-parse...');
// console.log('Type of pdfParseModule:', typeof pdfParseModule);
// console.log('Keys:', Object.keys(pdfParseModule));
// console.log('Has default?', pdfParseModule.default);
// console.log('Type of default:', typeof pdfParseModule.default);

// // Try to find the actual parse function
// const pdfParse = pdfParseModule.default || pdfParseModule;

// const pdfPath = path.join(__dirname, 'uploads', 'sample.pdf');

// if (!fs.existsSync(pdfPath)) {
//   console.error('PDF file not found at:', pdfPath);
//   process.exit(1);
// }

// const dataBuffer = fs.readFileSync(pdfPath);
// console.log('PDF file loaded, size:', dataBuffer.length, 'bytes');

// // Check if we have a function now
// if (typeof pdfParse === 'function') {
//   pdfParse(dataBuffer).then(data => {
//     console.log('\n✅ SUCCESS!');
//     console.log('Number of pages:', data.numpages);
//     console.log('Text length:', data.text.length, 'characters');
//     console.log('\nFirst 300 characters:');
//     console.log(data.text.substring(0, 300));
//   }).catch(err => {
//     console.error('\n❌ ERROR:', err.message);
//   });
// } else {
//   console.error('Could not find parse function!');
//   console.log('Module structure:', pdfParseModule);
// }



// fix3
// const fs = require('fs');
// const path = require('path');
// const { PDFParse } = require('pdf-parse');

// console.log('Testing pdf-parse...');

// const pdfPath = path.join(__dirname, 'uploads', 'sample.pdf');

// if (!fs.existsSync(pdfPath)) {
//   console.error('PDF file not found at:', pdfPath);
//   process.exit(1);
// }

// const dataBuffer = fs.readFileSync(pdfPath);
// console.log('PDF file loaded, size:', dataBuffer.length, 'bytes');

// const parser = new PDFParse();

// parser.parse(dataBuffer).then(data => {
//   console.log('\n✅ SUCCESS!');
//   console.log('Number of pages:', data.pages.length);
//   console.log('Text from first page:');
//   console.log(data.pages[0].text.substring(0, 300));
// }).catch(err => {
//   console.error('\n❌ ERROR:', err.message);
//   console.error(err.stack);
// });


// fix4
const fs = require('fs');
const path = require('path');

// Try importing pdf-parse
let pdfParse;
try {
  pdfParse = require('pdf-parse');
  console.log('pdf-parse loaded successfully');
  console.log('Type:', typeof pdfParse);
  console.log('Keys:', Object.keys(pdfParse));
} catch (error) {
  console.error('Failed to load pdf-parse:', error.message);
  process.exit(1);
}

const pdfPath = path.join(__dirname, 'uploads', 'sample.pdf');

// Check if file exists
if (!fs.existsSync(pdfPath)) {
  console.error('PDF file not found at:', pdfPath);
  process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);
console.log('PDF file loaded, size:', dataBuffer.length, 'bytes');

// Try the new API from pdf-parse v2.x
async function testParse() {
  try {
    // Based on the error, it seems to use PDFParse class
    if (pdfParse.PDFParse) {
      console.log('\n--- Trying PDFParse class ---');
      const parser = new pdfParse.PDFParse({
        data: dataBuffer,
        verbosity: 0
      });
      
      const result = await parser.getText();
      console.log('\n✅ SUCCESS with PDFParse class!');
      console.log('Text length:', result.text.length, 'characters');
      console.log('\nFirst 300 characters:');
      console.log(result.text.substring(0, 300));
      return;
    }
    
    // If not, list what's available
    console.log('Available exports:', Object.keys(pdfParse));
    console.log('Please check the documentation for pdf-parse v2.4.5');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  }
}

testParse();