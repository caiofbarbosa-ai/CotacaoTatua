## 1. Modify Button and Handler

- [x] 1.1 Update button text from "Download Proposta" to "Ver Proposta"
- [x] 1.2 Modify generatePDF() function to open HTML preview instead of PDF generation

## 2. Implement HTML Preview Logic

- [x] 2.1 Fetch pdf_template.html from server
- [x] 2.2 Replace placeholders with quotation data (same replacement logic as PDF version)
- [x] 2.3 Create Blob URL from modified HTML content
- [x] 2.4 Open new browser window/tab with Blob URL
- [x] 2.5 Handle errors (template fetch fails, no data available, pop-up blocked)

## 3. Testing and Validation

- [ ] 3.1 Test button opens new window correctly
- [ ] 3.2 Verify all placeholders replaced with correct data
- [ ] 3.3 Verify 4-page structure displays correctly
- [ ] 3.4 Test images load in new window
- [ ] 3.5 Test print functionality from new window
- [ ] 3.6 Test with different quotation data sets