# Design: Open PDF Template Preview

## Context

The `quotation-pdf-export` change created a 4-page HTML template (`pdf_template.html`) with placeholders for quotation data. The current implementation fetches this template, replaces placeholders, and generates a PDF using html2pdf.js. Users want to see the HTML preview directly instead of immediate PDF download.

Current state:
- Template exists with 4 pages: date/title/tatua1.png → tatua_pg2.jpg → tatua_pg3.jpg → tatua2.png + proposal text
- PDF generation works but takes time and offers no preview

Constraints:
- Must use existing `pdf_template.html` template
- Placeholders must be replaced with actual quotation data
- Opens in new tab/window
- Client-side only (no server)

## Goals / Non-Goals

**Goals:**
- Open populated HTML template in new browser tab
- Replace all placeholders with quotation data
- Allow user to print/save manually
- Maintain the 4-page structure and styling

**Non-Goals:**
- Automatic PDF generation (user does this manually)
- Save to local file
- Backend processing
- Editable template fields

## Decisions

### Open in New Window
**Decision**: Use `window.open()` with data URL or Blob URL to open template.

**Rationale**:
- Simple browser-native approach
- No external dependencies
- User can print/save with browser controls
- Preserves all styling and images

**Alternatives considered**:
- Replace current page (rejected: loses quotation result)
- Modal overlay (rejected: 4-page content too large)
- Download as HTML file (rejected: extra user step)

### Data URL Approach
**Decision**: Fetch template, replace placeholders, convert to Blob URL, open in new window.

**Rationale**:
- Works with all browsers
- No CORS issues
- Images load correctly from same origin
- Clean implementation

**Code flow**:
```
fetch('pdf_template.html')
  → replace placeholders
  → create Blob (text/html)
  → create ObjectURL
  → window.open(url, '_blank')
```

**Alternatives considered**:
- Data URI directly (rejected: can have size limits)
- iframe in current page (rejected: doesn't allow proper print/save)

### Button Text Update
**Decision**: Change button text from "Download Proposta" to "Ver Proposta".

**Rationale**:
- More accurate description of action
- Sets user expectation (preview, not immediate download)

## Risks / Trade-offs

### Browser Pop-up Blockers
**Risk**: `window.open()` may be blocked by browser pop-up blockers.

**Mitigation**: Call in direct response to user click (not async). This bypasses most blockers.

### Image Loading
**Risk**: Images may not load if opened via Blob URL with relative paths.

**Mitigation**: Use absolute paths for images or ensure same-origin loading works. Test cross-browser.

### No Direct PDF Download
**Risk**: Extra user step required to get PDF (print/save manually).

**Mitigation**: Browser print-to-PDF is straightforward and high quality. User has full control.

### Placeholder Replacement
**Risk**: Complex string replacement could fail or replace wrong instances.

**Mitigation**: Use unique placeholder format already in template. Test with all quotation data types.

## Migration Plan

### Implementation Steps
1. Modify `generatePDF()` function to fetch template
2. Replace placeholders with quotation data
3. Create Blob URL from modified HTML
4. Open new window with Blob URL
5. Update button text to "Ver Proposta"
6. Test with sample quotations

### Rollback Strategy
- Keep original PDF generation code commented or in separate function
- Can revert by changing function call
- No data or structural changes

## Open Questions

1. **Browser compatibility**: Should we test Safari specifically? (Mobile may behave differently)
2. **Image paths**: Are relative paths in template resolved correctly in new window?
3. **Print styling**: Does `@media print` CSS work correctly in new window?

**Assumptions**:
- Modern browsers support Blob URLs
- Images load from same origin without issues
- User knows how to print/save to PDF from browser