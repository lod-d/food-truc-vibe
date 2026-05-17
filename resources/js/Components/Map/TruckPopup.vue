<script setup lang="ts">
import AppBadge from '../ui/AppBadge.vue'

defineProps<{
    truck: {
        name: string
        cuisine: { name: string; emoji: string; slug: string }
        photo_url?: string | null
        instagram_url?: string | null
        phone?: string | null
    }
    location: {
        address: string
        city: string
        is_open_now: boolean
        is_open_today: boolean
        todays_schedule?: { opens_at: string; closes_at: string } | null
        place_name?: string | null
    }
}>()

const formatTime = (t: string) => t.slice(0, 5)
</script>

<template>
    <div class="p-3 w-[220px]">
        <div v-if="truck.photo_url" class="mb-2 -mx-3 -mt-3 overflow-hidden rounded-t-xl">
            <img :src="truck.photo_url" :alt="truck.name" class="w-full h-24 object-cover" />
        </div>

        <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="text-sm font-medium text-warm-900 leading-tight">{{ truck.name }}</h3>
            <AppBadge v-if="location.is_open_now" variant="open">● Ouvert</AppBadge>
            <AppBadge v-else-if="location.is_open_today" variant="closed">Fermé</AppBadge>
        </div>

        <AppBadge variant="cuisine" class="mb-2">{{ truck.cuisine.emoji }} {{ truck.cuisine.name }}</AppBadge>

        <p v-if="location.todays_schedule" class="text-xs text-warm-500 mb-2">
            {{ formatTime(location.todays_schedule.opens_at) }} – {{ formatTime(location.todays_schedule.closes_at) }}
        </p>

        <p class="text-xs text-warm-500 truncate">
            {{ location.place_name || location.address }}, {{ location.city }}
        </p>

        <div class="flex gap-3 mt-2 pt-2 border-t border-warm-200">
            <a
                v-if="truck.instagram_url"
                :href="`https://instagram.com/${truck.instagram_url.replace('@', '')}`"
                target="_blank"
                class="text-xs text-coral-400 hover:text-coral-600"
            >
                Instagram
            </a>
            <a
                v-if="truck.phone"
                :href="`tel:${truck.phone}`"
                class="text-xs text-coral-400 hover:text-coral-600"
            >
                Appeler
            </a>
        </div>
    </div>
</template>
