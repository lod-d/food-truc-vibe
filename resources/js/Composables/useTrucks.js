import { ref, watch } from 'vue'

export function useTrucks(initialTrucks = []) {
    const trucks = ref(initialTrucks)
    const loading = ref(false)
    const filters = ref({
        cuisine: null,
        openNow: false,
        lat: null,
        lng: null,
    })

    const fetch = async () => {
        loading.value = true

        const params = new URLSearchParams()
        if (filters.value.cuisine) params.set('cuisine', filters.value.cuisine)
        if (filters.value.openNow)  params.set('open_now', '1')
        if (filters.value.lat)      params.set('lat', filters.value.lat)
        if (filters.value.lng)      params.set('lng', filters.value.lng)

        try {
            const res = await window.fetch(`/api/trucks?${params}`)
            const json = await res.json()
            trucks.value = json.data
        } finally {
            loading.value = false
        }
    }

    watch(filters, fetch, { deep: true })

    return { trucks, loading, filters, fetch }
}
