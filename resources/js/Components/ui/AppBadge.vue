<script setup lang="ts">
defineProps<{
    variant?: 'open' | 'closed' | 'cuisine'
}>()
</script>

<template>
    <span
        :class="[
            'inline-flex items-center rounded-full px-3 py-0.5 text-xs',
            variant === 'open'
                ? 'bg-open-50 text-open-600 font-medium'
                : variant === 'cuisine'
                    ? 'bg-coral-50 text-coral-600'
                    : 'bg-warm-50 text-warm-500',
        ]"
    >
        <slot />
    </span>
</template>
