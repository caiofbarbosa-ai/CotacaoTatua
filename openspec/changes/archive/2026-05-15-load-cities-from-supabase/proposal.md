## Why

The city combo dropdown currently loads from a hardcoded array in `cities.js`, requiring manual updates when cities are added or modified in the Supabase database. This creates a maintenance burden and potential synchronization issues between the frontend data source and the database.

## What Changes

- Replace the hardcoded city array in `cities.js` with a dynamic fetch from Supabase `cidades` table
- Query the `cidades` table, retrieving the `nome` field
- Update the `populateCities()` function to use the fetched data
- Maintain fallback behavior in case of API failures

## Capabilities

### New Capabilities
- `dynamic-city-loading`: Load cities from Supabase database table instead of static array

### Modified Capabilities
- None

## Impact

- **Affected code**: `cities.js` (populateCities function, remove saoPauloCities array)
- **External dependency**: Supabase REST API (already configured in `app.js`)
- **No breaking changes**: The same city data structure is preserved
- **Error handling**: Graceful degradation if Supabase is unavailable