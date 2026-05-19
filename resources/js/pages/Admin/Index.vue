<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3'
import { ref } from 'vue'
import AppBadge from '../../Components/ui/AppBadge.vue'
import AppButton from '../../Components/ui/AppButton.vue'
import AppCard from '../../Components/ui/AppCard.vue'
import AppLayout from '../../Layouts/AppLayout.vue'

type TruckRow = {
    id: string
    name: string
    cuisine: { name: string; emoji: string }
    photo_url: string | null
    city: string | null
    is_open_today: boolean
}

defineProps<{
    trucks: TruckRow[]
    unclaimedTrucks: TruckRow[]
}>()

const page = usePage<{ auth: { user: { name: string } }; flash: { success?: string } }>()

const showUnclaimed = ref(false)

const deleteTruck = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) {
return
}

    router.delete(`/mon-truck/${id}`)
}

const claimTruck = (id: string, name: string) => {
    if (!confirm(`Revendiquer "${name}" ? Vous serez le seul gestionnaire de ce truck.`)) {
return
}

    router.post(`/mon-truck/${id}/revendiquer`)
}
</script>

<template>
    <AppLayout>
        <div class="max-w-2xl mx-auto px-4 py-8">

            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-xl font-medium text-warm-900">Mes trucks</h1>
                    <p class="text-xs text-warm-500 mt-0.5">Bonjour, {{ page.props.auth.user.name }}</p>
                </div>
                <Link href="/enregistrer">
                    <AppButton variant="primary">+ Ajouter un truck</AppButton>
                </Link>
            </div>

            <!-- Flash -->
            <div
                v-if="page.props.flash?.success"
                class="mb-4 bg-open-50 text-open-600 border border-open-600 rounded-lg px-4 py-3 text-sm"
            >
                {{ page.props.flash.success }}
            </div>

            <!-- Mes trucks -->
            <div v-if="trucks.length === 0" class="text-center py-12 text-warm-500 text-sm">
                <p class="text-3xl mb-3">🚚</p>
                <p>Vous n'avez pas encore de truck enregistré.</p>
                <Link href="/enregistrer" class="mt-3 inline-block text-coral-400 hover:text-coral-600">
                    Enregistrer mon premier truck →
                </Link>
            </div>
            <div v-else class="space-y-3 mb-8">
                <AppCard v-for="truck in trucks" :key="truck.id">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-lg overflow-hidden bg-warm-50 shrink-0">
                            <img v-if="truck.photo_url" :src="truck.photo_url" :alt="truck.name" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-2xl">{{ truck.cuisine.emoji }}</div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-0.5">
                                <h2 class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</h2>
                                <AppBadge v-if="truck.is_open_today" variant="open">● Actif</AppBadge>
                                <AppBadge v-else variant="closed">Inactif</AppBadge>
                            </div>
                            <p class="text-xs text-warm-500">{{ truck.cuisine.emoji }} {{ truck.cuisine.name }}{{ truck.city ? ` · ${truck.city}` : '' }}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <Link :href="`/mon-truck/${truck.id}/editer`">
                                <AppButton variant="secondary">Modifier</AppButton>
                            </Link>
                            <button
                                class="text-xs text-warm-500 hover:text-red-500 transition-colors px-2 py-1"
                                @click="deleteTruck(truck.id, truck.name)"
                            >Supprimer</button>
                        </div>
                    </div>
                </AppCard>
            </div>

            <!-- Trucks sans propriétaire -->
            <div v-if="unclaimedTrucks.length > 0" class="border-t border-warm-200 pt-6">
                <button
                    class="flex items-center justify-between w-full text-left mb-4"
                    @click="showUnclaimed = !showUnclaimed"
                >
                    <div>
                        <p class="text-sm font-medium text-warm-900">Trucks sans propriétaire</p>
                        <p class="text-xs text-warm-500 mt-0.5">
                            {{ unclaimedTrucks.length }} truck{{ unclaimedTrucks.length > 1 ? 's' : '' }} non revendiqué{{ unclaimedTrucks.length > 1 ? 's' : '' }} — modifiables par tous, revendiquez le vôtre.
                        </p>
                    </div>
                    <span class="text-warm-400 text-sm transition-transform" :class="showUnclaimed ? 'rotate-180' : ''">▾</span>
                </button>

                <div v-if="showUnclaimed" class="space-y-3">
                    <AppCard v-for="truck in unclaimedTrucks" :key="truck.id">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-lg overflow-hidden bg-warm-50 shrink-0">
                                <img v-if="truck.photo_url" :src="truck.photo_url" :alt="truck.name" class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full flex items-center justify-center text-xl">{{ truck.cuisine.emoji }}</div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-warm-900 truncate">{{ truck.name }}</p>
                                <p class="text-xs text-warm-500">{{ truck.cuisine.name }}{{ truck.city ? ` · ${truck.city}` : '' }}</p>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <Link :href="`/mon-truck/${truck.id}/editer`">
                                    <AppButton variant="secondary">Modifier</AppButton>
                                </Link>
                                <button
                                    class="text-xs text-coral-400 hover:text-coral-600 font-medium transition-colors px-2 py-1"
                                    @click="claimTruck(truck.id, truck.name)"
                                >Revendiquer</button>
                            </div>
                        </div>
                    </AppCard>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
