<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import AppLayout from '../Layouts/AppLayout.vue'
import MapView from '../Components/Map/MapView.vue'
import SearchBar from '../Components/Map/SearchBar.vue'
import TruckPopup from '../Components/Map/TruckPopup.vue'
import AppCard from '../Components/ui/AppCard.vue'
import AppBadge from '../Components/ui/AppBadge.vue'
import { useTrucks } from '../Composables/useTrucks'

const props = defineProps<{
    initialTrucks: any[]
}>()

const page = usePage<{ cuisines: any[]; flash: { success?: string } }>()

const { trucks, filters, loading } = useTrucks(props.initialTrucks)

const selectedTruck = ref<any | null>(null)
const selectedLocation = ref<any | null>(null)
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null)

const onTruckSelected = (truck: any, location: any) => {
    selectedTruck.value  = truck
    selectedLocation.value = location
}

const onCardClick = (truck: any, location: any) => {
    selectedTruck.value   = truck
    selectedLocation.value = location
    mapViewRef.value?.flyTo(location.latitude, location.longitude)
}

const formatTime = (t: string) => t.slice(0, 5)

const locating = ref(false)
const locateError = ref<string | null>(null)

const onLocateMe = () => {
    if (!navigator.geolocation) {
        locateError.value = 'Géolocalisation non supportée'
        return
    }
    locating.value = true
    locateError.value = null
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            locating.value = false
            mapViewRef.value?.flyTo(coords.latitude, coords.longitude, 14)
            mapViewRef.value?.showUserLocation(coords.latitude, coords.longitude)
        },
        () => {
            locating.value = false
            locateError.value = 'Impossible de vous localiser'
        },
        { timeout: 8000 }
    )
}
</script>

<template>
    <AppLayout>
        <!-- Flash message -->
        <div
            v-if="page.props.flash?.success"
            class="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-open-50 text-open-600 border border-open-300 rounded-lg px-5 py-3 text-sm shadow"
        >
            {{ page.props.flash.success }}
        </div>

        <!-- Layout desktop : carte + panel côte à côte -->
        <div class="flex h-[calc(100vh-56px)]">

            <!-- Panel gauche -->
            <div class="hidden md:flex flex-col w-72 lg:w-80 border-r border-warm-200 bg-white overflow-hidden flex-shrink-0">
                <!-- Filtres -->
                <div class="p-4 border-b border-warm-200">
                    <SearchBar
                        :cuisines="page.props.cuisines"
                        :selected-cuisine="filters.cuisine"
                        :open-now="filters.openNow"
                        @update:selected-cuisine="filters.cuisine = $event"
                        @update:open-now="filters.openNow = $event"
                    />
                </div>

                <!-- Liste trucks -->
                <div class="flex-1 overflow-y-auto p-3 space-y-2">
                    <p v-if="loading" class="text-xs text-warm-500 text-center py-4">Chargement…</p>
                    <p v-else-if="trucks.length === 0" class="text-xs text-warm-500 text-center py-4">
                        Aucun truck trouvé.
                    </p>
                    <button
                        v-for="truck in trucks"
                                                :key="truck.id"
                        class="w-full text-left"
                        @click="onCardClick(truck, truck.locations[0])"
                    >
                        <AppCard
                            :class="selectedTruck?.id === truck.id ? 'border-coral-400 ring-1 ring-coral-400' : ''"
                            class="transition-colors duration-100 hover:border-coral-200"
                        >
                            <div class="flex items-start gap-3">
                                <div class="text-2xl leading-none">{{ truck.cuisine.emoji }}</div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1 mb-1">
                                        <h3 class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</h3>
                                        <AppBadge
                                            v-if="truck.locations[0]?.is_open_now"
                                            variant="open"
                                        >● Ouvert</AppBadge>
                                        <AppBadge v-else variant="closed">Fermé</AppBadge>
                                    </div>
                                    <p class="text-xs text-warm-500 truncate">
                                        {{ truck.locations[0]?.place_name || truck.locations[0]?.address }}, {{ truck.locations[0]?.city }}
                                    </p>
                                    <p v-if="truck.locations[0]?.todays_schedule" class="text-xs text-warm-500 mt-0.5">
                                        {{ formatTime(truck.locations[0].todays_schedule.opens_at) }} – {{ formatTime(truck.locations[0].todays_schedule.closes_at) }}
                                    </p>
                                </div>
                            </div>
                        </AppCard>
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
                />

                <!-- Bouton géolocalisation -->
                <button
                    class="absolute bottom-6 right-14 z-1000 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-warm-800 shadow-md border border-warm-200 hover:bg-warm-50 disabled:opacity-50 transition-opacity"
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
                    class="absolute bottom-14 right-14 z-1000 bg-white text-xs text-red-600 border border-red-200 rounded-lg px-3 py-2 shadow whitespace-nowrap"
                >
                    {{ locateError }}
                </div>

                <!-- Popup sélection (desktop overlay) -->
                <div
                    v-if="selectedTruck && selectedLocation"
                    class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-xl border border-warm-200 shadow-lg md:hidden"
                >
                    <TruckPopup :truck="selectedTruck" :location="selectedLocation" />
                    <button
                        class="absolute top-2 right-2 text-warm-500 hover:text-warm-900"
                        @click="selectedTruck = null"
                    >✕</button>
                </div>
            </div>
        </div>

        <!-- Panel mobile bottom sheet -->
        <div class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl border-t border-warm-200 max-h-[45vh] overflow-y-auto">
            <div class="flex justify-center pt-2 pb-1">
                <div class="w-8 h-1 bg-warm-200 rounded-full" />
            </div>
            <!-- Filtres mobile -->
            <div class="px-4 pb-3 border-b border-warm-200">
                <SearchBar
                    :cuisines="page.props.cuisines"
                    :selected-cuisine="filters.cuisine"
                    :open-now="filters.openNow"
                    @update:selected-cuisine="filters.cuisine = $event"
                    @update:open-now="filters.openNow = $event"
                />
            </div>
            <!-- Liste mobile -->
            <div class="p-3 space-y-2">
                <button
                    v-for="truck in trucks"
                    :key="truck.id"
                    class="w-full text-left"
                    @click="onCardClick(truck, truck.locations[0])"
                >
                    <AppCard class="transition-colors duration-100 hover:border-coral-200">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">{{ truck.cuisine.emoji }}</span>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</p>
                                <p class="text-xs text-warm-500 truncate">{{ truck.locations[0]?.city }}</p>
                            </div>
                            <AppBadge v-if="truck.locations[0]?.is_open_now" variant="open">Ouvert</AppBadge>
                            <AppBadge v-else variant="closed">Fermé</AppBadge>
                        </div>
                    </AppCard>
                </button>
            </div>
        </div>
    </AppLayout>
</template>
