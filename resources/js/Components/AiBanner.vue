<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';

const DISMISS_KEY = 'ai-banner-dismissed';

const page = usePage<{ isDemo?: boolean }>();

const dismissed = ref(
    typeof localStorage !== 'undefined' &&
        localStorage.getItem(DISMISS_KEY) === '1',
);

const dismiss = () => {
    dismissed.value = true;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DISMISS_KEY, '1');
    }
};

// Se place sous le DemoBanner en mode démo, sinon directement sous la navbar.
const topClass = computed(() => (page.props.isDemo ? 'top-22' : 'top-14'));
</script>

<template>
    <div
        v-if="!dismissed"
        :class="[
            'fixed right-0 left-0 z-40 flex items-center justify-between gap-3 border-b border-warm-200 bg-warm-50 px-4 py-2 text-sm text-warm-500',
            topClass,
        ]"
    >
        <div class="flex flex-1 items-center gap-2">
            <span aria-hidden="true">🤖</span>
            <span>
                TruckMap est accessible à votre IA favorite —
                <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noopener"
                    class="underline underline-offset-2 transition-colors hover:text-warm-900"
                    >en savoir plus</a
                >
            </span>
        </div>
        <button
            type="button"
            aria-label="Masquer"
            class="shrink-0 rounded-md p-1 transition-colors hover:bg-warm-200 hover:text-warm-900"
            @click="dismiss"
        >
            ✕
        </button>
    </div>
</template>
