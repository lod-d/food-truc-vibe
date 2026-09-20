import { onScopeDispose, ref, watch } from 'vue';

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

// Délai d'attente avant de lancer une requête, le temps que l'utilisateur
// finisse de déplacer la carte ou de taper.
const DEBOUNCE_MS = 300;

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

    // Requêtes en vol. Une nouvelle recherche annule la précédente ainsi que
    // toute pagination en cours, dont les résultats porteraient sur des filtres
    // qui n'ont plus cours.
    let pending: AbortController | null = null;
    let pendingMore: AbortController | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const isAbort = (e: unknown): boolean =>
        e instanceof Error && e.name === 'AbortError';

    const fetch = async (): Promise<void> => {
        // Pas d'appel réseau au rendu serveur : window n'y existe pas.
        if (typeof window === 'undefined') {
            return;
        }

        pending?.abort();

        if (pendingMore) {
            // Le `finally` de loadMore ne rendra pas la main : son contrôleur
            // n'est déjà plus le courant. On éteint le spinner ici.
            pendingMore.abort();
            pendingMore = null;
            loadingMore.value = false;
        }

        const controller = new AbortController();
        pending = controller;

        loading.value = true;
        currentPage.value = 1;

        try {
            const res = await window.fetch(`/api/trucks?${buildParams(1)}`, {
                headers: { Accept: 'application/json' },
                signal: controller.signal,
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
            if (isAbort(e)) {
                return;
            }

            console.error('[useTrucks] fetch error:', e);
        } finally {
            // Une requête plus récente a pris la main : elle gère loading.
            if (pending === controller) {
                pending = null;
                loading.value = false;
            }
        }
    };

    // Regroupe les rafales de changements de filtres (pan de carte, frappe au
    // clavier) en un seul appel.
    const scheduleFetch = (): void => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            fetch();
        }, DEBOUNCE_MS);
    };

    const loadMore = async (): Promise<void> => {
        if (loadingMore.value || !hasMore.value) {
            return;
        }

        const controller = new AbortController();
        pendingMore = controller;

        loadingMore.value = true;
        const nextPage = currentPage.value + 1;

        try {
            const res = await window.fetch(
                `/api/trucks?${buildParams(nextPage)}`,
                {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
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
            if (isAbort(e)) {
                return;
            }

            console.error('[useTrucks] loadMore error:', e);
        } finally {
            if (pendingMore === controller) {
                pendingMore = null;
                loadingMore.value = false;
            }
        }
    };

    watch(
        filters,
        (newVal) => {
            if (!hasLocation.value && (newVal.bounds || newVal.lat != null)) {
                hasLocation.value = true;
            }

            scheduleFetch();
        },
        { deep: true },
    );

    fetch();

    onScopeDispose(() => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        pending?.abort();
        pendingMore?.abort();
    });

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
