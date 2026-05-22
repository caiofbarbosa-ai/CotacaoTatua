# Proposal: Quotation PDF Export

## Why

Customers need to download quotations as PDF files for record-keeping and sharing. Currently, quotations are only displayed in the browser, requiring users to manually screenshot or print to PDF. Adding a direct PDF download button provides a professional output that matches the formal document template format.

## What Changes

- **PDF download button**: Add download button to quotation result page that generates and downloads a PDF file
- **PDF formatting**: Generate PDF matching the Form_Proposta.docx template format with proper styling
- **Client-side PDF generation**: Use browser-based PDF library (no server required)
- **Dynamic content**: PDF includes all calculated values (prices by extenso, dates, city, action time)
- **Conditional display**: Lines 1-2-3 only shown when "quantity of guests" option was selected

## Capabilities

### New Capabilities

- `quotation-pdf-generation`: Client-side PDF export of quotation data in formatted document style

### Modified Capabilities

- `quotation-presentation`: Extend existing quotation presentation to include PDF download functionality

## Impact

**Code changes**:
- Add PDF generation library to existing quotation page
- Implement PDF download handler in JavaScript
- Style optimization for PDF output format

**New dependencies**:
- PDF generation library (html2pdf.js or similar)

**Affected files**:
- Existing quotation presentation page (add download button and PDF logic)
- Possibly new PDF template or styling optimization

**User experience**: Customers can now download professional PDF quotations directly from the browser without manual intervention.