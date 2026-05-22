# Design: Quotation PDF Export

## Context

The quotation system already exists with form input, calculation engine, and result presentation. Quotations are displayed in the browser with all calculated values (date, city, action time, PB price, colorido price, quote code). The Form_Proposta.docx template defines the expected document format.

Current state: Users can view quotations and contact via WhatsApp, but cannot download as PDF.

Constraints:
- Must work client-side (no backend server)
- Must match existing Form_Proposta.docx template format
- Must include prices "por extenso" (in words)
- Must handle conditional content (lines 1-2-3 for guest count option)

## Goals / Non-Goals

**Goals:**
- Generate professional PDF documents from quotation data
- Match Form_Proposta.docx visual format and content structure
- Support download functionality with proper file naming
- Include all calculated values and conditional content
- Maintain dark theme in browser, but ensure PDF readability

**Non-Goals:**
- Server-side PDF generation
- Email sending functionality
- Batch PDF generation
- PDF editing capabilities
- Digital signatures

## Decisions

### html2pdf.js Library
**Decision**: Use html2pdf.js for client-side PDF generation.

**Rationale**:
- Pure client-side, no server required
- Preserves CSS styling from DOM elements
- Simple API: `html2pdf().from(element).save()`
- Works with existing HTML/CSS structure
- No API keys or external services needed

**Alternatives considered**:
- jsPDF (rejected: requires manual layout positioning, more complex)
- Server-side PDF (rejected: no backend available)
- Browser print-to-PDF (rejected: poor user experience, requires manual steps)

### DOM Element Targeting for PDF
**Decision**: Create a dedicated container div for PDF content that matches the document template format.

**Rationale**:
- Allows separate styling for PDF vs browser display
- Can hide elements not needed in PDF
- Easier to match Form_Proposta.docx format
- No duplication of content

**Alternatives considered**:
- Generate HTML string on demand (rejected: harder to maintain styling)
- Use browser print stylesheet (rejected: less control over output)

### Number to Words Conversion
**Decision**: Implement a client-side JavaScript function to convert currency values to Portuguese extenso format.

**Rationale**:
- Required by specification ("valor pb extenso", "valor colorido extenso")
- Simple to implement for Brazilian Portuguese
- No external dependency needed
- Can handle currency formatting (R$ X,XXX,XX)

**Alternatives considered**:
- External library (rejected: unnecessary complexity for limited use case)

### File Naming Convention
**Decision**: Use format "Proposta_[QUOTE_CODE]_[DATE].pdf" for downloaded files.

**Rationale**:
- Includes unique quote identifier for reference
- Includes date for easy sorting and identification
- Professional naming convention
- Easy to match with quote history records

**Alternatives considered**:
- Sequential numbers (rejected: less informative)
- Timestamp only (rejected: harder to identify specific quote)

### Conditional Content Display
**Decision**: Use JavaScript to toggle visibility of lines 1-2-3 based on the action time option selected during quote creation.

**Rationale**:
- Matches specification requirements exactly
- Lines only shown when "quantidade de convidados" was selected
- Clean PDF output without empty lines
- Maintains consistency with browser display

**Alternatives considered**:
- Always show empty lines (rejected: unprofessional appearance)

## Risks / Trade-offs

### Cross-Browser PDF Rendering
**Risk**: html2pdf.js may render differently across browsers or fail on older devices.

**Mitigation**: Test on major browsers (Chrome, Firefox, Safari, Edge). Provide fallback "print" option using `window.print()` as backup.

### PDF File Size
**Risk**: PDF with styling and potentially large content may result in large file sizes.

**Mitigation**: Optimize images if any are included. Use CSS that translates well to PDF format. Keep content focused and concise.

### Styling Mismatch
**Risk**: CSS that looks good in browser may not render correctly in PDF.

**Mitigation**: Test PDF output thoroughly. Create PDF-specific stylesheets where needed. Use CSS properties known to work well with html2pdf.js.

### Number to Words Edge Cases
**Risk**: Number conversion may have edge cases (e.g., very large numbers, special formatting).

**Mitigation**: Implement comprehensive conversion function tested with expected price ranges. Handle Brazilian Portuguese number naming conventions correctly.

## Migration Plan

### Implementation Steps
1. Add html2pdf.js CDN link to quotation page
2. Create PDF-specific container div with Form_Proposta.docx format
3. Implement number-to-words conversion function
4. Add "Download PDF" button to quotation result page
5. Implement click handler to generate and download PDF
6. Add conditional visibility logic for lines 1-2-3
7. Style optimization for PDF output
8. Test with various price ranges and options

### Rollback Strategy
- Remove CDN link and PDF-related code if issues arise
- Keep existing quotation functionality intact
- No database or state changes to rollback

## Open Questions

1. **Template Reference**: Should we use the actual Form_Proposta.docx as visual reference or implement from specification text?
   - *Assumption*: Use specification text requirements as primary source, with Form_Proposta.docx as visual styling reference

2. **Price Precision**: What decimal precision should be used for price calculations and extenso conversion?
   - *Assumption*: Use 2 decimal places as shown in examples (R$2.200,00)

3. **Date Format**: What date format should be used in PDF (DD/MM/YYYY or other)?
   - *Assumption*: DD/MM/YYYY as per Brazilian Portuguese convention

4. **PDF Orientation**: Should PDF be portrait or landscape?
   - *Assumption*: Portrait to match typical proposal document format

5. **Quote Code Source**: How should the unique quote code be generated (hash, UUID, timestamp-based)?
   - *Assumption*: Use existing quote code generation from the current system (if any), or implement timestamp-based hash