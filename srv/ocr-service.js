
// const cds = require('@sap/cds');
// const fs = require('fs').promises;
// const path = require('path');
// const { PDFParse } = require('pdf-parse');

// module.exports = cds.service.impl(function () {

//   this.on('READ_PDF', async (req) => {
//     const filename = req.data.filename || 'sample.pdf';
//     const pdfPath = path.join(__dirname, '../uploads', filename);

//     try {
//       // Check if PDF file exists
//       try {
//         await fs.access(pdfPath);
//       } catch (err) {
//         req.error(404, `PDF file not found: ${filename}`);
//         return;
//       }

//       console.log(`Processing PDF: ${filename}`);

//       // Read PDF file as buffer
//       const dataBuffer = await fs.readFile(pdfPath);
//       console.log(`PDF file loaded, size: ${dataBuffer.length} bytes`);

//       // Create PDFParse instance
//       const parser = new PDFParse({
//         data: dataBuffer,
//         verbosity: 0  // Suppress console logs
//       });

//       // Extract text from PDF
//       console.log('Extracting text from PDF...');
//       const result = await parser.getText();

//       console.log(`Extracted text length: ${result.text.length} characters`);
//       console.log(`Total pages: ${result.total}`);

//       if (!result.text || result.text.trim().length === 0) {
//         req.error(400, 'No text found in PDF. This PDF might be empty.');
//         return;
//       }

//       return result.text;

//     } catch (error) {
//       console.error('Error processing PDF:', error);
//       console.error('Error stack:', error.stack);
//       req.error(500, `Failed to process PDF: ${error.message}`);
//     }
//   });

// });



// const cds = require('@sap/cds');
// const fs = require('fs').promises;
// const path = require('path');
// const { PDFParse } = require('pdf-parse');

// module.exports = cds.service.impl(function () {
//   // Get reference to the ocr entity
//   const { ocr } = this.entities;

//   this.on('READ_PDF', async (req) => {
//     const filename = req.data.filename || 'sample.pdf';
//     const pdfPath = path.join(__dirname, '../uploads', filename);

//     try {
//       // Check if PDF file exists
//       try {
//         await fs.access(pdfPath);
//       } catch (err) {
//         req.error(404, `PDF file not found: ${filename}`);
//         return;
//       }

//       console.log(`Processing PDF: ${filename}`);

//       // Read PDF file as buffer
//       const dataBuffer = await fs.readFile(pdfPath);
//       console.log(`PDF file loaded, size: ${dataBuffer.length} bytes`);

//       // Create PDFParse instance
//       const parser = new PDFParse({
//         data: dataBuffer,
//         verbosity: 0  // Suppress console logs
//       });

//       // Extract text from PDF
//       console.log('Extracting text from PDF...');
//       const result = await parser.getText();

//       console.log(`Extracted text length: ${result.text.length} characters`);
//       console.log(`Total pages: ${result.total}`);

//       if (!result.text || result.text.trim().length === 0) {
//         req.error(400, 'No text found in PDF. This PDF might be empty.');
//         return;
//       }

//       // ✅ NEW CODE: Save the extracted text to database
//       await INSERT.into(ocr).entries({
//         filename: filename,
//         extractedText: result.text,
//         pageCount: result.total,
//         fileSize: dataBuffer.length
//       });

//       console.log('✅ OCR result saved to database');

//       return result.text;

//     } catch (error) {
//       console.error('Error processing PDF:', error);
//       console.error('Error stack:', error.stack);
//       req.error(500, `Failed to process PDF: ${error.message}`);
//     }
//   });

// });















// const cds = require('@sap/cds');
// const fs = require('fs').promises;
// const path = require('path');
// const pdfParse = require('pdf-parse');  // ← FIXED: direct import
// const TextParser = require('./utils/textParser');

// module.exports = cds.service.impl(function () {
//   const { OCRDocuments, DocumentHeaders, LineItems, SupplierInfo } = this.entities;

//   /**
//    * Main PDF processing function
//    */
//   this.on('READ_PDF', async (req) => {
//     const filename = req.data.filename || 'sample.pdf';
//     const pdfPath = path.join(__dirname, '../uploads', filename);

//     try {
//       // Step 1: Verify file exists
//       console.log('Step 1: Checking if PDF exists...');
//       try {
//         await fs.access(pdfPath);
//       } catch (err) {
//         return req.error(404, `PDF file not found: ${filename}`);
//       }

//       // Step 2: Read PDF file
//       console.log('Step 2: Reading PDF file...');
//       const dataBuffer = await fs.readFile(pdfPath);
//       console.log(`✓ PDF loaded: ${dataBuffer.length} bytes`);

//       // Step 3: Extract text from PDF
//       console.log('Step 3: Extracting text from PDF...');
//       const pdfData = await pdfParse(dataBuffer);  // ← FIXED: direct function call
//       const extractedText = pdfData.text;
//       console.log(`✓ Extracted: ${extractedText.length} characters, ${pdfData.numpages} pages`);

//       if (!extractedText || extractedText.trim().length === 0) {
//         return req.error(400, 'No text found in PDF');
//       }

//       // Step 4: Parse text into structured data
//       console.log('Step 4: Parsing structured data...');
//       const parsedData = TextParser.parseDocument(extractedText);
//       console.log('✓ Parsed data structure:', {
//         hasHeader: !!parsedData.header,
//         itemCount: parsedData.items.length,
//         hasSupplier: !!parsedData.supplier
//       });

//       // Step 5: Save to database
//       console.log('Step 5: Saving to database...');
      
//       // Create main OCR document
//       const documentId = cds.utils.uuid();
//       await INSERT.into(OCRDocuments).entries({
//         ID: documentId,
//         filename: filename,
//         extractedText: extractedText,
//         pageCount: pdfData.numpages,
//         fileSize: dataBuffer.length,
//         processedDate: new Date().toISOString()
//       });
//       console.log(`✓ Created OCR Document: ${documentId}`);

//       // Save header information
//       if (parsedData.header && Object.keys(parsedData.header).length > 0) {
//         await INSERT.into(DocumentHeaders).entries({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...parsedData.header
//         });
//         console.log('✓ Saved header data');
//       }

//       // Save line items
//       if (parsedData.items && parsedData.items.length > 0) {
//         const itemEntries = parsedData.items.map(item => ({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...item
//         }));
//         await INSERT.into(LineItems).entries(itemEntries);
//         console.log(`✓ Saved ${itemEntries.length} line items`);
//       }

//       // Save supplier information
//       if (parsedData.supplier && Object.keys(parsedData.supplier).length > 0) {
//         await INSERT.into(SupplierInfo).entries({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...parsedData.supplier
//         });
//         console.log('✓ Saved supplier information');
//       }

//       console.log('✅ PDF processing completed successfully!');

//       // Return success response
//       return {
//         documentId: documentId,
//         extractedText: extractedText.substring(0, 500) + '...', // Preview only
//         message: `Successfully processed ${filename}. Created document with ${parsedData.items.length} line items.`
//       };

//     } catch (error) {
//       console.error('❌ Error processing PDF:', error);
//       console.error('Stack trace:', error.stack);
//       return req.error(500, `Failed to process PDF: ${error.message}`);
//     }
//   });

//   /**
//    * Reprocess existing document
//    */
//   this.on('reprocessDocument', async (req) => {
//     const documentId = req.data.documentId;
    
//     try {
//       // Get the document
//       const doc = await SELECT.one.from(OCRDocuments).where({ ID: documentId });
      
//       if (!doc) {
//         return req.error(404, 'Document not found');
//       }

//       // Delete existing related data
//       await DELETE.from(DocumentHeaders).where({ document_ID: documentId });
//       await DELETE.from(LineItems).where({ document_ID: documentId });
//       await DELETE.from(SupplierInfo).where({ document_ID: documentId });

//       // Reparse the text
//       const parsedData = TextParser.parseDocument(doc.extractedText);

//       // Save new data
//       if (parsedData.header) {
//         await INSERT.into(DocumentHeaders).entries({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...parsedData.header
//         });
//       }

//       if (parsedData.items && parsedData.items.length > 0) {
//         const itemEntries = parsedData.items.map(item => ({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...item
//         }));
//         await INSERT.into(LineItems).entries(itemEntries);
//       }

//       if (parsedData.supplier) {
//         await INSERT.into(SupplierInfo).entries({
//           ID: cds.utils.uuid(),
//           document_ID: documentId,
//           ...parsedData.supplier
//         });
//       }

//       return `Document ${documentId} reprocessed successfully`;

//     } catch (error) {
//       console.error('Error reprocessing document:', error);
//       return req.error(500, `Failed to reprocess: ${error.message}`);
//     }
//   });

//   /**
//    * Read operations with expanded data
//    */
//   this.after('READ', OCRDocuments, async (docs) => {
//     if (Array.isArray(docs)) {
//       for (const doc of docs) {
//         await expandDocument(doc);
//       }
//     } else if (docs) {
//       await expandDocument(docs);
//     }
//   });

//   async function expandDocument(doc) {
//     if (!doc) return;
    
//     // Load related data
//     doc.header = await SELECT.one.from(DocumentHeaders).where({ document_ID: doc.ID });
//     doc.items = await SELECT.from(LineItems).where({ document_ID: doc.ID });
//     doc.supplier = await SELECT.one.from(SupplierInfo).where({ document_ID: doc.ID });
//   }

// });



// final




const cds = require('@sap/cds');
const fs = require('fs').promises;
const path = require('path');
const { PDFParse } = require('pdf-parse');

module.exports = cds.service.impl(function () {
  const { PDFDocuments, InvoiceData } = this.entities;

  /**
   * Simple function to read PDF text only
   */
  this.on('readPDF', async (req) => {
    const filename = req.data.filename || 'sample.pdf';
    const pdfPath = path.join(__dirname, '../uploads', filename);

    try {
      await fs.access(pdfPath);
      const dataBuffer = await fs.readFile(pdfPath);
      const parser = new PDFParse({ data: dataBuffer, verbosity: 0 });
      const result = await parser.getText();
      
      if (!result.text || result.text.trim().length === 0) {
        req.error(400, 'No text found in PDF.');
        return;
      }
      
      return result.text;
    } catch (error) {
      console.error('Error processing PDF:', error);
      req.error(500, `Failed to process PDF: ${error.message}`);
    }
  });

  /**
   * Process PDF and save to database
   */
  this.on('processPDF', async (req) => {
    const filename = req.data.filename || 'sample.pdf';
    const pdfPath = path.join(__dirname, '../uploads', filename);

    try {
      console.log('Step 1: Checking if PDF exists...');
      const stats = await fs.stat(pdfPath);
      
      console.log('Step 2: Reading PDF file...');
      const dataBuffer = await fs.readFile(pdfPath);
      console.log(`✓ PDF loaded: ${dataBuffer.length} bytes`);

      console.log('Step 3: Extracting text from PDF...');
      const parser = new PDFParse({ data: dataBuffer, verbosity: 0 });
      const result = await parser.getText();
      const extractedText = result.text;
      console.log(`✓ Extracted: ${extractedText.length} characters, ${result.total} pages`);

      if (!extractedText || extractedText.trim().length === 0) {
        return {
          success: false,
          documentId: null,
          text: '',
          message: 'No text found in PDF'
        };
      }

      console.log('Step 4: Parsing structured data...');
      const parsedData = this.parseInvoiceData(extractedText);
      console.log('✓ Parsed invoice data:', parsedData);

      console.log('Step 5: Saving to database...');
      const documentId = cds.utils.uuid();
      
      await INSERT.into(PDFDocuments).entries({
        ID: documentId,
        filename: filename,
        uploadDate: new Date().toISOString(),
        extractedText: extractedText,
        pageCount: result.total,
        fileSize: stats.size,
        status: 'Processed'
      });
      console.log(`✓ Created PDF Document: ${documentId}`);

      // Save invoice data if found
      if (parsedData.invoiceNumber) {
        const invoiceId = cds.utils.uuid();
        await INSERT.into(InvoiceData).entries({
          ID: invoiceId,
          document_ID: documentId,
          invoiceNumber: parsedData.invoiceNumber,
          invoiceDate: parsedData.invoiceDate,
          customerName: parsedData.customerName,
          totalAmount: parsedData.totalAmount,
          currency: parsedData.currency,
          extractedFields: JSON.stringify(parsedData)
        });
        console.log('✓ Saved invoice data');
      }

      console.log('✅ PDF processing completed successfully!');

      return {
        success: true,
        documentId: documentId,
        text: extractedText.substring(0, 500) + '...', // Preview
        message: `Successfully processed ${filename}`
      };

    } catch (error) {
      console.error('❌ Error processing PDF:', error);
      console.error('Stack trace:', error.stack);
      return {
        success: false,
        documentId: null,
        text: '',
        message: error.message
      };
    }
  });

  /**
   * Export all documents to CSV
   */
  this.on('exportToCSV', async (req) => {
    try {
      const documents = await SELECT.from(PDFDocuments);
      
      let csv = 'ID,Filename,Upload Date,Page Count,File Size,Status\n';
      
      for (const doc of documents) {
        const uploadDate = doc.uploadDate ? new Date(doc.uploadDate).toISOString() : '';
        csv += `"${doc.ID}","${doc.filename}","${uploadDate}",${doc.pageCount},${doc.fileSize},"${doc.status}"\n`;
      }
      
      return csv;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      req.error(500, `Export failed: ${error.message}`);
    }
  });

  /**
   * Export all documents to JSON
   */
  this.on('exportToJSON', async (req) => {
    try {
      const documents = await SELECT.from(PDFDocuments);
      return JSON.stringify(documents, null, 2);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      req.error(500, `Export failed: ${error.message}`);
    }
  });

  /**
   * Helper function to parse invoice data from text
   */
  this.parseInvoiceData = (text) => {
    const data = {
      invoiceNumber: null,
      invoiceDate: null,
      customerName: null,
      totalAmount: null,
      currency: 'USD'
    };

    try {
      // Extract invoice number
      const invoiceMatch = text.match(/(?:Invoice|Number)[\s:]+(\d+)/i);
      if (invoiceMatch) {
        data.invoiceNumber = invoiceMatch[1];
      }

      // Extract date (formats: 2/18/2019, 02/18/2019, 2019-02-18)
      const dateMatch = text.match(/Date[\s:]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
      if (dateMatch) {
        data.invoiceDate = dateMatch[1];
      }

      // Extract total amount
      const totalMatch = text.match(/Total Amount Due[\s:]+\$[\s]*([\d,]+\.\d{2})/i);
      if (totalMatch) {
        data.totalAmount = parseFloat(totalMatch[1].replace(',', ''));
      }

      // Extract customer name (Bill To section)
      const customerMatch = text.match(/Bill To[\s\n]+([^\n]+)/i);
      if (customerMatch) {
        data.customerName = customerMatch[1].trim();
      }

    } catch (error) {
      console.error('Error parsing invoice data:', error);
    }

    return data;
  };

});