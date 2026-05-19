<script setup lang="ts">
defineProps<{
    steps: string[];
    current: number;
}>();
</script>

<template>
    <div class="flex items-center gap-0">
        <template v-for="(step, index) in steps" :key="index">
            <!-- Cercle étape -->
            <div class="flex flex-col items-center">
                <div
                    class="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-150"
                    :class="
                        index + 1 < current
                            ? 'border-open-600 bg-open-50 text-open-600'
                            : index + 1 === current
                              ? 'border-coral-400 bg-coral-400 text-white'
                              : 'border-warm-200 bg-white text-warm-500'
                    "
                >
                    <span v-if="index + 1 < current">✓</span>
                    <span v-else>{{ index + 1 }}</span>
                </div>
                <span
                    class="mt-1 text-center text-xs"
                    :class="
                        index + 1 === current
                            ? 'font-medium text-coral-400'
                            : 'text-warm-500'
                    "
                >
                    {{ step }}
                </span>
            </div>

            <!-- Ligne entre étapes -->
            <div
                v-if="index < steps.length - 1"
                class="mx-1 mb-4 h-0.5 flex-1 transition-colors duration-150"
                :class="
                    index + 1 < current
                        ? 'border border-open-600 bg-open-50'
                        : 'bg-warm-200'
                "
            />
        </template>
    </div>
</template>
