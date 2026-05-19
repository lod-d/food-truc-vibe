<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- Inertia useForm est conçu pour être muté depuis les composants enfants */
import L from 'leaflet';
import { onMounted, ref } from 'vue';
import { useGeocoding } from '../../Composables/useGeocoding';

const props = defineProps<{ form: any }>();

const mapContainer = ref<HTMLElement | null>(null);
const searchQuery = ref('');
const suggestions = ref<any[]>([]);
const showSuggestions = ref(false);

let miniMap: L.Map | null = null;
let marker: L.Marker | null = null;
const { search } = useGeocoding();

const placeMarker = (
    lat: number,
    lng: number,
    address?: string,
    city?: string,
) => {
    props.form.latitude = lat;
    props.form.longitude = lng;

    if (address) {
        props.form.address = address;
    }

    if (city) {
        props.form.city = city;
    }

    const latlng = L.latLng(lat, lng);

    if (marker) {
        marker.setLatLng(latlng);
    } else {
        marker = L.marker(latlng, {
            icon: L.divIcon({
                html: `<div class="truck-marker"><span class="emoji">📍</span></div>`,
                className: '',
                iconSize: L.point(40, 40),
                iconAnchor: L.point(20, 40),
            }),
        }).addTo(miniMap!);
    }

    miniMap?.setView(latlng, 15);
};

onMounted(() => {
    miniMap = L.map(mapContainer.value!, {
        center: [46.603354, 1.888334],
        zoom: 5,
        zoomControl: false,
    });

    L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
            attribution: '© OpenStreetMap © CARTO',
            maxZoom: 19,
        },
    ).addTo(miniMap);

    L.control.zoom({ position: 'bottomright' }).addTo(miniMap);

    miniMap.on('click', (e) => {
        placeMarker(e.latlng.lat, e.latlng.lng);
    });

    if (props.form.latitude && props.form.longitude) {
        placeMarker(props.form.latitude, props.form.longitude);
    }
});

let debounceTimer: ReturnType<typeof setTimeout>;
const onSearchInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        suggestions.value = await search(searchQuery.value);
        showSuggestions.value = suggestions.value.length > 0;
    }, 350);
};

const onSearchBlur = () => {
    setTimeout(() => {
        showSuggestions.value = false;
    }, 200);
};

const selectSuggestion = (s: any) => {
    const addressParts = s.display_name.split(',');
    const address = addressParts[0]?.trim() ?? s.display_name;
    const city =
        s.address?.city ||
        s.address?.town ||
        s.address?.village ||
        s.address?.municipality ||
        '';

    placeMarker(parseFloat(s.lat), parseFloat(s.lon), address, city);

    searchQuery.value = s.display_name;
    showSuggestions.value = false;
};
</script>

<template>
    <div class="space-y-4">
        <!-- Recherche adresse -->
        <div class="relative">
            <label class="mb-1 block text-xs text-warm-500">Adresse *</label>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une adresse..."
                class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                @input="onSearchInput"
                @blur="onSearchBlur"
            />
            <ul
                v-if="showSuggestions"
                class="absolute z-[1000] mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-warm-200 bg-white shadow-lg"
            >
                <li
                    v-for="s in suggestions"
                    :key="s.place_id"
                    class="cursor-pointer px-3 py-3 text-sm text-warm-900 hover:bg-warm-50"
                    @mousedown.prevent="selectSuggestion(s)"
                >
                    {{ s.display_name }}
                </li>
            </ul>
            <p v-if="form.errors.address" class="mt-1 text-xs text-red-500">
                {{ form.errors.address }}
            </p>
        </div>

        <!-- Mini carte -->
        <div>
            <label class="mb-1 block text-xs text-warm-500"
                >Cliquez sur la carte pour placer votre emplacement *</label
            >
            <div
                ref="mapContainer"
                class="h-52 w-full overflow-hidden rounded-lg border border-warm-200"
            />
            <p v-if="form.errors.latitude" class="mt-1 text-xs text-red-500">
                {{ form.errors.latitude }}
            </p>
            <p v-if="form.errors.city" class="mt-1 text-xs text-red-500">
                {{ form.errors.city }}
            </p>
        </div>

        <!-- Coordonnées (readonly) -->
        <div class="flex gap-3" v-if="form.latitude && form.longitude">
            <div class="flex-1">
                <label class="mb-1 block text-xs text-warm-500">Latitude</label>
                <input
                    :value="form.latitude?.toFixed(6)"
                    readonly
                    class="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-500"
                />
            </div>
            <div class="flex-1">
                <label class="mb-1 block text-xs text-warm-500"
                    >Longitude</label
                >
                <input
                    :value="form.longitude?.toFixed(6)"
                    readonly
                    class="w-full rounded-md border border-warm-200 bg-warm-50 px-3 py-3 text-sm text-warm-500"
                />
            </div>
        </div>

        <!-- Nom du lieu -->
        <div>
            <label class="mb-1 block text-xs text-warm-500"
                >Nom du lieu (optionnel)</label
            >
            <input
                v-model="form.place_name"
                type="text"
                placeholder="Ex: Marché des Enfants Rouges"
                class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
            />
        </div>
    </div>
</template>
