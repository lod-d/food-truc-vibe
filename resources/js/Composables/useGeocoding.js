export function useGeocoding() {
    const search = async (query) => {
        if (!query || query.length < 3) {
return []
}

        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5&addressdetails=1`,
            { headers: { 'Accept-Language': 'fr' } }
        )

        if (!res.ok) {
return []
}

        return res.json()
    }

    return { search }
}
