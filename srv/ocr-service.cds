
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



using { managed } from '@sap/cds/common';

service OCRService {
  entity ocr : managed {
    key ID        : UUID;
    filename      : String;
    extractedText : LargeString;
    pageCount     : Integer;
    fileSize      : Integer;
  }
  
  function READ_PDF(filename: String) returns String;
}