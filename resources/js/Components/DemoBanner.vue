<script setup lang="ts">
import { ref } from 'vue';

const DISMISS_KEY = 'demo-banner-dismissed';

const dismissed = ref(
    typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem(DISMISS_KEY) === '1',
);

const dismiss = () => {
    dismissed.value = true;

    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(DISMISS_KEY, '1');
    }
};
</script>

<template>
    <div
        v-if="!dismissed"
        class="fixed top-14 right-0 left-0 z-40 flex items-center justify-between gap-3 border-b border-coral-400 bg-coral-50 px-4 py-2 text-sm text-warm-900"
    >
        <div class="flex flex-1 items-center gap-2">
            <span aria-hidden="true">🧪</span>
            <span>
                <strong class="font-medium">Environnement de démo</strong>
                — connexion :
                <code class="rounded bg-white px-1 py-0.5 text-xs"
                    >demo@truckmap.fr</code
                >
                /
                <code class="rounded bg-white px-1 py-0.5 text-xs">demo</code>.
                Les données sont réinitialisées chaque nuit à 04:00.
            </span>
        </div>
        <button
            type="button"
            aria-label="Masquer le bandeau de démo"
            class="shrink-0 rounded-md p-1 text-warm-900 transition-colors hover:bg-coral-400 hover:text-white"
            @click="dismiss"
        >
            ✕
        </button>
    </div>
</template>
