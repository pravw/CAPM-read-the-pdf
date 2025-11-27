// using { } from '@sap/cds/common';

// service OCRService {
//    entity Dummy {
//     ID: UUID;
//   }
//    @odata.action
//   action READ_PDF() returns String;
// }

// using { } from '@sap/cds/common';

// service OCRService {
//   action READ_PDF(filename: String) returns String;
// }


using { } from '@sap/cds/common';

service OCRService {
  // Use 'function' for GET or keep 'action' for POST
  function READ_PDF(filename: String) returns String;
}