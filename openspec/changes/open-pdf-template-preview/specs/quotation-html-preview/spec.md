## ADDED Requirements

### Requirement: Open HTML preview in new window
The system SHALL open the populated PDF template in a new browser tab/window when the user clicks the proposal button.

#### Scenario: Successful HTML preview opens
- **WHEN** user clicks "Ver Proposta" button
- **THEN** system fetches pdf_template.html
- **AND** system replaces all placeholders with quotation data
- **AND** system opens new browser tab/window with populated HTML
- **AND** new tab displays 4-page proposal structure

#### Scenario: Template fetch fails
- **WHEN** system fails to fetch pdf_template.html
- **THEN** system displays error message to user
- **AND** no new window is opened

### Requirement: Replace template placeholders with quotation data
The system SHALL replace all placeholders in the HTML template with actual quotation data before opening.

#### Scenario: All placeholders replaced
- **WHEN** template is loaded with quotation data
- **THEN** [data atual] is replaced with current date (DD/MM/YYYY)
- **AND** [cidade escolhida] is replaced with selected city
- **AND** [tempo de ação] is replaced with action time + " horas"
- **AND** [valor pb] is replaced with formatted PB price
- **AND** [valor pb extenso] is replaced with PB price por extenso
- **AND** [valor colorido] is replaced with formatted colorido price
- **AND** [valor colorido extenso] is replaced with colorido price por extenso
- **AND** [hash proposta] is replaced with unique quote hash

#### Scenario: No quotation data available
- **WHEN** user clicks button without quotation data
- **THEN** system displays alert message
- **AND** no template is opened

### Requirement: Maintain template structure in new window
The system SHALL preserve the complete 4-page structure and styling when opening the template.

#### Scenario: 4-page structure displayed
- **WHEN** HTML preview opens in new window
- **THEN** Page 1 displays date + "PROPOSTA COMERCIAL" + tatua1.png
- **AND** Page 2 displays tatua_pg2.jpg full page
- **AND** Page 3 displays tatua_pg3.jpg full page
- **AND** Page 4 displays black background + tatua2.png + proposal text

#### Scenario: Images load correctly
- **WHEN** HTML preview opens in new window
- **THEN** all images (tatua1.png, tatua_pg2.jpg, tatua_pg3.jpg, tatua2.png) load and display
- **AND** images maintain correct sizing and positioning