<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import { computed, nextTick, ref, watch } from 'vue'
import MapView from '../Components/Map/MapView.vue'
import SearchBar from '../Components/Map/SearchBar.vue'
import TruckPopup from '../Components/Map/TruckPopup.vue'
import AppBadge from '../Components/ui/AppBadge.vue'
import AppCard from '../Components/ui/AppCard.vue'
import { useGeocoding } from '../Composables/useGeocoding'
import { useTrucks } from '../Composables/useTrucks'
import AppLayout from '../Layouts/AppLayout.vue'

const page = usePage<{ cuisines: any[]; flash: { success?: string } }>()

const { trucks, filters, loading, loadingMore, hasMore, noResultsInBounds, loadMore, today, hasLocation } = useTrucks()
const { search: geocodeSearch } = useGeocoding()

// Tomorrow string computed from today
const tomorrowStr = (() => {
    const d = new Date(today + 'T12:00:00')
    d.setDate(d.getDate() + 1)

    return d.toISOString().slice(0, 10)
})()

const selectedDate = ref(today)
const showCustomDatePicker = ref(false)

const isToday = computed(() => selectedDate.value === today)
const isTomorrow = computed(() => selectedDate.value === tomorrowStr)
const isCustomDate = computed(() => !isToday.value && !isTomorrow.value)

watch(selectedDate, (val) => {
    filters.value.date = val === today ? null : val

    if (val !== today) {
filters.value.openNow = false
}
})

const selectToday = () => {
 selectedDate.value = today; showCustomDatePicker.value = false 
}
const selectTomorrow = () => {
 selectedDate.value = tomorrowStr; showCustomDatePicker.value = false 
}
const selectCustom = () => {
 showCustomDatePicker.value = true 
}

// Selected truck
const selectedTruck = ref<any | null>(null)
const selectedLocation = ref<any | null>(null)
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null)
const listContainerRef = ref<HTMLElement | null>(null)
const mobileListRef = ref<HTMLElement | null>(null)

const scrollToCard = (truckId: string) => {
    nextTick(() => {
        const desktopEl = listContainerRef.value?.querySelector(`[data-truck-id="${truckId}"]`)
        desktopEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        const mobileEl = mobileListRef.value?.querySelector(`[data-truck-id="${truckId}"]`)
        mobileEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
}

const onTruckSelected = (truck: any, location: any) => {
    selectedTruck.value = truck
    selectedLocation.value = location
    scrollToCard(truck.id)
    mapViewRef.value?.flyTo(location.latitude, location.longitude)
}

const onCardClick = (truck: any, location: any) => {
    selectedTruck.value = truck
    selectedLocation.value = location
    mapViewRef.value?.flyTo(location.latitude, location.longitude)
}

const formatTime = (t: string) => t.slice(0, 5)

// Search (truck name)
const searchQuery = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (val) => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => { filters.value.name = val || null }, 300)
})

// City search
const cityQuery = ref('')
const cityResults = ref<any[]>([])
const showCityDropdown = ref(false)
const selectedCityName = ref<string | null>(null)
let cityTimer: ReturnType<typeof setTimeout> | null = null

watch(cityQuery, (val) => {
    if (cityTimer) clearTimeout(cityTimer)
    if (!val || val.length < 3) { cityResults.value = []; showCityDropdown.value = false; return }
    cityTimer = setTimeout(async () => {
        cityResults.value = await geocodeSearch(val)
        showCityDropdown.value = cityResults.value.length > 0
    }, 350)
})

const zoomForRadius: Record<number, number> = { 10: 12, 25: 11, 50: 10, 100: 9 }

const onCitySelect = (result: any) => {
    selectedCityName.value = result.address?.city || result.address?.town || result.address?.village || result.address?.county || result.display_name.split(',')[0]
    cityQuery.value = ''
    cityResults.value = []
    showCityDropdown.value = false
    filters.value.lat = parseFloat(result.lat)
    filters.value.lng = parseFloat(result.lon)
    filters.value.bounds = null
    mapViewRef.value?.flyTo(filters.value.lat, filters.value.lng, zoomForRadius[filters.value.radius] ?? 11)
}

const clearCityFilter = () => {
    selectedCityName.value = null
    filters.value.lat = null
    filters.value.lng = null
    filters.value.radius = 25
}

const onBoundsChanged = (bounds: any) => {
    if (filters.value.lat) return
    filters.value.bounds = bounds
}

// Geolocation
const locating = ref(false)
const locateError = ref<string | null>(null)

const onLocateMe = () => {
    if (!navigator.geolocation) {
 locateError.value = 'Géolocalisation non supportée';

 return 
}

    locating.value = true
    locateError.value = null
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            locating.value = false
            mapViewRef.value?.flyTo(coords.latitude, coords.longitude, 13)
            mapViewRef.value?.showUserLocation(coords.latitude, coords.longitude)
        },
        () => {
 locating.value = false; locateError.value = 'Impossible de vous localiser' 
},
        { timeout: 8000 }
    )
}
</script>

<template>
    <AppLayout>
        <!-- Flash — top desktop, au-dessus du bottom sheet mobile -->
        <div
            v-if="page.props.flash?.success"
            class="fixed left-1/2 -translate-x-1/2 z-50 bg-open-50 text-open-600 border border-open-600 rounded-lg px-5 py-3 text-sm shadow text-center max-w-xs w-full top-16 md:top-16 bottom-auto"
        >
            {{ page.props.flash.success }}
        </div>

        <!-- Layout desktop : panel gauche | carte -->
        <div class="flex h-[calc(100vh-56px)]">

            <!-- Panel gauche (desktop) -->
            <div class="hidden md:flex flex-col w-80 lg:w-96 border-r border-warm-200 bg-white overflow-hidden shrink-0">

                <!-- Filters header -->
                <div class="px-4 pt-4 pb-3 border-b border-warm-200 shrink-0 space-y-3">

                    <!-- Count + reset -->
                    <div class="flex items-center justify-between">
                        <p class="text-xs text-warm-500">
                            <template v-if="hasLocation">
                                <span class="text-sm font-medium text-warm-900">{{ trucks.length }}</span>
                                {{ trucks.length > 1 ? ' trucks trouvés' : ' truck trouvé' }}
                            </template>
                            <span v-else class="text-warm-400">Aucune zone sélectionnée</span>
                        </p>
                        <button
                            v-if="isCustomDate"
                            class="text-xs text-coral-400 hover:text-coral-600 transition-colors"
                            @click="selectToday"
                        >Revenir à aujourd'hui</button>
                    </div>

                    <!-- Search -->
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Rechercher un truck…"
                        class="w-full text-xs rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 placeholder:text-warm-500 focus:outline-none focus:border-coral-400"
                    />

                    <!-- City search -->
                    <div class="relative">
                        <div v-if="selectedCityName" class="flex items-center gap-2 rounded-md border border-coral-400 bg-coral-50 px-3 py-2">
                            <span class="flex-1 text-xs text-warm-900 truncate">📍 {{ selectedCityName }}</span>
                            <button class="text-warm-400 hover:text-warm-900 text-xs leading-none" @click="clearCityFilter">✕</button>
                        </div>
                        <input
                            v-else
                            v-model="cityQuery"
                            type="text"
                            placeholder="Ville ou code postal…"
                            class="w-full text-xs rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 placeholder:text-warm-500 focus:outline-none focus:border-coral-400"
                        />
                        <div
                            v-if="showCityDropdown"
                            class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-warm-200 rounded-lg shadow-lg overflow-hidden"
                        >
                            <button
                                v-for="r in cityResults"
                                :key="r.place_id"
                                class="w-full text-left px-3 py-2 text-xs text-warm-900 hover:bg-warm-50 border-b border-warm-100 last:border-0"
                                @click="onCitySelect(r)"
                            >
                                {{ r.address?.city || r.address?.town || r.address?.village || r.address?.county }}
                                <span class="text-warm-400 ml-1">{{ r.address?.state }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Radius (affiché seulement si une ville est sélectionnée) -->
                    <div v-if="selectedCityName" class="flex rounded-lg border border-warm-200 overflow-hidden text-xs">
                        <button
                            v-for="km in [10, 25, 50, 100]"
                            :key="km"
                            class="flex-1 px-2 py-2 border-r border-warm-200 last:border-0 transition-colors"
                            :class="filters.radius === km ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                            @click="filters.radius = km; mapViewRef.value?.flyTo(filters.lat, filters.lng, zoomForRadius[km] ?? 11)"
                        >{{ km }} km</button>
                    </div>

                    <!-- Date buttons -->
                    <div class="flex rounded-lg border border-warm-200 overflow-hidden text-xs">
                        <button
                            class="flex-1 px-3 py-2 border-r border-warm-200 transition-colors duration-100"
                            :class="isToday ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                            @click="selectToday"
                        >Aujourd'hui</button>
                        <button
                            class="flex-1 px-3 py-2 border-r border-warm-200 transition-colors duration-100"
                            :class="isTomorrow ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                            @click="selectTomorrow"
                        >Demain</button>
                        <button
                            class="flex-1 px-3 py-2 transition-colors duration-100"
                            :class="isCustomDate ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                            @click="selectCustom"
                        >Autre date</button>
                    </div>
                    <input
                        v-if="showCustomDatePicker || isCustomDate"
                        v-model="selectedDate"
                        type="date"
                        :min="today"
                        class="w-full text-xs rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 focus:outline-none focus:border-coral-400"
                        @change="showCustomDatePicker = false"
                    />

                    <!-- Open now toggle -->
                    <label
                        class="flex items-center gap-2.5"
                        :class="isToday ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                    >
                        <div
                            class="relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0"
                            :class="filters.openNow ? 'bg-open-600' : 'bg-warm-200'"
                            @click="isToday && (filters.openNow = !filters.openNow)"
                        >
                            <div
                                class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150"
                                :class="filters.openNow ? 'translate-x-4' : ''"
                            />
                        </div>
                        <span class="text-xs text-warm-900">{{ isToday ? 'Ouverts maintenant' : 'Ouverts ce jour-là' }}</span>
                    </label>
                </div>

                <!-- Cuisine chips -->
                <div class="px-4 py-3 border-b border-warm-200 shrink-0">
                    <SearchBar
                        :cuisines="page.props.cuisines"
                        :selected-cuisine="filters.cuisine"
                        @update:selected-cuisine="filters.cuisine = $event"
                    />
                </div>

                <!-- Truck list -->
                <div ref="listContainerRef" class="flex-1 overflow-y-auto p-3 space-y-2">
                    <div v-if="!hasLocation" class="flex flex-col items-center justify-center h-full py-8 px-4 text-center gap-2">
                        <p class="text-xs font-medium text-warm-900">Où cherchez-vous ?</p>
                        <p class="text-xs text-warm-500">Entrez une ville ci-dessus ou activez la localisation sur la carte.</p>
                    </div>
                    <p v-else-if="loading" class="text-xs text-warm-500 text-center py-8">Chargement…</p>
                    <div v-else-if="noResultsInBounds" class="text-center py-8 px-2">
                        <p class="text-xs text-warm-500">Aucun truck dans cette zone.</p>
                        <p class="text-xs text-warm-400 mt-1">Déplacez la carte pour en trouver.</p>
                    </div>
                    <p v-else-if="trucks.length === 0" class="text-xs text-warm-500 text-center py-8">
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
                            :class="selectedTruck?.id === truck.id ? 'border-coral-400 ring-1 ring-coral-400' : ''"
                            class="transition-all duration-100 hover:border-coral-200"
                        >
                            <div class="flex items-start gap-3">
                                <!-- Photo ou emoji -->
                                <div class="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-coral-50 flex items-center justify-center">
                                    <img
                                        v-if="truck.photo_url"
                                        :src="truck.photo_url"
                                        :alt="truck.name"
                                        class="w-full h-full object-cover"
                                    />
                                    <span v-else class="text-2xl leading-none">{{ truck.cuisine.emoji }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start justify-between gap-1 mb-0.5">
                                        <h3 class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</h3>
                                        <AppBadge
                                            v-if="truck.locations[0]?.is_open_now"
                                            variant="open"
                                            class="shrink-0 ml-1"
                                        >
                                            jusqu'à {{ formatTime(truck.locations[0].todays_schedule.closes_at) }}
                                        </AppBadge>
                                        <AppBadge v-else-if="truck.locations[0]?.is_open_today" variant="closed" class="shrink-0 ml-1">
                                            {{ formatTime(truck.locations[0].todays_schedule.opens_at) }}–{{ formatTime(truck.locations[0].todays_schedule.closes_at) }}
                                        </AppBadge>
                                        <AppBadge v-else variant="closed" class="shrink-0 ml-1">Fermé</AppBadge>
                                    </div>
                                    <p class="text-xs text-warm-500 truncate">
                                        {{ truck.locations[0]?.place_name || truck.locations[0]?.address }}
                                    </p>
                                    <p class="text-xs text-warm-400 truncate">{{ truck.locations[0]?.city }}</p>
                                </div>
                            </div>
                        </AppCard>
                    </button>
                    <button
                        v-if="hasMore"
                        class="w-full text-xs text-warm-500 hover:text-warm-900 py-3 transition-colors"
                        :disabled="loadingMore"
                        @click="loadMore"
                    >
                        {{ loadingMore ? 'Chargement…' : 'Charger plus' }}
                    </button>
                </div>
            </div>

            <!-- Carte -->
            <div class="flex-1 relative">
                <MapView
                    ref="mapViewRef"
                    :trucks="trucks"
                    class="w-full h-full"
                    @truck-selected="onTruckSelected"
                    @bounds-changed="onBoundsChanged($event)"
                />

                <!-- Invite état vide — overlay centré sur la carte -->
                <div
                    v-if="!hasLocation"
                    class="absolute inset-0 flex items-center justify-center z-500 pointer-events-none"
                >
                    <div class="bg-white rounded-2xl shadow-xl border border-warm-200 px-7 py-6 text-center pointer-events-auto max-w-xs">
                        <p class="text-sm font-medium text-warm-900 mb-1">Où cherchez-vous ?</p>
                        <p class="text-xs text-warm-500 mb-4">Entrez une ville dans le panneau<br>ou activez la localisation</p>
                        <button
                            class="inline-flex items-center gap-1.5 bg-coral-400 hover:bg-coral-600 text-white text-xs rounded-full px-4 py-2 transition-colors disabled:opacity-50"
                            :disabled="locating"
                            @click="onLocateMe"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                            </svg>
                            {{ locating ? 'Localisation…' : 'Me localiser' }}
                        </button>
                    </div>
                </div>

                <!-- Bouton géolocalisation — overlay top-left -->
                <button
                    class="absolute top-4 left-4 z-1000 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-warm-900 shadow-md border border-warm-200 hover:bg-warm-50 disabled:opacity-50 transition-opacity"
                    :disabled="locating"
                    @click="onLocateMe"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                    {{ locating ? 'Localisation…' : 'Me localiser' }}
                </button>

                <!-- Erreur géolocalisation -->
                <div
                    v-if="locateError"
                    class="absolute top-14 left-4 z-1000 bg-white text-xs text-red-600 border border-red-200 rounded-lg px-3 py-2 shadow whitespace-nowrap"
                >
                    {{ locateError }}
                </div>

                <!-- Popup sélection mobile -->
                <div
                    v-if="selectedTruck && selectedLocation"
                    class="absolute bottom-6 left-2 right-2 z-1000 bg-white rounded-xl border border-warm-200 shadow-lg md:hidden"
                >
                    <TruckPopup :truck="selectedTruck" :location="selectedLocation" />
                    <button
                        class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-warm-50 text-warm-500 hover:text-warm-900 text-xs"
                        @click="selectedTruck = null"
                    >✕</button>
                </div>
            </div>
        </div>

        <!-- Bottom sheet mobile -->
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl border-t border-warm-200 shadow-lg" style="max-height: 60vh; overflow-y: auto;">

            <!-- Handle + count -->
            <div class="flex flex-col items-center pt-2 pb-1 sticky top-0 bg-white border-b border-warm-200 z-10">
                <div class="w-8 h-1 bg-warm-200 rounded-full mb-2" />
                <p class="text-xs text-warm-500 pb-1">
                    <template v-if="hasLocation">
                        <span class="font-medium text-warm-900">{{ trucks.length }}</span>
                        {{ trucks.length > 1 ? ' trucks' : ' truck' }}
                    </template>
                    <span v-else class="text-warm-400">Aucune zone sélectionnée</span>
                </p>
            </div>

            <div class="px-4 py-3 space-y-3">
                <!-- Search -->
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Rechercher un truck…"
                    class="w-full text-sm rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 placeholder:text-warm-500 focus:outline-none focus:border-coral-400"
                />

                <!-- City search -->
                <div class="relative">
                    <div v-if="selectedCityName" class="flex items-center gap-2 rounded-md border border-coral-400 bg-coral-50 px-3 py-2">
                        <span class="flex-1 text-sm text-warm-900 truncate">📍 {{ selectedCityName }}</span>
                        <button class="text-warm-400 hover:text-warm-900 text-sm leading-none" @click="clearCityFilter">✕</button>
                    </div>
                    <input
                        v-else
                        v-model="cityQuery"
                        type="text"
                        placeholder="Ville ou code postal…"
                        class="w-full text-sm rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 placeholder:text-warm-500 focus:outline-none focus:border-coral-400"
                    />
                    <div
                        v-if="showCityDropdown"
                        class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-warm-200 rounded-lg shadow-lg overflow-hidden"
                    >
                        <button
                            v-for="r in cityResults"
                            :key="r.place_id"
                            class="w-full text-left px-3 py-2 text-sm text-warm-900 hover:bg-warm-50 border-b border-warm-100 last:border-0"
                            @click="onCitySelect(r)"
                        >
                            {{ r.address?.city || r.address?.town || r.address?.village || r.address?.county }}
                            <span class="text-warm-400 ml-1">{{ r.address?.state }}</span>
                        </button>
                    </div>
                </div>

                <!-- Radius (mobile) -->
                <div v-if="selectedCityName" class="flex rounded-lg border border-warm-200 overflow-hidden text-xs">
                    <button
                        v-for="km in [10, 25, 50, 100]"
                        :key="km"
                        class="flex-1 px-2 py-2 border-r border-warm-200 last:border-0 transition-colors"
                        :class="filters.radius === km ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                        @click="filters.radius = km; mapViewRef.value?.flyTo(filters.lat, filters.lng, zoomForRadius[km] ?? 11)"
                    >{{ km }} km</button>
                </div>

                <!-- Date buttons -->
                <div class="flex rounded-lg border border-warm-200 overflow-hidden text-xs">
                    <button
                        class="flex-1 px-2 py-2 border-r border-warm-200 transition-colors"
                        :class="isToday ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                        @click="selectToday"
                    >Aujourd'hui</button>
                    <button
                        class="flex-1 px-2 py-2 border-r border-warm-200 transition-colors"
                        :class="isTomorrow ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                        @click="selectTomorrow"
                    >Demain</button>
                    <button
                        class="flex-1 px-2 py-2 transition-colors"
                        :class="isCustomDate ? 'bg-coral-400 text-white' : 'text-warm-900 hover:bg-warm-50'"
                        @click="selectCustom"
                    >Autre date</button>
                </div>
                <input
                    v-if="showCustomDatePicker || isCustomDate"
                    v-model="selectedDate"
                    type="date"
                    :min="today"
                    class="w-full text-sm rounded-md border border-warm-200 bg-warm-50 px-3 py-2 text-warm-900 focus:outline-none focus:border-coral-400"
                    @change="showCustomDatePicker = false"
                />

                <!-- Open now toggle -->
                <label
                    class="flex items-center gap-2.5"
                    :class="isToday ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                >
                    <div
                        class="relative w-9 h-5 rounded-full transition-colors duration-150 shrink-0"
                        :class="filters.openNow ? 'bg-open-600' : 'bg-warm-200'"
                        @click="isToday && (filters.openNow = !filters.openNow)"
                    >
                        <div
                            class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150"
                            :class="filters.openNow ? 'translate-x-4' : ''"
                        />
                    </div>
                    <span class="text-sm text-warm-900">{{ isToday ? 'Ouverts maintenant' : 'Ouverts ce jour-là' }}</span>
                </label>

                <!-- Cuisine chips -->
                <SearchBar
                    :cuisines="page.props.cuisines"
                    :selected-cuisine="filters.cuisine"
                    @update:selected-cuisine="filters.cuisine = $event"
                />
            </div>

            <!-- Truck list mobile -->
            <div ref="mobileListRef" class="px-3 pb-4 space-y-2">
                <div v-if="!hasLocation" class="text-center py-6 px-2">
                    <p class="text-xs font-medium text-warm-900 mb-1">Où cherchez-vous ?</p>
                    <p class="text-xs text-warm-500">Entrez une ville ci-dessus ou activez la localisation.</p>
                </div>
                <p v-else-if="loading" class="text-xs text-warm-500 text-center py-4">Chargement…</p>
                <div v-else-if="noResultsInBounds" class="text-center py-4">
                    <p class="text-xs text-warm-500">Aucun truck dans cette zone.</p>
                    <p class="text-xs text-warm-400 mt-0.5">Déplacez la carte pour en trouver.</p>
                </div>
                <p v-else-if="trucks.length === 0" class="text-xs text-warm-500 text-center py-4">Aucun truck trouvé.</p>
                <button
                    v-for="truck in trucks"
                    :key="truck.id"
                    :data-truck-id="truck.id"
                    class="w-full text-left"
                    @click="onCardClick(truck, truck.locations[0])"
                >
                    <AppCard class="transition-colors duration-100 hover:border-coral-200">
                        <div class="flex items-center gap-3">
                            <div class="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-coral-50 flex items-center justify-center">
                                <img
                                    v-if="truck.photo_url"
                                    :src="truck.photo_url"
                                    :alt="truck.name"
                                    class="w-full h-full object-cover"
                                />
                                <span v-else class="text-xl leading-none">{{ truck.cuisine.emoji }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</p>
                                <p class="text-xs text-warm-500 truncate">{{ truck.locations[0]?.city }}</p>
                            </div>
                            <div class="shrink-0">
                                <AppBadge v-if="truck.locations[0]?.is_open_now" variant="open">Ouvert</AppBadge>
                                <AppBadge v-else-if="truck.locations[0]?.is_open_today" variant="closed">
                                    {{ formatTime(truck.locations[0].todays_schedule.opens_at) }}–{{ formatTime(truck.locations[0].todays_schedule.closes_at) }}
                                </AppBadge>
                                <AppBadge v-else variant="closed">Fermé</AppBadge>
                            </div>
                        </div>
                    </AppCard>
                </button>
                <button
                    v-if="hasMore"
                    class="w-full text-xs text-warm-500 hover:text-warm-900 py-3 transition-colors"
                    :disabled="loadingMore"
                    @click="loadMore"
                >
                    {{ loadingMore ? 'Chargement…' : 'Charger plus' }}
                </button>
            </div>
        </div>
    </AppLayout>
</template>
