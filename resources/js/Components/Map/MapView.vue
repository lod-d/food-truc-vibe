<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMap } from '../../Composables/useMap'

const props = defineProps<{
    trucks: any[]
}>()

const emit = defineEmits<{
    'truck-selected': [truck: any, location: any]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const { init, setTrucks, flyTo, showUserLocation } = useMap(mapContainer)

onMounted(() => {
    init()
    setTrucks(props.trucks, (truck: any, loc: any) => emit('truck-selected', truck, loc))
})

watch(() => props.trucks, (newTrucks) => {
    setTrucks(newTrucks, (truck: any, loc: any) => emit('truck-selected', truck, loc))
}, { deep: true })

defineExpose({ flyTo, showUserLocation })
</script>

<template>
    <div ref="mapContainer" class="w-full h-full" />
</template>
