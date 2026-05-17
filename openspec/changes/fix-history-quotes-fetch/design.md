## Context

The `history.html` page currently retrieves quote history from browser localStorage. However, the application's quote creation flow saves all quotes to the Supabase `contatos` table via the `criar_cotacao` function. The `contatos` table contains the following fields: `codigo_cotacao`, `data_evento`, `data_cotacao`, `nome`, `telefone`, `cidade`, `time_option`, `action_time`, `quantidade_convidados`, `price_pb`, `price_colorido`, `guest_details`, `route_details`, and `date_adjustment_details`.

The page already includes `app.js` which has Supabase credentials configured (`SUPABASE_URL` and `SUPABASE_ANON_KEY`).

## Goals / Non-Goals

**Goals:**
- Fetch all quote records from Supabase `contatos` table
- Display quotes in the existing UI format
- Maintain period filtering functionality
- Keep CSV download working
- Ensure error handling for API failures

**Non-Goals:**
- Modifying the Supabase schema
- Adding authentication to history page
- Implementing pagination or infinite scroll
- Changing the existing UI layout or styling

## Decisions

**Direct Fetch vs Creating New Endpoint**
- **Choice**: Direct Supabase REST API fetch to `contatos` table
- **Rationale**: No need for a custom function - simple table read, reuses existing credentials pattern

**Data Mapping Approach**
- **Choice**: Map Supabase fields to UI object structure at fetch time
- **Rationale**: Existing UI rendering code expects specific field names (hash, quoteDate, etc.). Mapping once at fetch keeps display logic unchanged.

**Date Handling**
- **Choice**: Use Supabase date fields directly, format in JavaScript
- **Rationale**: Supabase returns ISO dates, JavaScript can format them. Simpler than server-side formatting.

**Ordering**
- **Choice**: Order by `data_cotacao` descending (newest first) at API level
- **Rationale**: Reduces client-side sorting, cleaner code. Use `order=data_cotacao.desc` in query.

## Risks / Trade-offs

**Large Dataset Performance**
- **Risk**: If `contatos` table grows large, fetching all records could be slow
- **Mitigation**: For now, fetch all with order. Future enhancement could add pagination or limit to recent N records.

**RLS Policy**
- **Risk**: `contatos` table may not have anon read permissions
- **Mitigation**: Verify RLS policy allows anon reads before implementation

**Field Name Mismatches**
- **Risk**: Supabase field names (snake_case) may not match UI expectations
- **Mitigation**: Create explicit mapping object to transform data into expected format

**Empty State Handling**
- **Risk**: Empty table shows no error feedback
- **Mitigation**: Reuse existing empty state UI, ensure empty array is handled gracefully

## Migration Plan

1. Add `fetchHistoryFromSupabase()` function
2. Update `loadHistory()` to use new function
3. Update `filterHistory()` to work with Supabase data
4. Update `downloadCSV()` to work with Supabase data
5. Test with sample data in `contatos` table

No rollback needed - code can be tested in development before deployment.

## Open Questions

- Is there an RLS policy allowing anon reads on `contatos` table?
- Should there be any date range limiting for the fetch (e.g., last 12 months)?