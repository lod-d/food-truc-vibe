<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';

const page = usePage<{
    auth: { user: { id: string; name: string } | null };
}>();

const logout = () => router.post('/deconnexion');
</script>

<template>
    <div class="min-h-screen bg-warm-50 font-sans">
        <!-- Navbar -->
        <header
            class="fixed top-0 right-0 left-0 z-50 h-14 border-b border-warm-200 bg-white"
        >
            <div class="flex h-full max-w-full items-center gap-4 px-4">
                <Link href="/" class="flex shrink-0 items-center gap-2">
                    <span class="text-xl">🚚</span>
                    <span class="text-sm font-medium text-warm-900"
                        >TruckMap</span
                    >
                </Link>

                <div class="flex-1" />

                <!-- Auth area -->
                <div class="flex shrink-0 items-center gap-3">
                    <template v-if="page.props.auth?.user">
                        <!-- Desktop -->
                        <Link
                            href="/mon-truck"
                            class="hidden text-sm text-warm-900 transition-colors hover:text-coral-400 md:inline"
                        >
                            Mon espace
                        </Link>
                        <button
                            class="text-warm-400 hover:text-warm-700 hidden shrink-0 text-xs transition-colors md:inline"
                            @click="logout"
                        >
                            Déconnexion
                        </button>
                        <!-- Mobile: CTA vers admin -->
                        <Link
                            href="/mon-truck"
                            class="shrink-0 rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-coral-600 md:hidden"
                        >
                            Mon espace
                        </Link>
                    </template>
                    <template v-else>
                        <Link
                            href="/connexion"
                            class="hidden text-sm text-warm-900 transition-colors hover:text-coral-400 md:inline"
                        >
                            Connexion
                        </Link>
                        <div
                            class="hidden h-4 w-px shrink-0 bg-warm-200 md:block"
                        />
                        <Link
                            href="/enregistrer"
                            class="shrink-0 rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-coral-600"
                        >
                            + Mon truck
                        </Link>
                    </template>
                </div>
            </div>
        </header>

        <!-- Content (offset for fixed navbar) -->
        <main class="pt-14">
            <slot />
        </main>
    </div>
</template>
