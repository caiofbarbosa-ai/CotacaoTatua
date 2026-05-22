## ADDED Requirements

### Requirement: Generate PDF from quotation data
The system SHALL generate a PDF document containing all quotation data when the user clicks the download button.

#### Scenario: Successful PDF generation
- **WHEN** user clicks "Download PDF" button on quotation result page
- **THEN** system generates a PDF file with all quotation data
- **AND** file is downloaded to user's device
- **AND** PDF filename follows format "Proposta_[QUOTE_CODE]_[DATE].pdf"

#### Scenario: PDF includes all calculated values
- **WHEN** PDF is generated
- **THEN** PDF contains current date
- **AND** PDF contains chosen event date
- **AND** PDF contains selected city
- **AND** PDF contains action time option selected
- **AND** PDF contains calculated action time
- **AND** PDF contains PB price (numeric format)
- **AND** PDF contains PB price por extenso
- **AND** PDF contains Colorido price (numeric format)
- **AND** PDF contains Colorido price por extenso
- **AND** PDF contains unique quote code

### Requirement: Conditional content display in PDF
The system SHALL display lines 1-2-3 only when the "quantidade de convidados" option was selected.

#### Scenario: Lines shown for guest count option
- **WHEN** user selected "quantidade de convidados" option
- **THEN** PDF displays lines 1, 2, and 3
- **AND** lines contain relevant guest count information

#### Scenario: Lines hidden for action time option
- **WHEN** user selected "tempo de ação" option
- **THEN** PDF does NOT display lines 1, 2, or 3

### Requirement: Price conversion to extenso
The system SHALL convert numeric price values to Portuguese text format (por extenso).

#### Scenario: Convert PB price to extenso
- **WHEN** PB price is R$2.200,00
- **THEN** system converts to "dois mil e duzentos reais"

#### Scenario: Convert Colorido price to extenso
- **WHEN** Colorido price is R$2.500,00
- **THEN** system converts to "dois mil e quinhentos reais"

#### Scenario: Handle decimal values in extenso
- **WHEN** price contains cents (e.g., R$1.250,50)
- **THEN** system converts to "mil duzentos e cinquenta reais e cinquenta centavos"

### Requirement: PDF formatting matches template
The system SHALL generate PDF with formatting that matches the Form_Proposta.docx template style.

#### Scenario: PDF has professional document format
- **WHEN** PDF is generated
- **THEN** PDF uses document-style layout (not webpage style)
- **AND** PDF includes company branding/logo
- **AND** PDF uses consistent typography and spacing
- **AND** PDF uses professional color scheme suitable for printing

#### Scenario: PDF maintains readability
- **WHEN** PDF is generated
- **THEN** PDF has sufficient contrast for readability
- **AND** PDF uses appropriate font sizes
- **AND** PDF content is properly aligned

### Requirement: Client-side PDF generation
The system SHALL generate PDF entirely on the client side without requiring server processing.

#### Scenario: No server dependency
- **WHEN** user requests PDF download
- **THEN** generation happens in browser
- **AND** no API call to server is made
- **AND** PDF generation is independent of internet connection (after library load)