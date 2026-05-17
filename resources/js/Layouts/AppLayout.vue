<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3'

const page = usePage<{
    auth: { user: { id: string; name: string } | null }
}>()

const logout = () => router.post('/deconnexion')
</script>

<template>
    <div class="min-h-screen bg-warm-50 font-sans">
        <!-- Navbar -->
        <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-warm-200 h-14">
            <div class="max-w-full px-4 h-full flex items-center gap-4">
                <Link href="/" class="flex items-center gap-2 shrink-0">
                    <span class="text-xl">🚚</span>
                    <span class="text-sm font-medium text-warm-900">TruckMap</span>
                </Link>

                <div class="flex-1" />

                <!-- Auth area -->
                <div class="flex items-center gap-3 shrink-0">
                    <template v-if="page.props.auth?.user">
                        <!-- Desktop -->
                        <Link
                            href="/mon-truck"
                            class="text-sm text-warm-900 hover:text-coral-400 transition-colors hidden md:inline"
                        >
                            Mon espace
                        </Link>
                        <button
                            class="text-xs text-warm-400 hover:text-warm-700 transition-colors hidden md:inline shrink-0"
                            @click="logout"
                        >
                            Déconnexion
                        </button>
                        <!-- Mobile: CTA vers admin -->
                        <Link
                            href="/mon-truck"
                            class="md:hidden bg-coral-400 hover:bg-coral-600 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors duration-150 shrink-0"
                        >
                            Mon espace
                        </Link>
                    </template>
                    <template v-else>
                        <Link
                            href="/connexion"
                            class="text-sm text-warm-900 hover:text-coral-400 transition-colors hidden md:inline"
                        >
                            Connexion
                        </Link>
                        <div class="w-px h-4 bg-warm-200 hidden md:block shrink-0" />
                        <Link
                            href="/enregistrer"
                            class="bg-coral-400 hover:bg-coral-600 text-white text-sm font-medium rounded-md px-4 py-2 transition-colors duration-150 shrink-0"
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
