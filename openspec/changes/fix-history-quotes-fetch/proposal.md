## Why

The `history.html` page uses localStorage to fetch quotes, but quotes are being saved to the Supabase `contatos` table. This creates a disconnect where the history page shows no data because it's looking in the wrong place (localStorage instead of Supabase database).

## What Changes

- Replace localStorage-based history fetch with Supabase query to the `contatos` table
- Fetch all records from `contatos` table
- Display Supabase data in the same format as the existing UI
- Maintain filtering functionality (period filter) with Supabase data
- Keep CSV download functionality working

## Capabilities

### New Capabilities
- `supabase-history-fetch`: Fetch and display quote history from Supabase database

### Modified Capabilities
- None

## Impact

- **Affected code**: `history.html` (loadHistory function, filterHistory function, downloadCSV function)
- **External dependency**: Supabase REST API (already configured in app.js)
- **No breaking changes**: Same data structure displayed to users
- **Data source**: localStorage → Supabase `contatos` table