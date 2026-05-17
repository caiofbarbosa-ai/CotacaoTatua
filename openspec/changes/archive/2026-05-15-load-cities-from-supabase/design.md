## Context

The current implementation uses a hardcoded JavaScript array `saoPauloCities` in `cities.js` containing 645+ São Paulo state cities. This array is sorted alphabetically and populated into a select element on page load. The project already has Supabase integration configured in `app.js` with credentials and established API communication patterns.

The Supabase database has a `cidades` table with at least a `nome` field, as evidenced by the `get_city_coordinates` function that references this table.

## Goals / Non-Goals

**Goals:**
- Replace static array with dynamic Supabase query
- Maintain existing user experience (sorted city list, default option)
- Provide graceful fallback if Supabase is unavailable
- Reuse existing Supabase configuration from `app.js`

**Non-Goals:**
- Modifying the database schema
- Changing the city selection UI/UX
- Implementing pagination or search functionality
- Caching strategies beyond simple browser fallback

## Decisions

**Direct API Call vs Supabase Client SDK**
- **Choice**: Use native `fetch` with Supabase REST API
- **Rationale**: Project already uses direct `fetch` calls in `app.js` (e.g., `callCriarCotacao`, `buscarCotacoes60Dias`). No additional dependency needed, lighter weight than adding the Supabase JS client.

**Error Handling Strategy**
- **Choice**: Fallback to a minimal hardcoded list if Supabase fails
- **Rationale**: Ensures the form remains functional even during network issues or API outages. A small list of major cities (São Paulo, Santos, etc.) provides emergency functionality.

**Synchronous vs Asynchronous Loading**
- **Choice**: Keep current synchronous `DOMContentLoaded` pattern but convert `populateCities` to async
- **Rationale**: Cities load quickly; user impact minimal. Alternative would be loading indicator, but that adds UX complexity for a simple dropdown.

**Data Structure**
- **Choice**: Return array of strings (city names) from Supabase query
- **Rationale**: Existing code expects strings for option values and text. No transformation needed on the frontend.

## Risks / Trade-offs

**API Latency on Initial Load**
- **Risk**: Users may see empty dropdown briefly while fetching
- **Mitigation**: Existing "Selecione uma cidade" default option remains; actual city list populates quickly behind the scenes

**Supabase Outage**
- **Risk**: Complete API failure leaves dropdown empty
- **Mitigation**: Implement fallback to hardcoded emergency city list (5-10 major cities)

**CORS Issues**
- **Risk**: Direct fetch to Supabase REST API may encounter CORS
- **Mitigation**: Project already makes successful fetch calls to Supabase from `app.js`, confirming CORS is configured correctly

**Table Permissions**
- **Risk**: `cidades` table may not have RLS policy allowing anon reads
- **Mitigation**: Confirm RLS policy exists for `public.cidades` table before implementation