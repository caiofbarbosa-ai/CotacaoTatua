## ADDED Requirements

### Requirement: Dynamic city loading from database
The system SHALL load the list of cities from the Supabase `cidades` table by querying the `nome` field, replacing the hardcoded JavaScript array.

#### Scenario: Successful city list fetch
- **WHEN** the page loads and the DOM is ready
- **THEN** the system SHALL fetch cities from Supabase at the configured REST API endpoint
- **THEN** the system SHALL query the `cidades` table selecting the `nome` field
- **THEN** the system SHALL populate the city select dropdown with all returned cities
- **THEN** the cities SHALL be sorted alphabetically
- **THEN** the default "Selecione uma cidade" option SHALL remain as the first option

#### Scenario: Supabase API error
- **WHEN** the Supabase API returns an error or is unreachable
- **THEN** the system SHALL log the error to the console
- **THEN** the system SHALL load a fallback list of major cities
- **THEN** the city select dropdown SHALL contain at minimum: São Paulo, Santos, São Vicente, Guarujá, Praia Grande, Cubatão

### Requirement: City data format consistency
The system SHALL maintain the same data format as the original hardcoded array to ensure backward compatibility with existing quote calculation logic.

#### Scenario: City option structure
- **WHEN** a city is added to the dropdown
- **THEN** the option's `value` attribute SHALL match the city name string
- **THEN** the option's `textContent` SHALL match the city name string
- **THEN** no additional transformation or formatting SHALL be applied to the city name

### Requirement: Supabase query configuration
The system SHALL use the existing Supabase URL and anonymous key configuration from the application to authenticate the city list query.

#### Scenario: API request headers
- **WHEN** fetching cities from Supabase
- **THEN** the request SHALL include the `apikey` header with the configured anonymous key
- **THEN** the request SHALL include the `Authorization` header with `Bearer {ANON_KEY}`
- **THEN** the request SHALL use the `Content-Type: application/json` header