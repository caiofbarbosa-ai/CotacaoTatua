# Proposal: Open PDF Template Preview

## Why

Currently, the "Download Proposta" button generates and downloads a PDF directly without allowing the user to preview or verify the content before finalizing. Opening the HTML template with placeholders replaced allows users to review the proposal in browser format before printing or saving manually, giving more control over the final output.

## What Changes

- **Replace PDF generation with HTML preview**: Clicking "Download Proposta" opens `pdf_template.html` in a new tab/window instead of generating PDF
- **Populate placeholders before opening**: All quotation data (date, city, prices extenso, hash) replaces placeholders in the template
- **Same template structure**: Uses the existing 4-page `pdf_template.html` from `quotation-pdf-export` change
- **User controls final output**: Users can print to PDF or save manually from browser

## Capabilities

### New Capabilities

- `quotation-html-preview`: Opens populated HTML template in new browser window/tab for manual review and output

### Modified Capabilities

- None

## Impact

**Code changes**:
- Modify `generatePDF()` function in `app.js` to open HTML preview instead of generating PDF
- Remove or keep html2pdf.js dependency (can remain for future PDF generation needs)
- Update button text from "Download Proposta" to "Ver Proposta" or similar

**User experience**: Users can preview the complete proposal with images and formatting before deciding to print or save as PDF manually.