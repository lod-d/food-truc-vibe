<script setup lang="ts">
defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}>()
</script>

<template>
    <button
        :type="type ?? 'button'"
        :disabled="disabled"
        :class="[
            'inline-flex items-center justify-center text-sm transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
            variant === 'secondary'
                ? 'border border-warm-200 hover:bg-warm-50 text-warm-900 rounded-md px-5 py-2.5'
                : variant === 'ghost'
                    ? 'text-coral-400 hover:text-coral-600 underline-offset-2 hover:underline'
                    : 'bg-coral-400 hover:bg-coral-600 text-white rounded-md px-5 py-2.5 font-medium',
        ]"
    >
        <slot />
    </button>
</template>
