## 1. Setup

- [x] 1.1 Verify Supabase `contatos` table has RLS policy allowing anon reads
- [x] 1.2 Confirm Supabase credentials are accessible from history.html (via app.js)

## 2. Core Implementation

- [x] 2.1 Create `fetchHistoryFromSupabase()` async function that queries the `contatos` table
- [x] 2.2 Implement field mapping from Supabase (snake_case) to UI (camelCase)
- [x] 2.3 Implement date formatting for `data_cotacao` and `data_evento`
- [x] 2.4 Update `loadHistory()` to use `fetchHistoryFromSupabase()` instead of localStorage
- [x] 2.5 Add error handling for API failures with user-friendly message

## 3. Filtering Implementation

- [x] 3.1 Update `filterHistory()` to work with Supabase data format
- [x] 3.2 Ensure date comparisons work with ISO dates from Supabase

## 4. CSV Export

- [x] 4.1 Update `downloadCSV()` to work with Supabase data format
- [x] 4.2 Verify CSV export includes all required columns with correct data

## 5. Testing

- [ ] 5.1 Test that history page loads with Supabase data (requires browser test)
- [ ] 5.2 Test period filtering with Supabase data (requires browser test)
- [ ] 5.3 Test CSV export with filtered data (requires browser test)
- [ ] 5.4 Test error handling when Supabase is unavailable (requires browser test)