
const cds = require('@sap/cds');
const fs = require('fs').promises;
const path = require('path');
const { PDFParse } = require('pdf-parse');

module.exports = cds.service.impl(function () {

  this.on('READ_PDF', async (req) => {
    const filename = req.data.filename || 'sample.pdf';
    const pdfPath = path.join(__dirname, '../uploads', filename);

    try {
      // Check if PDF file exists
      try {
        await fs.access(pdfPath);
      } catch (err) {
        req.error(404, `PDF file not found: ${filename}`);
        return;
      }

      console.log(`Processing PDF: ${filename}`);

      // Read PDF file as buffer
      const dataBuffer = await fs.readFile(pdfPath);
      console.log(`PDF file loaded, size: ${dataBuffer.length} bytes`);

      // Create PDFParse instance
      const parser = new PDFParse({
        data: dataBuffer,
        verbosity: 0  // Suppress console logs
      });

      // Extract text from PDF
      console.log('Extracting text from PDF...');
      const result = await parser.getText();

      console.log(`Extracted text length: ${result.text.length} characters`);
      console.log(`Total pages: ${result.total}`);

      if (!result.text || result.text.trim().length === 0) {
        req.error(400, 'No text found in PDF. This PDF might be empty.');
        return;
      }

      return result.text;

    } catch (error) {
      console.error('Error processing PDF:', error);
      console.error('Error stack:', error.stack);
      req.error(500, `Failed to process PDF: ${error.message}`);
    }
  });

});