



namespace ocr.db;

entity PDFDocuments {
  key ID            : UUID;
      filename      : String(255);
      uploadDate    : DateTime;
      extractedText : LargeString;
      pageCount     : Integer;
      fileSize      : Integer;
      status        : String(50);
      invoiceData   : Composition of many InvoiceData on invoiceData.document = $self;
}

entity InvoiceData {
  key ID              : UUID;
      document        : Association to PDFDocuments;
      invoiceNumber   : String(100);
      invoiceDate     : String(50);
      customerName    : String(255);
      totalAmount     : Decimal(15, 2);
      currency        : String(3);
      extractedFields : LargeString;
}