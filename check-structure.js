// check-structure.js
const pdfParse = require('pdf-parse');
console.log('Type:', typeof pdfParse);
console.log('Keys:', Object.keys(pdfParse));
console.log('Has default?', pdfParse.default);
console.log('Default type:', typeof pdfParse.default);