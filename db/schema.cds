






// enhance schema


namespace ocr.db;

// Main PDF Document
entity PDFDocuments {
  key ID            : UUID;
      filename      : String(255);
      uploadDate    : DateTime;
      extractedText : LargeString;
      pageCount     : Integer;
      fileSize      : Integer;
      status        : String(50);
      
      // Relationships
      headers       : Composition of many DocumentHeaders on headers.document = $self;
}

// Document Header (Invoice, Purchase Order, etc.)
entity DocumentHeaders {
  key ID              : UUID;
      document        : Association to PDFDocuments;
      
      // Header Information
      documentType    : String(50);      // INVOICE, PURCHASE_ORDER, DELIVERY_NOTE
      documentNumber  : String(100);
      documentDate    : String(50);
      dueDate         : String(50);
      
      // Parties
      supplierName    : String(255);
      supplierAddress : String(500);
      supplierVAT     : String(50);
      customerName    : String(255);
      customerAddress : String(500);
      customerVAT     : String(50);
      
      // Totals
      subtotal        : Decimal(15, 2);
      taxAmount       : Decimal(15, 2);
      totalAmount     : Decimal(15, 2);
      currency        : String(3) default 'USD';
      
      // Additional Info
      paymentTerms    : String(255);
      notes           : LargeString;
      extractedFields : LargeString;
      
      // Relationships
      lineItems       : Composition of many LineItems on lineItems.header = $self;
}

// Line Items
entity LineItems {
  key ID              : UUID;
      header          : Association to DocumentHeaders;
      
      lineNumber      : Integer;
      itemDescription : String(500);
      itemCode        : String(100);
      quantity        : Decimal(15, 3);
      unitPrice       : Decimal(15, 2);
      discount        : Decimal(15, 2);
      taxRate         : Decimal(5, 2);
      lineTotal       : Decimal(15, 2);
      
      // Additional fields
      unit            : String(20);      // EA, KG, M, etc.
      category        : String(100);
}

// Keep the old InvoiceData for backward compatibility
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