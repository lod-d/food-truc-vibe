<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
</script>

<template>
    <div class="min-h-screen bg-warm-50 font-sans">
        <!-- Navbar -->
        <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-warm-200 h-14">
            <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <Link href="/" class="flex items-center gap-2">
                    <span class="text-xl">🚚</span>
                    <span class="text-sm font-medium text-warm-900">TruckMap</span>
                </Link>

                <Link
                    href="/enregistrer"
                    class="bg-coral-400 hover:bg-coral-600 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors duration-150"
                >
                    + Mon truck
                </Link>
            </div>
        </header>

        <!-- Content (offset for fixed navbar) -->
        <main class="pt-14">
            <slot />
        </main>
    </div>
</template>
