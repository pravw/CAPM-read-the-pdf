/**
 * Text Parser Utility
 * Extracts structured data from PDF text
 */

class TextParser {
  
  /**
   * Parse extracted text into structured components
   * @param {string} text - Raw text from PDF
   * @returns {Object} Structured data
   */
  static parseDocument(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return {
      header: this.extractHeader(lines, text),
      items: this.extractLineItems(lines, text),
      supplier: this.extractSupplier(lines, text)
    };
  }

  /**
   * Extract header information
   */
  static extractHeader(lines, fullText) {
    const header = {};
    
    // Document Number patterns
    const docNumberPatterns = [
      /(?:invoice|document|order|po)\s*(?:number|no|#)\s*[:\-]?\s*([A-Z0-9\-]+)/i,
      /(?:ref|reference)\s*[:\-]?\s*([A-Z0-9\-]+)/i
    ];
    
    // Date patterns
    const datePatterns = [
      /(?:date|dated)\s*[:\-]?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/
    ];
    
    // Amount patterns
    const totalPatterns = [
      /(?:total|grand total|amount due)\s*[:\-]?\s*(?:USD|EUR|INR|₹|\$|€)?\s*([\d,]+\.?\d*)/i,
      /(?:total)\s*[:\-]?\s*([\d,]+\.?\d*)/i
    ];
    
    const taxPatterns = [
      /(?:tax|vat|gst)\s*[:\-]?\s*(?:USD|EUR|INR|₹|\$|€)?\s*([\d,]+\.?\d*)/i
    ];

    // Extract document number
    for (const pattern of docNumberPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        header.documentNumber = match[1];
        break;
      }
    }

    // Extract date
    for (const pattern of datePatterns) {
      const match = fullText.match(pattern);
      if (match) {
        header.documentDate = this.parseDate(match[1]);
        break;
      }
    }

    // Extract total amount
    for (const pattern of totalPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        header.totalAmount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Extract tax amount
    for (const pattern of taxPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        header.taxAmount = parseFloat(match[1].replace(/,/g, ''));
        break;
      }
    }

    // Extract currency
    const currencyMatch = fullText.match(/(?:USD|EUR|INR|GBP|JPY)/i);
    header.currency = currencyMatch ? currencyMatch[0].toUpperCase() : 'USD';

    // Extract PO Number
    const poMatch = fullText.match(/(?:po|purchase order)\s*(?:number|no|#)\s*[:\-]?\s*([A-Z0-9\-]+)/i);
    if (poMatch) {
      header.poNumber = poMatch[1];
    }

    // Calculate net amount
    if (header.totalAmount && header.taxAmount) {
      header.netAmount = header.totalAmount - header.taxAmount;
    }

    // Document type detection
    if (fullText.match(/invoice/i)) {
      header.documentType = 'Invoice';
    } else if (fullText.match(/purchase order|PO/i)) {
      header.documentType = 'Purchase Order';
    } else if (fullText.match(/quotation|quote/i)) {
      header.documentType = 'Quotation';
    } else {
      header.documentType = 'Unknown';
    }

    return header;
  }

  /**
   * Extract line items from text
   */
  static extractLineItems(lines, fullText) {
    const items = [];
    
    // Look for table-like structures
    // Common patterns: Item | Description | Qty | Price | Amount
    
    const itemPatterns = [
      // Pattern: Line with numbers that could be qty, price, amount
      /(\d+)\s+(.+?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:,\d{3})*(?:\.\d{2})?)\s+(\d+(?:,\d{3})*(?:\.\d{2})?)/,
      // Pattern: Item code followed by description and amounts
      /([A-Z0-9\-]+)\s+(.+?)\s+(\d+)\s+(\d+\.?\d*)\s+(\d+\.?\d*)/
    ];

    let lineNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip header lines
      if (line.match(/^(?:item|description|qty|quantity|price|amount|total)/i)) {
        continue;
      }

      for (const pattern of itemPatterns) {
        const match = line.match(pattern);
        if (match) {
          const item = {
            lineNumber: lineNumber++,
            itemCode: match[1],
            description: match[2].trim(),
            quantity: parseFloat(match[3]),
            unitPrice: parseFloat(match[4].replace(/,/g, '')),
            lineAmount: parseFloat(match[5].replace(/,/g, ''))
          };
          
          // Calculate tax if total vs amount differs
          if (item.lineAmount > item.quantity * item.unitPrice) {
            item.taxAmount = item.lineAmount - (item.quantity * item.unitPrice);
          }
          
          items.push(item);
          break;
        }
      }
    }

    // If no items found with patterns, try to extract from structured sections
    if (items.length === 0) {
      items.push({
        lineNumber: 1,
        description: 'Manual extraction required',
        quantity: 0,
        unitPrice: 0,
        lineAmount: 0
      });
    }

    return items;
  }

  /**
   * Extract supplier information
   */
  static extractSupplier(lines, fullText) {
    const supplier = {};

    // Supplier name patterns (usually at the top)
    const namePatterns = [
      /(?:from|vendor|supplier)\s*[:\-]?\s*(.+?)(?:\n|address)/i,
      /^([A-Z][A-Za-z\s&.,]+(?:Ltd|Inc|LLC|Corp|Limited|Private|Pvt)\.?)/m
    ];

    // Email pattern
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    
    // Phone pattern
    const phonePattern = /(?:phone|tel|mobile|contact)\s*[:\-]?\s*([\d\s\-+()]{10,})/i;
    
    // Address patterns
    const addressPattern = /(?:address)\s*[:\-]?\s*(.+?)(?:\n|phone|email|$)/is;
    
    // Tax ID patterns
    const taxIdPattern = /(?:tax id|vat|gstin|tin)\s*[:\-]?\s*([A-Z0-9]+)/i;

    // Extract supplier name (typically in first few lines)
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      for (const pattern of namePatterns) {
        const match = lines[i].match(pattern);
        if (match && match[1].length > 5 && match[1].length < 100) {
          supplier.supplierName = match[1].trim();
          break;
        }
      }
      if (supplier.supplierName) break;
    }

    // Extract email
    const emailMatch = fullText.match(emailPattern);
    if (emailMatch) {
      supplier.email = emailMatch[1];
    }

    // Extract phone
    const phoneMatch = fullText.match(phonePattern);
    if (phoneMatch) {
      supplier.phone = phoneMatch[1].trim();
    }

    // Extract address
    const addressMatch = fullText.match(addressPattern);
    if (addressMatch) {
      supplier.address = addressMatch[1].trim().replace(/\n/g, ', ');
    }

    // Extract tax ID
    const taxIdMatch = fullText.match(taxIdPattern);
    if (taxIdMatch) {
      supplier.taxId = taxIdMatch[1];
    }

    // Extract postal code
    const postalMatch = fullText.match(/\b(\d{5,6})\b/);
    if (postalMatch) {
      supplier.postalCode = postalMatch[1];
    }

    return supplier;
  }

  /**
   * Parse date string to ISO format
   */
  static parseDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return null;
    }
  }
}

module.exports = TextParser;