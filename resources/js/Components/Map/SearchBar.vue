<script setup lang="ts">
defineProps<{
    cuisines: Array<{ id: string; name: string; slug: string; emoji: string }>
    selectedCuisine: string | null
    openNow: boolean
}>()

const emit = defineEmits<{
    'update:selectedCuisine': [value: string | null]
    'update:openNow': [value: boolean]
}>()
</script>

<template>
    <div class="flex flex-col gap-3">
        <!-- Toggle ouvert maintenant -->
        <label class="flex items-center gap-2 cursor-pointer">
            <div
                class="relative w-9 h-5 rounded-full transition-colors duration-150"
                :class="openNow ? 'bg-open-600' : 'bg-warm-200'"
                @click="emit('update:openNow', !openNow)"
            >
                <div
                    class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-150"
                    :class="openNow ? 'translate-x-4' : ''"
                />
            </div>
            <span class="text-sm text-warm-900">Ouvert maintenant</span>
        </label>

        <!-- Chips cuisine -->
        <div class="flex flex-wrap gap-1.5">
            <button
                class="text-xs rounded-full px-3 py-1 transition-colors duration-100"
                :class="selectedCuisine === null
                    ? 'bg-coral-400 text-white'
                    : 'bg-warm-50 text-warm-900 hover:bg-warm-200'"
                @click="emit('update:selectedCuisine', null)"
            >
                Tous
            </button>
            <button
                v-for="c in cuisines"
                :key="c.id"
                class="text-xs rounded-full px-3 py-1 transition-colors duration-100"
                :class="selectedCuisine === c.slug
                    ? 'bg-coral-400 text-white'
                    : 'bg-warm-50 text-warm-900 hover:bg-warm-200'"
                @click="emit('update:selectedCuisine', selectedCuisine === c.slug ? null : c.slug)"
            >
                {{ c.emoji }} {{ c.name }}
            </button>
        </div>
    </div>
</template>
