<script setup lang="ts">
defineProps<{
    steps: string[]
    current: number
}>()
</script>

<template>
    <div class="flex items-center gap-0">
        <template v-for="(step, index) in steps" :key="index">
            <!-- Cercle étape -->
            <div class="flex flex-col items-center">
                <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-colors duration-150"
                    :class="index + 1 < current
                        ? 'bg-open-50 text-open-600 border-open-300'
                        : index + 1 === current
                            ? 'bg-coral-400 text-white border-coral-400'
                            : 'bg-white text-warm-500 border-warm-200'"
                >
                    <span v-if="index + 1 < current">✓</span>
                    <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-xs mt-1 text-center"
                    :class="index + 1 === current ? 'text-coral-400 font-medium' : 'text-warm-500'"
                >
                    {{ step }}
                </span>
            </div>

            <!-- Ligne entre étapes -->
            <div
                v-if="index < steps.length - 1"
                class="flex-1 h-0.5 mx-1 mb-4 transition-colors duration-150"
                :class="index + 1 < current ? 'bg-open-300' : 'bg-warm-200'"
            />
        </template>
    </div>
</template>
