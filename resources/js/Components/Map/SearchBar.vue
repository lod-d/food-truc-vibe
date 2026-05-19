<script setup lang="ts">
defineProps<{
    cuisines: Array<{ id: string; name: string; slug: string; emoji: string }>;
    selectedCuisine: string | null;
}>();

const emit = defineEmits<{
    'update:selectedCuisine': [value: string | null];
}>();
</script>

<template>
    <div class="flex flex-wrap items-center gap-1.5">
        <button
            class="rounded-full px-3 py-1 text-xs transition-colors duration-100"
            :class="
                selectedCuisine === null
                    ? 'bg-coral-400 text-white'
                    : 'bg-warm-50 text-warm-900 hover:bg-warm-200'
            "
            @click="emit('update:selectedCuisine', null)"
        >
            Tous
        </button>
        <button
            v-for="c in cuisines"
            :key="c.id"
            class="rounded-full px-3 py-1 text-xs transition-colors duration-100"
            :class="
                selectedCuisine === c.slug
                    ? 'bg-coral-400 text-white'
                    : 'bg-warm-50 text-warm-900 hover:bg-warm-200'
            "
            @click="
                emit(
                    'update:selectedCuisine',
                    selectedCuisine === c.slug ? null : c.slug,
                )
            "
        >
            {{ c.emoji }} {{ c.name }}
        </button>
    </div>
</template>
