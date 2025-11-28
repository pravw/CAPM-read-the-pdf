
// using { managed, cuid } from '@sap/cds/common';

// service OCRService {


//    entity ocr : cuid, managed {
//     filename      : String;
//     extractedText : LargeString;
//     pageCount     : Integer;
//     fileSize      : Integer;
//   }
//   // Use 'function' for GET or keep 'action' for POST
//   function READ_PDF(filename: String) returns String;
// }



// using { managed } from '@sap/cds/common';

// service OCRService {
//   entity ocr : managed {
//     key ID        : UUID;
//     filename      : String;
//     extractedText : LargeString;
//     pageCount     : Integer;
//     fileSize      : Integer;
//   }
  
//   function READ_PDF(filename: String) returns String;
// }


// using { ocr.db } from '../db/schema';

// service OCRService {
  
//   // Main entities exposed
//   entity OCRDocuments as projection on db.OCRDocument;
//   entity DocumentHeaders as projection on db.DocumentHeader;
//   entity LineItems as projection on db.LineItem;
//   entity SupplierInfo as projection on db.SupplierInfo;
  
//   // Function to process PDF and extract structured data
//   function READ_PDF(filename: String) returns {
//     documentId: String;
//     extractedText: String;
//     message: String;
//   };
  
//   // Action to reprocess a document
//   action reprocessDocument(documentId: UUID) returns String;
// }


// final

// using { ocr.db } from '../db/schema';

// service OCRService {
  
//   // Expose entities for CRUD
//   entity PDFDocuments as projection on db.PDFDocuments;
//   entity InvoiceData as projection on db.InvoiceData;
  
//   // Read PDF text only
//   function readPDF(filename: String) returns String;
  
//   // Process and save to database
//   action processPDF(filename: String) returns {
//     success: Boolean;
//     documentId: String;
//     text: String;
//     message: String;
//   };
  
//   // Export functions
//   function exportToCSV() returns String;
//   function exportToJSON() returns String;
// }



// enhanced



using { ocr.db } from '../db/schema';

service OCRService {
  
  // Expose entities for CRUD
  entity PDFDocuments as projection on db.PDFDocuments;
  entity DocumentHeaders as projection on db.DocumentHeaders;
  entity LineItems as projection on db.LineItems;
  entity InvoiceData as projection on db.InvoiceData;
  
  // Read PDF text only
  function readPDF(filename: String) returns String;
  
  // Process and save to database
  action processPDF(filename: String) returns {
    success: Boolean;
    documentId: String;
    headerId: String;
    text: String;
    message: String;
  };
  
  // Export functions
  function exportToCSV() returns String;
  function exportToJSON() returns String;
}
