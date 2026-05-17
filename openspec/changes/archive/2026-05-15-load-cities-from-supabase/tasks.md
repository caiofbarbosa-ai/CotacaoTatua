## 1. Preparation

- [x] 1.1 Verify Supabase `cidades` table exists and has RLS policy allowing anon reads on `nome` field
- [x] 1.2 Confirm Supabase URL and ANON_KEY are accessible in `cities.js` (or configure if not)

## 2. Core Implementation

- [x] 2.1 Create async function `fetchCitiesFromSupabase()` that queries the `cidades` table
- [x] 2.2 Update `populateCities()` to call `fetchCitiesFromSupabase()` instead of using `saoPauloCities`
- [x] 2.3 Implement sorting of fetched cities alphabetically
- [x] 2.4 Add error handling with fallback city list (São Paulo, Santos, São Vicente, Guarujá, Praia Grande, Cubatão)

## 3. Cleanup

- [x] 3.1 Remove the hardcoded `saoPauloCities` array from `cities.js`
- [x] 3.2 Remove the `pricingData` array (unused after changes) if confirmed unnecessary

## 4. Testing

- [ ] 4.1 Test that city dropdown populates on page load with Supabase data (requires browser test)
- [ ] 4.2 Test that cities are sorted alphabetically (requires browser test)
- [ ] 4.3 Test fallback behavior when Supabase API is unavailable (requires browser test - can simulate by invalidating API key)
- [ ] 4.4 Test that quote calculation still works with dynamically loaded city selection (requires browser test)