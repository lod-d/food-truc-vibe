<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppBadge from '../../Components/ui/AppBadge.vue';
import AppButton from '../../Components/ui/AppButton.vue';
import AppCard from '../../Components/ui/AppCard.vue';
import AppLayout from '../../Layouts/AppLayout.vue';

type TruckRow = {
    id: string;
    name: string;
    cuisine: { name: string; emoji: string };
    photo_url: string | null;
    city: string | null;
    is_open_today: boolean;
};

defineProps<{
    trucks: TruckRow[];
    unclaimedTrucks: TruckRow[];
}>();

const page = usePage<{
    auth: { user: { name: string } };
    flash: { success?: string };
}>();

const showUnclaimed = ref(false);

const deleteTruck = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) {
        return;
    }

    router.delete(`/mon-truck/${id}`);
};

const claimTruck = (id: string, name: string) => {
    if (
        !confirm(
            `Revendiquer "${name}" ? Vous serez le seul gestionnaire de ce truck.`,
        )
    ) {
        return;
    }

    router.post(`/mon-truck/${id}/revendiquer`);
};
</script>

<template>
    <AppLayout>
        <div class="mx-auto max-w-2xl px-4 py-8">
            <!-- Header -->
            <div class="mb-6 flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-medium text-warm-900">
                        Mes trucks
                    </h1>
                    <p class="mt-0.5 text-xs text-warm-500">
                        Bonjour, {{ page.props.auth.user.name }}
                    </p>
                </div>
                <Link href="/enregistrer">
                    <AppButton variant="primary">+ Ajouter un truck</AppButton>
                </Link>
            </div>

            <!-- Flash -->
            <div
                v-if="page.props.flash?.success"
                class="mb-4 rounded-lg border border-open-600 bg-open-50 px-4 py-3 text-sm text-open-600"
            >
                {{ page.props.flash.success }}
            </div>

            <!-- Mes trucks -->
            <div
                v-if="trucks.length === 0"
                class="py-12 text-center text-sm text-warm-500"
            >
                <p class="mb-3 text-3xl">🚚</p>
                <p>Vous n'avez pas encore de truck enregistré.</p>
                <Link
                    href="/enregistrer"
                    class="mt-3 inline-block text-coral-400 hover:text-coral-600"
                >
                    Enregistrer mon premier truck →
                </Link>
            </div>
            <div v-else class="mb-8 space-y-3">
                <AppCard v-for="truck in trucks" :key="truck.id">
                    <div class="flex items-center gap-4">
                        <div
                            class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-warm-50"
                        >
                            <img
                                v-if="truck.photo_url"
                                :src="truck.photo_url"
                                :alt="truck.name"
                                class="h-full w-full object-cover"
                            />
                            <div
                                v-else
                                class="flex h-full w-full items-center justify-center text-2xl"
                            >
                                {{ truck.cuisine.emoji }}
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="mb-0.5 flex items-center gap-2">
                                <h2
                                    class="truncate text-sm font-medium text-warm-900"
                                >
                                    {{ truck.name }}
                                </h2>
                                <AppBadge
                                    v-if="truck.is_open_today"
                                    variant="open"
                                    >● Actif</AppBadge
                                >
                                <AppBadge v-else variant="closed"
                                    >Inactif</AppBadge
                                >
                            </div>
                            <p class="text-xs text-warm-500">
                                {{ truck.cuisine.emoji }} {{ truck.cuisine.name
                                }}{{ truck.city ? ` · ${truck.city}` : '' }}
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-2">
                            <Link :href="`/mon-truck/${truck.id}/editer`">
                                <AppButton variant="secondary"
                                    >Modifier</AppButton
                                >
                            </Link>
                            <button
                                class="px-2 py-1 text-xs text-warm-500 transition-colors hover:text-red-500"
                                @click="deleteTruck(truck.id, truck.name)"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </AppCard>
            </div>

            <!-- Trucks sans propriétaire -->
            <div
                v-if="unclaimedTrucks.length > 0"
                class="border-t border-warm-200 pt-6"
            >
                <button
                    class="mb-4 flex w-full items-center justify-between text-left"
                    @click="showUnclaimed = !showUnclaimed"
                >
                    <div>
                        <p class="text-sm font-medium text-warm-900">
                            Trucks sans propriétaire
                        </p>
                        <p class="mt-0.5 text-xs text-warm-500">
                            {{ unclaimedTrucks.length }} truck{{
                                unclaimedTrucks.length > 1 ? 's' : ''
                            }}
                            non revendiqué{{
                                unclaimedTrucks.length > 1 ? 's' : ''
                            }}
                            — modifiables par tous, revendiquez le vôtre.
                        </p>
                    </div>
                    <span
                        class="text-warm-400 text-sm transition-transform"
                        :class="showUnclaimed ? 'rotate-180' : ''"
                        >▾</span
                    >
                </button>

                <div v-if="showUnclaimed" class="space-y-3">
                    <AppCard v-for="truck in unclaimedTrucks" :key="truck.id">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm-50"
                            >
                                <img
                                    v-if="truck.photo_url"
                                    :src="truck.photo_url"
                                    :alt="truck.name"
                                    class="h-full w-full object-cover"
                                />
                                <div
                                    v-else
                                    class="flex h-full w-full items-center justify-center text-xl"
                                >
                                    {{ truck.cuisine.emoji }}
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="truncate text-sm font-medium text-warm-900"
                                >
                                    {{ truck.name }}
                                </p>
                                <p class="text-xs text-warm-500">
                                    {{ truck.cuisine.name
                                    }}{{ truck.city ? ` · ${truck.city}` : '' }}
                                </p>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <Link :href="`/mon-truck/${truck.id}/editer`">
                                    <AppButton variant="secondary"
                                        >Modifier</AppButton
                                    >
                                </Link>
                                <button
                                    class="px-2 py-1 text-xs font-medium text-coral-400 transition-colors hover:text-coral-600"
                                    @click="claimTruck(truck.id, truck.name)"
                                >
                                    Revendiquer
                                </button>
                            </div>
                        </div>
                    </AppCard>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
