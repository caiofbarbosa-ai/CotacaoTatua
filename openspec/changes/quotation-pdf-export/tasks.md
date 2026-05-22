## 1. Setup and Dependencies

- [x] 1.1 Add html2pdf.js CDN link to quotation result page
- [x] 1.2 Create PDF template HTML file (pdf_template.html) with 4-page structure
- [ ] 1.3 Verify library loads correctly in browser console

## 2. Core Functionality

- [x] 2.1 Implement number-to-words conversion function for Brazilian Portuguese
- [x] 2.2 Add "Download PDF" button to quotation result page UI
- [x] 2.3 Implement click handler for PDF generation (async, fetches template)
- [x] 2.4 Create PDF filename generator with quote code and date format
- [x] 2.5 Populate template placeholders with quotation data fields

## 3. PDF Template Structure

- [x] 3.1 Create Page 1: Date + "PROPOSTA COMERCIAL" + tatua1.png
- [x] 3.2 Create Page 2: Full page tatua_pg2.jpg image
- [x] 3.3 Create Page 3: Full page tatua_pg3.jpg image
- [x] 3.4 Create Page 4: Black background + tatua2.png + proposal text with placeholders

## 4. PDF Styling and Formatting

- [x] 4.1 Create PDF-specific CSS styles for Verdana 35px title
- [x] 4.2 Configure multi-page A4 format with page breaks
- [x] 4.3 Add company logos/branding to appropriate pages
- [x] 4.4 Configure html2pdf.js options (margin: 0, scale: 2, pagebreak: css/legacy)
- [x] 4.5 Ensure proper contrast and readability (black background page)

## 5. Testing and Validation

- [ ] 5.1 Test PDF generation with all 4 pages
- [ ] 5.2 Verify placeholders replaced correctly (date, city, prices extenso, hash)
- [ ] 5.3 Test PDF download on Chrome browser
- [ ] 5.4 Verify PDF filename format matches specification
- [ ] 5.5 Test with actual quotation data