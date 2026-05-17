<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMap } from '../../Composables/useMap'

const props = defineProps<{
    trucks: any[]
}>()

const emit = defineEmits<{
    'truck-selected': [truck: any, location: any]
    'bounds-changed': [bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number } | null]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const { init, setTrucks, flyTo, showUserLocation } = useMap(mapContainer)

onMounted(() => {
    init((bounds: any) => emit('bounds-changed', bounds))
    setTrucks(props.trucks, (truck: any, loc: any) => emit('truck-selected', truck, loc))
})

watch(() => props.trucks, (newTrucks) => {
    setTrucks(newTrucks, (truck: any, loc: any) => emit('truck-selected', truck, loc))
})

defineExpose({ flyTo, showUserLocation })
</script>

<template>
    <div ref="mapContainer" class="w-full h-full" />
</template>
