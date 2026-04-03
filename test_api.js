async function fetchFacilityEntities() {
    try {
        const response = await fetch(`http://localhost:8001/api-proxy/apps/6985f22c3c8f22b3fb4a56dd/entities/Facility`, {
            headers: {
                'api_key': '4872e004cafc4b86a092e1d48b466f84',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log("Fetch Results:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

fetchFacilityEntities();
