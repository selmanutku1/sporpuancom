// api.js

const BASE_URL = 'https://app.base44.com';

async function fetchFacilityEntities() {
    try {
        const response = await fetch(`${BASE_URL}/api/apps/6985f22c3c8f22b3fb4a56dd/entities/Facility`, {
            headers: {
                'api_key': '4872e004cafc4b86a092e1d48b466f84',
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log("Fetch Results:\n", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

async function updateFacilityEntity(entityId, updateData) {
    try {
        const response = await fetch(`${BASE_URL}/api/apps/6985f22c3c8f22b3fb4a56dd/entities/Facility/${entityId}`, {
            method: 'PUT',
            headers: {
                'api_key': '4872e004cafc4b86a092e1d48b466f84',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        console.log("Update Results:\n", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Update Error:", error.message);
    }
}

// Executing testing code
fetchFacilityEntities();
