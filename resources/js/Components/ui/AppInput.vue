<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
    modelValue?: string
    placeholder?: string
    icon?: Component
    type?: string
}>()

defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <div class="relative">
        <component
            :is="icon"
            v-if="icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-500"
        />
        <input
            :type="type ?? 'text'"
            :value="modelValue"
            :placeholder="placeholder"
            :class="[
                'w-full border border-warm-200 rounded-md py-2 text-sm bg-white',
                'focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent',
                'placeholder:text-warm-500',
                icon ? 'pl-9 pr-3' : 'px-3',
            ]"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </div>
</template>
