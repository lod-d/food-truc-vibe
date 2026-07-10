<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed, nextTick, ref, watch } from 'vue';
import MapView from '../Components/Map/MapView.vue';
import SearchBar from '../Components/Map/SearchBar.vue';
import TruckPopup from '../Components/Map/TruckPopup.vue';
import AppBadge from '../Components/ui/AppBadge.vue';
import AppCard from '../Components/ui/AppCard.vue';
import { useGeocoding } from '../Composables/useGeocoding';
import { useTrucks } from '../Composables/useTrucks';
import AppLayout from '../Layouts/AppLayout.vue';

const page = usePage<{ cuisines: any[]; flash: { success?: string } }>();

const {
    trucks,
    filters,
    loading,
    loadingMore,
    hasMore,
    noResultsInBounds,
    loadMore,
    today,
    hasLocation,
} = useTrucks();
const { search: geocodeSearch } = useGeocoding();

// Tomorrow string computed from today
const tomorrowStr = (() => {
    const d = new Date(today + 'T12:00:00');
    d.setDate(d.getDate() + 1);

    return d.toISOString().slice(0, 10);
})();

const selectedDate = ref(today);
const showCustomDatePicker = ref(false);

const isToday = computed(() => selectedDate.value === today);
const isTomorrow = computed(() => selectedDate.value === tomorrowStr);
const isCustomDate = computed(() => !isToday.value && !isTomorrow.value);

watch(selectedDate, (val) => {
    filters.value.date = val === today ? null : val;

    if (val !== today) {
        filters.value.openNow = false;
    }
});

const selectToday = () => {
    selectedDate.value = today;
    showCustomDatePicker.value = false;
};
const selectTomorrow = () => {
    selectedDate.value = tomorrowStr;
    showCustomDatePicker.value = false;
};
const selectCustom = () => {
    showCustomDatePicker.value = true;
};

// Selected truck
const selectedTruck = ref<any | null>(null);
const selectedLocation = ref<any | null>(null);
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null);
const listContainerRef = ref<HTMLElement | null>(null);
const mobileListRef = ref<HTMLElement | null>(null);

const scrollToCard = (truckId: string) => {
    nextTick(() => {
        const desktopEl = listContainerRef.value?.querySelector(
            `[data-truck-id="${truckId}"]`,
        );
        desktopEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const mobileEl = mobileListRef.value?.querySelector(
            `[data-truck-id="${truckId}"]`,
        );
        mobileEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
};

const onTruckSelected = (truck: any, location: any) => {
    selectedTruck.value = truck;
    selectedLocation.value = location;
    scrollToCard(truck.id);
    mapViewRef.value?.flyTo(location.latitude, location.longitude);
};

const onCardClick = (truck: any, location: any) => {
    selectedTruck.value = truck;
    selectedLocation.value = location;
    mapViewRef.value?.flyTo(location.latitude, location.longitude);
};

const formatTime = (t: string) => t.slice(0, 5);

// Search (truck name)
const searchQuery = ref('');
let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, (val) => {
    if (searchTimer) {
        clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(() => {
        filters.value.name = val || null;
    }, 300);
});

// City search
const cityQuery = ref('');
const cityResults = ref<any[]>([]);
const showCityDropdown = ref(false);
const selectedCityName = ref<string | null>(null);
let cityTimer: ReturnType<typeof setTimeout> | null = null;

watch(cityQuery, (val) => {
    if (cityTimer) {
        clearTimeout(cityTimer);
    }

    if (!val || val.length < 3) {
        cityResults.value = [];
        showCityDropdown.value = false;

        return;
    }

    cityTimer = setTimeout(async () => {
        cityResults.value = await geocodeSearch(val);
        showCityDropdown.value = cityResults.value.length > 0;
    }, 350);
});

const zoomForRadius: Record<number, number> = {
    10: 12,
    25: 11,
    50: 10,
    100: 9,
};

const onCitySelect = (result: any) => {
    selectedCityName.value =
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.address?.county ||
        result.display_name.split(',')[0];
    cityQuery.value = '';
    cityResults.value = [];
    showCityDropdown.value = false;
    hasLocation.value = true;
    mapViewRef.value?.flyTo(
        parseFloat(result.lat),
        parseFloat(result.lon),
        zoomForRadius[filters.value.radius] ?? 11,
    );
};

const clearCityFilter = () => {
    selectedCityName.value = null;
};

const onBoundsChanged = (bounds: any) => {
    filters.value.bounds = bounds;
};

// Geolocation
const locating = ref(false);
const located = ref(false);
const locateError = ref<string | null>(null);
const userCoords = ref<{ lat: number; lng: number; accuracy: number } | null>(
    null,
);
let errorTimer: ReturnType<typeof setTimeout> | null = null;

const setLocateError = (msg: string) => {
    if (errorTimer) {
        clearTimeout(errorTimer);
    }

    locateError.value = msg;
    errorTimer = setTimeout(() => {
        locateError.value = null;
    }, 5000);
};

const onLocateMe = () => {
    if (!navigator.geolocation) {
        setLocateError('Géolocalisation non supportée par votre navigateur');

        return;
    }

    locating.value = true;
    locateError.value = null;
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            locating.value = false;
            located.value = true;
            userCoords.value = {
                lat: coords.latitude,
                lng: coords.longitude,
                accuracy: coords.accuracy,
            };

            selectedCityName.value = null;
            hasLocation.value = true;

            mapViewRef.value?.flyTo(coords.latitude, coords.longitude, 13);
            mapViewRef.value?.showUserLocation(
                coords.latitude,
                coords.longitude,
                coords.accuracy,
            );
        },
        (err) => {
            locating.value = false;
            const msg =
                err.code === 1
                    ? 'Permission refusée. Vérifiez les paramètres de votre navigateur.'
                    : err.code === 3
                      ? "Délai d'attente dépassé. Réessayez."
                      : 'Position non disponible. Réessayez.';
            setLocateError(msg);
        },
        { timeout: 8000, enableHighAccuracy: false },
    );
};

const onRecenter = () => {
    if (!userCoords.value) {
        return;
    }

    mapViewRef.value?.flyTo(userCoords.value.lat, userCoords.value.lng, 13);
};

const onForgetLocation = () => {
    located.value = false;
    userCoords.value = null;
    mapViewRef.value?.removeUserLocation();
};

// Mobile filter modal
const showFilterModal = ref(false);

const activeFiltersCount = computed(() => {
    let n = 0;

    if (filters.value.cuisine) {
        n++;
    }

    if (filters.value.openNow) {
        n++;
    }

    if (!isToday.value) {
        n++;
    }

    if (selectedCityName.value) {
        n++;
    }

    return n;
});
</script>

<template>
    <AppLayout>
        <!-- Flash — top desktop, au-dessus du bottom sheet mobile -->
        <div
            v-if="page.props.flash?.success"
            class="fixed top-16 bottom-auto left-1/2 z-50 w-full max-w-xs -translate-x-1/2 rounded-lg border border-open-600 bg-open-50 px-5 py-3 text-center text-sm text-open-600 shadow md:top-16"
        >
            {{ page.props.flash.success }}
        </div>

        <!-- Barre de recherche mobile — input direct + bouton filtres -->
        <div
            v-if="!showFilterModal"
            class="fixed top-16 right-3 left-3 z-1100 flex items-center gap-2 md:hidden"
        >
            <!-- Input recherche -->
            <div
                class="flex flex-1 items-center rounded-full border border-warm-200 bg-white pr-2 pl-4 shadow-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="shrink-0 text-warm-500"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher un truck…"
                    class="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-warm-900 placeholder:text-warm-500 focus:outline-none"
                />
                <button
                    v-if="searchQuery"
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-warm-500 hover:bg-warm-50 hover:text-warm-900"
                    aria-label="Effacer la recherche"
                    @click="searchQuery = ''"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <!-- Bouton filtres -->
            <button
                class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-warm-200 bg-white shadow-lg transition-colors hover:bg-warm-50"
                aria-label="Filtres"
                @click="showFilterModal = true"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-warm-900"
                >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="14" y2="12" />
                    <line x1="4" y1="18" x2="10" y2="18" />
                </svg>
                <span
                    v-if="activeFiltersCount > 0"
                    class="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-coral-400 px-1.5 text-[10px] font-medium text-white"
                >
                    {{ activeFiltersCount }}
                </span>
            </button>
        </div>

        <!-- Layout desktop : panel gauche | carte -->
        <div class="flex h-[calc(100vh-56px)]">
            <!-- Panel gauche (desktop) -->
            <div
                class="hidden w-80 shrink-0 flex-col overflow-hidden border-r border-warm-200 bg-white md:flex lg:w-96"
            >
                <!-- État vide : aucune localisation choisie -->
                <div
                    v-if="!hasLocation"
                    class="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center"
                >
                    <div
                        class="flex h-16 w-16 items-center justify-center rounded-full bg-coral-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-coral-400"
                        >
                            <path
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                            />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <div>
                        <p class="mb-1 text-sm font-medium text-warm-900">
                            Où cherchez-vous ?
                        </p>
                        <p class="text-xs text-warm-500">
                            Utilisez la carte ci-contre pour choisir une ville
                            ou activer votre localisation.
                        </p>
                    </div>
                    <div
                        class="mt-2 flex items-center gap-2 text-xs text-coral-400"
                    >
                        <span>Commencez sur la carte</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </div>
                </div>

                <!-- État localisé : badge + filtres + liste -->
                <template v-else>
                    <!-- Filters header -->
                    <div
                        class="shrink-0 space-y-3 border-b border-warm-200 px-4 pt-4 pb-3"
                    >
                        <!-- Badge zone active -->
                        <div
                            class="flex items-center gap-2 rounded-md border border-coral-400 bg-coral-50 px-3 py-2.5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="shrink-0 text-coral-400"
                            >
                                <path
                                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span
                                class="flex-1 truncate text-sm text-warm-900"
                                >{{
                                    selectedCityName ||
                                    (located
                                        ? 'Ma position'
                                        : 'Zone sélectionnée')
                                }}</span
                            >
                            <button
                                class="text-warm-400 flex h-6 w-6 items-center justify-center text-sm leading-none hover:text-warm-900"
                                aria-label="Changer de zone"
                                @click="
                                    located
                                        ? onForgetLocation()
                                        : clearCityFilter()
                                "
                            >
                                ✕
                            </button>
                        </div>

                        <!-- Count + reset -->
                        <div class="flex items-center justify-between">
                            <p class="text-xs text-warm-500">
                                <span
                                    class="text-sm font-medium text-warm-900"
                                    >{{ trucks.length }}</span
                                >
                                {{
                                    trucks.length > 1
                                        ? ' trucks trouvés'
                                        : ' truck trouvé'
                                }}
                            </p>
                            <button
                                v-if="isCustomDate"
                                class="text-xs text-coral-400 transition-colors hover:text-coral-600"
                                @click="selectToday"
                            >
                                Revenir à aujourd'hui
                            </button>
                        </div>

                        <!-- Search -->
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Rechercher un truck…"
                            class="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-900 placeholder:text-warm-500 focus:border-coral-400 focus:outline-none"
                        />

                        <!-- Radius (affiché seulement si une ville est sélectionnée) -->
                        <div
                            v-if="selectedCityName"
                            class="flex overflow-hidden rounded-lg border border-warm-200 text-xs"
                        >
                            <button
                                v-for="km in [10, 25, 50, 100]"
                                :key="km"
                                class="flex-1 border-r border-warm-200 px-2 py-3 transition-colors last:border-0"
                                :class="
                                    filters.radius === km
                                        ? 'bg-coral-400 text-white'
                                        : 'text-warm-900 hover:bg-warm-50'
                                "
                                @click="
                                    filters.radius = km;
                                    mapViewRef?.flyTo(
                                        filters.lat,
                                        filters.lng,
                                        zoomForRadius[km] ?? 11,
                                    );
                                "
                            >
                                {{ km }} km
                            </button>
                        </div>

                        <!-- Date buttons -->
                        <div
                            class="flex overflow-hidden rounded-lg border border-warm-200 text-xs"
                        >
                            <button
                                class="flex-1 border-r border-warm-200 px-3 py-3 transition-colors duration-100"
                                :class="
                                    isToday
                                        ? 'bg-coral-400 text-white'
                                        : 'text-warm-900 hover:bg-warm-50'
                                "
                                @click="selectToday"
                            >
                                Aujourd'hui
                            </button>
                            <button
                                class="flex-1 border-r border-warm-200 px-3 py-3 transition-colors duration-100"
                                :class="
                                    isTomorrow
                                        ? 'bg-coral-400 text-white'
                                        : 'text-warm-900 hover:bg-warm-50'
                                "
                                @click="selectTomorrow"
                            >
                                Demain
                            </button>
                            <button
                                class="flex-1 px-3 py-3 transition-colors duration-100"
                                :class="
                                    isCustomDate
                                        ? 'bg-coral-400 text-white'
                                        : 'text-warm-900 hover:bg-warm-50'
                                "
                                @click="selectCustom"
                            >
                                Autre date
                            </button>
                        </div>
                        <input
                            v-if="showCustomDatePicker || isCustomDate"
                            v-model="selectedDate"
                            type="date"
                            :min="today"
                            class="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-900 focus:border-coral-400 focus:outline-none"
                            @change="showCustomDatePicker = false"
                        />

                        <!-- Open now toggle -->
                        <label
                            class="flex items-center gap-2.5"
                            :class="
                                isToday
                                    ? 'cursor-pointer'
                                    : 'cursor-not-allowed opacity-40'
                            "
                        >
                            <div
                                class="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150"
                                :class="
                                    filters.openNow
                                        ? 'bg-open-600'
                                        : 'bg-warm-200'
                                "
                                @click="
                                    isToday &&
                                    (filters.openNow = !filters.openNow)
                                "
                            >
                                <div
                                    class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150"
                                    :class="
                                        filters.openNow ? 'translate-x-4' : ''
                                    "
                                />
                            </div>
                            <span class="text-xs text-warm-900">{{
                                isToday
                                    ? 'Ouverts maintenant'
                                    : 'Ouverts ce jour-là'
                            }}</span>
                        </label>
                    </div>

                    <!-- Cuisine chips -->
                    <div class="shrink-0 border-b border-warm-200 px-4 py-3">
                        <SearchBar
                            :cuisines="page.props.cuisines"
                            :selected-cuisine="filters.cuisine"
                            @update:selected-cuisine="filters.cuisine = $event"
                        />
                    </div>

                    <!-- Truck list -->
                    <div
                        ref="listContainerRef"
                        class="flex-1 space-y-2 overflow-y-auto p-3"
                    >
                        <div
                            v-if="!hasLocation"
                            class="flex h-full flex-col items-center justify-center gap-2 px-4 py-8 text-center"
                        >
                            <p class="text-xs font-medium text-warm-900">
                                Où cherchez-vous ?
                            </p>
                            <p class="text-xs text-warm-500">
                                Entrez une ville ci-dessus ou activez la
                                localisation sur la carte.
                            </p>
                        </div>
                        <p
                            v-else-if="loading"
                            class="py-8 text-center text-xs text-warm-500"
                        >
                            Chargement…
                        </p>
                        <div
                            v-else-if="noResultsInBounds"
                            class="px-2 py-8 text-center"
                        >
                            <p class="text-xs text-warm-500">
                                Aucun truck dans cette zone.
                            </p>
                            <p class="text-warm-400 mt-1 text-xs">
                                Déplacez la carte pour en trouver.
                            </p>
                        </div>
                        <p
                            v-else-if="trucks.length === 0"
                            class="py-8 text-center text-xs text-warm-500"
                        >
                            Aucun truck trouvé.
                        </p>
                        <button
                            v-for="truck in trucks"
                            :key="truck.id"
                            :data-truck-id="truck.id"
                            class="w-full text-left"
                            @click="onCardClick(truck, truck.locations[0])"
                        >
                            <AppCard
                                :class="
                                    selectedTruck?.id === truck.id
                                        ? 'border-coral-400 ring-1 ring-coral-400'
                                        : ''
                                "
                                class="hover:border-coral-200 transition-all duration-100"
                            >
                                <div class="flex items-start gap-3">
                                    <!-- Photo ou emoji -->
                                    <div
                                        class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-coral-50"
                                    >
                                        <img
                                            v-if="truck.photo_url"
                                            :src="truck.photo_url"
                                            :alt="truck.name"
                                            class="h-full w-full object-cover"
                                        />
                                        <span
                                            v-else
                                            class="text-3xl leading-none"
                                            >{{ truck.cuisine.emoji }}</span
                                        >
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div
                                            class="mb-0.5 flex items-start justify-between gap-1"
                                        >
                                            <h3
                                                class="truncate text-sm font-medium text-warm-900"
                                            >
                                                {{ truck.name }}
                                            </h3>
                                            <AppBadge
                                                v-if="
                                                    truck.locations[0]
                                                        ?.is_open_now
                                                "
                                                variant="open"
                                                class="ml-1 shrink-0"
                                            >
                                                jusqu'à
                                                {{
                                                    formatTime(
                                                        truck.locations[0]
                                                            .todays_schedule
                                                            .closes_at,
                                                    )
                                                }}
                                            </AppBadge>
                                            <AppBadge
                                                v-else-if="
                                                    truck.locations[0]
                                                        ?.is_open_today
                                                "
                                                variant="closed"
                                                class="ml-1 shrink-0"
                                            >
                                                {{
                                                    formatTime(
                                                        truck.locations[0]
                                                            .todays_schedule
                                                            .opens_at,
                                                    )
                                                }}–{{
                                                    formatTime(
                                                        truck.locations[0]
                                                            .todays_schedule
                                                            .closes_at,
                                                    )
                                                }}
                                            </AppBadge>
                                            <AppBadge
                                                v-else
                                                variant="closed"
                                                class="ml-1 shrink-0"
                                                >Fermé</AppBadge
                                            >
                                        </div>
                                        <p
                                            class="truncate text-xs text-warm-500"
                                        >
                                            {{
                                                truck.locations[0]
                                                    ?.place_name ||
                                                truck.locations[0]?.address
                                            }}
                                        </p>
                                        <p
                                            class="text-warm-400 truncate text-xs"
                                        >
                                            {{ truck.locations[0]?.city }}
                                        </p>
                                    </div>
                                </div>
                            </AppCard>
                        </button>
                        <button
                            v-if="hasMore"
                            class="w-full py-4 text-sm text-warm-500 transition-colors hover:text-warm-900"
                            :disabled="loadingMore"
                            @click="loadMore"
                        >
                            {{ loadingMore ? 'Chargement…' : 'Charger plus' }}
                        </button>
                    </div>
                </template>
            </div>

            <!-- Carte -->
            <div class="relative flex-1">
                <MapView
                    ref="mapViewRef"
                    :trucks="trucks"
                    class="h-full w-full"
                    @truck-selected="onTruckSelected"
                    @bounds-changed="onBoundsChanged($event)"
                />

                <!-- Invite état vide — overlay centré sur la carte -->
                <div
                    v-if="!hasLocation"
                    class="pointer-events-none absolute inset-0 z-500 flex items-center justify-center px-4"
                >
                    <div
                        class="pointer-events-auto w-full max-w-sm rounded-2xl border border-warm-200 bg-white px-6 py-6 shadow-xl"
                    >
                        <p
                            class="mb-1 text-center text-base font-medium text-warm-900"
                        >
                            Où cherchez-vous ?
                        </p>
                        <p class="mb-5 text-center text-xs text-warm-500">
                            Choisissez une option
                        </p>

                        <!-- Option 1 : recherche de ville -->
                        <div class="relative mb-3">
                            <div
                                class="flex items-center rounded-md border border-warm-200 bg-warm-50 px-3 focus-within:border-coral-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="shrink-0 text-warm-500"
                                >
                                    <path
                                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                                    />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <input
                                    v-model="cityQuery"
                                    type="text"
                                    placeholder="Ville ou code postal…"
                                    class="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-warm-900 placeholder:text-warm-500 focus:outline-none"
                                />
                            </div>
                            <div
                                v-if="showCityDropdown"
                                class="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-hidden overflow-y-auto rounded-lg border border-warm-200 bg-white shadow-lg"
                            >
                                <button
                                    v-for="r in cityResults"
                                    :key="r.place_id"
                                    class="border-warm-100 w-full border-b px-3 py-3 text-left text-sm text-warm-900 last:border-0 hover:bg-warm-50"
                                    @click="onCitySelect(r)"
                                >
                                    {{
                                        r.address?.city ||
                                        r.address?.town ||
                                        r.address?.village ||
                                        r.address?.county
                                    }}
                                    <span class="text-warm-400 ml-1">{{
                                        r.address?.state
                                    }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Séparateur -->
                        <div class="my-4 flex items-center gap-3">
                            <div class="h-px flex-1 bg-warm-200" />
                            <span
                                class="text-xs tracking-wider text-warm-500 uppercase"
                                >ou</span
                            >
                            <div class="h-px flex-1 bg-warm-200" />
                        </div>

                        <!-- Option 2 : géolocalisation -->
                        <button
                            class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral-400 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-600 disabled:opacity-50"
                            :disabled="locating"
                            @click="onLocateMe"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                            </svg>
                            {{
                                locating
                                    ? 'Localisation…'
                                    : 'Me localiser (25 km autour)'
                            }}
                        </button>

                        <p
                            v-if="locateError"
                            class="mt-3 text-center text-xs text-red-500"
                        >
                            {{ locateError }}
                        </p>
                    </div>
                </div>

                <!-- Bouton géolocalisation — overlay top-left (mobile: sous la pill) -->
                <button
                    v-if="!located"
                    class="absolute top-20 left-3 z-1000 flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-4 py-2.5 text-xs font-medium text-warm-900 shadow-md transition-opacity hover:bg-warm-50 disabled:opacity-50 md:top-4 md:left-4"
                    :disabled="locating"
                    @click="onLocateMe"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                    {{ locating ? 'Localisation…' : 'Me localiser' }}
                </button>

                <!-- Recentrer + oublier (quand localisé) -->
                <div
                    v-else
                    class="absolute top-20 left-3 z-1000 flex items-center gap-2 md:top-4 md:left-4"
                >
                    <button
                        class="flex items-center gap-1.5 rounded-full border border-warm-200 bg-white px-4 py-2.5 text-xs font-medium text-warm-900 shadow-md transition-colors hover:bg-warm-50"
                        @click="onRecenter"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                        </svg>
                        Recentrer
                    </button>
                    <button
                        class="flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 bg-white text-sm text-warm-500 shadow-md transition-colors hover:bg-warm-50 hover:text-warm-900"
                        title="Oublier ma position"
                        @click="onForgetLocation"
                    >
                        ✕
                    </button>
                </div>

                <!-- Erreur géolocalisation -->
                <div
                    v-if="locateError"
                    class="absolute top-32 right-3 left-3 z-1000 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-red-600 shadow md:top-14 md:right-auto md:left-4"
                >
                    {{ locateError }}
                </div>

                <!-- Popup sélection mobile -->
                <div
                    v-if="selectedTruck && selectedLocation"
                    class="absolute right-2 bottom-6 left-2 z-1000 rounded-xl border border-warm-200 bg-white shadow-lg md:hidden"
                >
                    <TruckPopup
                        :truck="selectedTruck"
                        :location="selectedLocation"
                    />
                    <button
                        class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-warm-50 text-xs text-warm-500 hover:text-warm-900"
                        @click="selectedTruck = null"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>

        <!-- Bottom sheet mobile (liste uniquement, filtres dans la modale) -->
        <div
            class="fixed right-0 bottom-0 left-0 z-40 rounded-t-2xl border-t border-warm-200 bg-white shadow-lg md:hidden"
            style="max-height: 50vh; overflow-y: auto"
        >
            <!-- Handle + count -->
            <div
                class="sticky top-0 z-10 flex flex-col items-center border-b border-warm-200 bg-white pt-2 pb-1"
            >
                <div class="mb-2 h-1 w-8 rounded-full bg-warm-200" />
                <p class="pb-1 text-xs text-warm-500">
                    <template v-if="hasLocation">
                        <span class="font-medium text-warm-900">{{
                            trucks.length
                        }}</span>
                        {{ trucks.length > 1 ? ' trucks' : ' truck' }}
                    </template>
                    <span v-else class="text-warm-400"
                        >Aucune zone sélectionnée</span
                    >
                </p>
            </div>

            <!-- Truck list mobile -->
            <div ref="mobileListRef" class="space-y-2 px-3 pb-4">
                <div v-if="!hasLocation" class="px-2 py-6 text-center">
                    <p class="mb-1 text-xs font-medium text-warm-900">
                        Où cherchez-vous ?
                    </p>
                    <p class="text-xs text-warm-500">
                        Entrez une ville ci-dessus ou activez la localisation.
                    </p>
                </div>
                <p
                    v-else-if="loading"
                    class="py-4 text-center text-xs text-warm-500"
                >
                    Chargement…
                </p>
                <div v-else-if="noResultsInBounds" class="py-4 text-center">
                    <p class="text-xs text-warm-500">
                        Aucun truck dans cette zone.
                    </p>
                    <p class="text-warm-400 mt-0.5 text-xs">
                        Déplacez la carte pour en trouver.
                    </p>
                </div>
                <p
                    v-else-if="trucks.length === 0"
                    class="py-4 text-center text-xs text-warm-500"
                >
                    Aucun truck trouvé.
                </p>
                <button
                    v-for="truck in trucks"
                    :key="truck.id"
                    :data-truck-id="truck.id"
                    class="w-full text-left"
                    @click="onCardClick(truck, truck.locations[0])"
                >
                    <AppCard
                        class="hover:border-coral-200 transition-colors duration-100"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-coral-50"
                            >
                                <img
                                    v-if="truck.photo_url"
                                    :src="truck.photo_url"
                                    :alt="truck.name"
                                    class="h-full w-full object-cover"
                                />
                                <span v-else class="text-2xl leading-none">{{
                                    truck.cuisine.emoji
                                }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="truncate text-sm font-medium text-warm-900"
                                >
                                    {{ truck.name }}
                                </p>
                                <p class="truncate text-xs text-warm-500">
                                    {{ truck.locations[0]?.city }}
                                </p>
                            </div>
                            <div class="shrink-0">
                                <AppBadge
                                    v-if="truck.locations[0]?.is_open_now"
                                    variant="open"
                                    >Ouvert</AppBadge
                                >
                                <AppBadge
                                    v-else-if="
                                        truck.locations[0]?.is_open_today
                                    "
                                    variant="closed"
                                >
                                    {{
                                        formatTime(
                                            truck.locations[0].todays_schedule
                                                .opens_at,
                                        )
                                    }}–{{
                                        formatTime(
                                            truck.locations[0].todays_schedule
                                                .closes_at,
                                        )
                                    }}
                                </AppBadge>
                                <AppBadge v-else variant="closed"
                                    >Fermé</AppBadge
                                >
                            </div>
                        </div>
                    </AppCard>
                </button>
                <button
                    v-if="hasMore"
                    class="w-full py-4 text-sm text-warm-500 transition-colors hover:text-warm-900"
                    :disabled="loadingMore"
                    @click="loadMore"
                >
                    {{ loadingMore ? 'Chargement…' : 'Charger plus' }}
                </button>
            </div>
        </div>

        <!-- Modale recherche/filtres mobile -->
        <div
            v-if="showFilterModal"
            class="fixed inset-0 z-1200 flex flex-col bg-white md:hidden"
        >
            <!-- Header -->
            <header
                class="flex shrink-0 items-center justify-between border-b border-warm-200 px-4 py-3"
            >
                <h2 class="text-base font-medium text-warm-900">Rechercher</h2>
                <button
                    class="flex h-10 w-10 items-center justify-center rounded-full text-warm-500 transition-colors hover:bg-warm-50 hover:text-warm-900"
                    aria-label="Fermer"
                    @click="showFilterModal = false"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </header>

            <!-- Filtres scrollables -->
            <div class="flex-1 space-y-5 overflow-y-auto px-4 py-4">
                <!-- City search -->
                <div>
                    <label class="mb-1.5 block text-xs text-warm-500"
                        >Ville</label
                    >
                    <div class="relative">
                        <div
                            v-if="selectedCityName"
                            class="flex items-center gap-2 rounded-md border border-coral-400 bg-coral-50 px-3 py-3"
                        >
                            <span class="flex-1 truncate text-sm text-warm-900"
                                >📍 {{ selectedCityName }}</span
                            >
                            <button
                                class="text-warm-400 flex h-6 w-6 items-center justify-center text-sm leading-none hover:text-warm-900"
                                @click="clearCityFilter"
                            >
                                ✕
                            </button>
                        </div>
                        <input
                            v-else
                            v-model="cityQuery"
                            type="text"
                            placeholder="Ville ou code postal…"
                            class="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-900 placeholder:text-warm-500 focus:border-coral-400 focus:outline-none"
                        />
                        <div
                            v-if="showCityDropdown"
                            class="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-warm-200 bg-white shadow-lg"
                        >
                            <button
                                v-for="r in cityResults"
                                :key="r.place_id"
                                class="border-warm-100 w-full border-b px-3 py-3 text-left text-sm text-warm-900 last:border-0 hover:bg-warm-50"
                                @click="onCitySelect(r)"
                            >
                                {{
                                    r.address?.city ||
                                    r.address?.town ||
                                    r.address?.village ||
                                    r.address?.county
                                }}
                                <span class="text-warm-400 ml-1">{{
                                    r.address?.state
                                }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Radius (si ville sélectionnée) -->
                <div v-if="selectedCityName">
                    <label class="mb-1.5 block text-xs text-warm-500"
                        >Rayon</label
                    >
                    <div
                        class="flex overflow-hidden rounded-lg border border-warm-200 text-sm"
                    >
                        <button
                            v-for="km in [10, 25, 50, 100]"
                            :key="km"
                            class="flex-1 border-r border-warm-200 px-2 py-3 transition-colors last:border-0"
                            :class="
                                filters.radius === km
                                    ? 'bg-coral-400 text-white'
                                    : 'text-warm-900 hover:bg-warm-50'
                            "
                            @click="
                                filters.radius = km;
                                mapViewRef?.flyTo(
                                    filters.lat,
                                    filters.lng,
                                    zoomForRadius[km] ?? 11,
                                );
                            "
                        >
                            {{ km }} km
                        </button>
                    </div>
                </div>

                <!-- Date -->
                <div>
                    <label class="mb-1.5 block text-xs text-warm-500"
                        >Date</label
                    >
                    <div
                        class="flex overflow-hidden rounded-lg border border-warm-200 text-sm"
                    >
                        <button
                            class="flex-1 border-r border-warm-200 px-2 py-3 transition-colors"
                            :class="
                                isToday
                                    ? 'bg-coral-400 text-white'
                                    : 'text-warm-900 hover:bg-warm-50'
                            "
                            @click="selectToday"
                        >
                            Aujourd'hui
                        </button>
                        <button
                            class="flex-1 border-r border-warm-200 px-2 py-3 transition-colors"
                            :class="
                                isTomorrow
                                    ? 'bg-coral-400 text-white'
                                    : 'text-warm-900 hover:bg-warm-50'
                            "
                            @click="selectTomorrow"
                        >
                            Demain
                        </button>
                        <button
                            class="flex-1 px-2 py-3 transition-colors"
                            :class="
                                isCustomDate
                                    ? 'bg-coral-400 text-white'
                                    : 'text-warm-900 hover:bg-warm-50'
                            "
                            @click="selectCustom"
                        >
                            Autre
                        </button>
                    </div>
                    <input
                        v-if="showCustomDatePicker || isCustomDate"
                        v-model="selectedDate"
                        type="date"
                        :min="today"
                        class="mt-2 w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-900 focus:border-coral-400 focus:outline-none"
                        @change="showCustomDatePicker = false"
                    />
                </div>

                <!-- Open now toggle -->
                <label
                    class="flex items-center justify-between gap-3 py-2"
                    :class="
                        isToday
                            ? 'cursor-pointer'
                            : 'cursor-not-allowed opacity-40'
                    "
                >
                    <span class="text-sm text-warm-900">{{
                        isToday ? 'Ouverts maintenant' : 'Ouverts ce jour-là'
                    }}</span>
                    <div
                        class="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150"
                        :class="filters.openNow ? 'bg-open-600' : 'bg-warm-200'"
                        @click="isToday && (filters.openNow = !filters.openNow)"
                    >
                        <div
                            class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-150"
                            :class="filters.openNow ? 'translate-x-5' : ''"
                        />
                    </div>
                </label>

                <!-- Cuisine chips -->
                <div>
                    <label class="mb-1.5 block text-xs text-warm-500"
                        >Type de cuisine</label
                    >
                    <SearchBar
                        :cuisines="page.props.cuisines"
                        :selected-cuisine="filters.cuisine"
                        @update:selected-cuisine="filters.cuisine = $event"
                    />
                </div>
            </div>

            <!-- Footer -->
            <footer
                class="flex shrink-0 items-center gap-3 border-t border-warm-200 px-4 py-3"
            >
                <button
                    v-if="activeFiltersCount > 0 || searchQuery"
                    class="px-2 py-3 text-sm text-warm-500 transition-colors hover:text-warm-900"
                    @click="
                        searchQuery = '';
                        filters.cuisine = null;
                        filters.openNow = false;
                        selectToday();
                        clearCityFilter();
                    "
                >
                    Réinitialiser
                </button>
                <button
                    class="flex-1 rounded-md bg-coral-400 py-3 text-sm font-medium text-white transition-colors hover:bg-coral-600"
                    @click="showFilterModal = false"
                >
                    Voir les résultats
                    <span v-if="hasLocation" class="opacity-80"
                        >({{ trucks.length }})</span
                    >
                </button>
            </footer>
        </div>
    </AppLayout>
</template>
