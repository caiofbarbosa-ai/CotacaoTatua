// Fallback cities for API failures
const FALLBACK_CITIES = [
    "São Paulo",
    "Santos",
    "São Vicente",
    "Guarujá",
    "Praia Grande",
    "Cubatão"
];

// Fetch cities from Supabase
async function fetchCitiesFromSupabase() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cidades?select=nome`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase API error: ${response.status}`);
        }

        const data = await response.json();
        return data.map(row => row.nome);
    } catch (error) {
        console.error('Error fetching cities from Supabase:', error);
        return FALLBACK_CITIES;
    }
}

// Populate city select
async function populateCities() {
    const citySelect = document.getElementById('city-select');
    const cities = await fetchCitiesFromSupabase();
    cities.sort().forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', populateCities);
