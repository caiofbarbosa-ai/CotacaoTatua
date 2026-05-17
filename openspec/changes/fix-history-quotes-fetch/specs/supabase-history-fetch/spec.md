## ADDED Requirements

### Requirement: Fetch quote history from Supabase database
The system SHALL retrieve all quote records from the Supabase `contatos` table when the history page loads, replacing the localStorage-based approach.

#### Scenario: Successful history fetch
- **WHEN** the history page loads
- **THEN** the system SHALL fetch all records from the `contatos` table
- **THEN** the system SHALL order results by `data_cotacao` in descending order
- **THEN** the system SHALL transform Supabase field names to match UI expectations

#### Scenario: Supabase API error
- **WHEN** the Supabase API returns an error or is unreachable
- **THEN** the system SHALL display an error message to the user
- **THEN** the system SHALL show the empty state UI

### Requirement: Field mapping between Supabase and UI
The system SHALL map Supabase table fields to the expected UI data structure to maintain compatibility with existing display code.

#### Scenario: Field mapping
- **WHEN** transforming Supabase data
- **THEN** `codigo_cotacao` SHALL map to `hash`
- **THEN** `data_cotacao` SHALL map to `quoteDate` and be formatted as `DD/MM/YYYY HH:mm`
- **THEN** `data_evento` SHALL map to `eventDate` and be formatted as `DD/MM/YYYY`
- **THEN** `cidade` SHALL map to `city`
- **THEN** `nome` SHALL map to `clientName`
- **THEN** `telefone` SHALL map to `clientPhone`
- **THEN** `action_time` SHALL map to `actionTime`
- **THEN** `time_option` SHALL map to `timeOption`
- **THEN** `price_pb` SHALL map to `pricePB`
- **THEN** `price_colorido` SHALL map to `priceColorido`

### Requirement: Period filtering with Supabase data
The system SHALL support filtering quotes by date range using Supabase data instead of localStorage.

#### Scenario: Filter by start date
- **WHEN** user selects a start date and clicks "Filtrar"
- **THEN** the system SHALL filter Supabase records where `data_evento` is greater than or equal to the selected date

#### Scenario: Filter by end date
- **WHEN** user selects an end date and clicks "Filtrar"
- **THEN** the system SHALL filter Supabase records where `data_evento` is less than or equal to the selected date

#### Scenario: Clear filter
- **WHEN** user clicks "Limpar Filtro"
- **THEN** the system SHALL reload all quotes from Supabase
- **THEN** the filter inputs SHALL be cleared

### Requirement: CSV export with Supabase data
The system SHALL generate CSV exports from Supabase data, maintaining the same format and functionality.

#### Scenario: Download filtered CSV
- **WHEN** user clicks "Download CSV" with filters applied
- **THEN** the system SHALL download a CSV file containing only the filtered Supabase records
- **THEN** the CSV SHALL include columns: Código, Data da Cotação, Nome, Telefone, Data do Evento, Cidade, Tempo de Ação (horas), Tipo de Cálculo, Preço PB, Preço Colorido

#### Scenario: Download all CSV
- **WHEN** user clicks "Download CSV" without filters
- **THEN** the system SHALL download a CSV file containing all Supabase records