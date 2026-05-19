import { ref, watch } from 'vue';

export interface Bounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export interface TruckFilters {
    cuisine: string | null;
    openNow: boolean;
    lat: number | null;
    lng: number | null;
    radius: number;
    name: string | null;
    bounds: Bounds | null;
    date: string | null;
}

export function useTrucks(initialTrucks: any[] = []) {
    const trucks = ref<any[]>(initialTrucks);
    const loading = ref(false);
    const loadingMore = ref(false);
    const hasMore = ref(false);
    const currentPage = ref(1);
    const noResultsInBounds = ref(false);

    const hasLocation = ref(false);

    const today = new Date().toISOString().slice(0, 10);

    const filters = ref<TruckFilters>({
        cuisine: null,
        openNow: false,
        lat: null,
        lng: null,
        radius: 25,
        name: null,
        bounds: null,
        date: null,
    });

    const buildParams = (page = 1): URLSearchParams => {
        const params = new URLSearchParams();

        if (filters.value.cuisine) {
            params.set('cuisine', filters.value.cuisine);
        }

        if (filters.value.openNow) {
            params.set('open_now', '1');
        }

        if (filters.value.lat != null && filters.value.lng != null) {
            params.set('lat', String(filters.value.lat));
            params.set('lng', String(filters.value.lng));
            params.set('radius', String(filters.value.radius));
        }

        if (filters.value.name) {
            params.set('name', filters.value.name);
        }

        if (filters.value.bounds) {
            const { minLat, maxLat, minLng, maxLng } = filters.value.bounds;
            params.set('min_lat', String(minLat));
            params.set('max_lat', String(maxLat));
            params.set('min_lng', String(minLng));
            params.set('max_lng', String(maxLng));
        }

        if (filters.value.date) {
            params.set('date', filters.value.date);
        }

        params.set('page', String(page));

        return params;
    };

    const fetch = async (): Promise<void> => {
        loading.value = true;
        currentPage.value = 1;

        try {
            const res = await window.fetch(`/api/trucks?${buildParams(1)}`, {
                headers: { Accept: 'application/json' },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();

            if (json.data.length === 0 && filters.value.bounds) {
                hasMore.value = false;
                noResultsInBounds.value = true;

                return;
            }

            noResultsInBounds.value = false;
            trucks.value = json.data;
            hasMore.value = json.current_page < json.last_page;
        } catch (e) {
            console.error('[useTrucks] fetch error:', e);
        } finally {
            loading.value = false;
        }
    };

    const loadMore = async (): Promise<void> => {
        if (loadingMore.value || !hasMore.value) {
            return;
        }

        loadingMore.value = true;
        const nextPage = currentPage.value + 1;

        try {
            const res = await window.fetch(
                `/api/trucks?${buildParams(nextPage)}`,
                {
                    headers: { Accept: 'application/json' },
                },
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const json = await res.json();
            trucks.value = [...trucks.value, ...json.data];
            currentPage.value = json.current_page;
            hasMore.value = json.current_page < json.last_page;
        } catch (e) {
            console.error('[useTrucks] loadMore error:', e);
        } finally {
            loadingMore.value = false;
        }
    };

    watch(
        filters,
        (newVal) => {
            if (!hasLocation.value) {
                if (!newVal.bounds && newVal.lat == null) {
                    return;
                }

                hasLocation.value = true;
            }

            fetch();
        },
        { deep: true },
    );

    return {
        trucks,
        loading,
        loadingMore,
        hasMore,
        noResultsInBounds,
        filters,
        fetch,
        loadMore,
        today,
        hasLocation,
    };
}
