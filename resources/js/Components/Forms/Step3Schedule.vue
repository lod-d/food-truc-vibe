<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- Inertia useForm est conçu pour être muté depuis les composants enfants */
defineProps<{ form: any }>();

const DAYS = [
    { label: 'Lun', value: 0 },
    { label: 'Mar', value: 1 },
    { label: 'Mer', value: 2 },
    { label: 'Jeu', value: 3 },
    { label: 'Ven', value: 4 },
    { label: 'Sam', value: 5 },
    { label: 'Dim', value: 6 },
];

const toggleDay = (form: any, day: number) => {
    const idx = form.days.indexOf(day);

    if (idx === -1) {
        form.days.push(day);
    } else {
        form.days.splice(idx, 1);
    }
};
</script>

<template>
    <div class="space-y-5">
        <!-- Sélection des jours -->
        <div>
            <label class="mb-2 block text-xs text-warm-500"
                >Jours de présence *</label
            >
            <div class="flex gap-2">
                <button
                    v-for="d in DAYS"
                    :key="d.value"
                    type="button"
                    class="flex-1 rounded-md border py-3 text-sm transition-colors duration-100"
                    :class="
                        form.days.includes(d.value)
                            ? 'border-coral-400 bg-coral-400 text-white'
                            : 'border-warm-200 text-warm-900 hover:bg-warm-50'
                    "
                    @click="toggleDay(form, d.value)"
                >
                    {{ d.label }}
                </button>
            </div>
            <p v-if="form.errors.days" class="mt-1 text-xs text-red-500">
                {{ form.errors.days }}
            </p>
        </div>

        <!-- Horaires -->
        <div class="flex gap-4">
            <div class="flex-1">
                <label class="mb-1 block text-xs text-warm-500"
                    >Ouverture *</label
                >
                <input
                    v-model="form.opens_at"
                    type="time"
                    class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                />
                <p
                    v-if="form.errors.opens_at"
                    class="mt-1 text-xs text-red-500"
                >
                    {{ form.errors.opens_at }}
                </p>
            </div>
            <div class="flex-1">
                <label class="mb-1 block text-xs text-warm-500"
                    >Fermeture *</label
                >
                <input
                    v-model="form.closes_at"
                    type="time"
                    class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                />
                <p
                    v-if="form.errors.closes_at"
                    class="mt-1 text-xs text-red-500"
                >
                    {{ form.errors.closes_at }}
                </p>
            </div>
        </div>

        <!-- Type récurrent / ponctuel -->
        <div>
            <label class="mb-2 block text-xs text-warm-500"
                >Type de présence</label
            >
            <div class="flex gap-3">
                <button
                    type="button"
                    class="flex-1 rounded-md border py-3 text-sm transition-colors duration-100"
                    :class="
                        form.is_recurring
                            ? 'border-coral-400 bg-coral-400 text-white'
                            : 'border-warm-200 text-warm-900 hover:bg-warm-50'
                    "
                    @click="form.is_recurring = true"
                >
                    Chaque semaine
                </button>
                <button
                    type="button"
                    class="flex-1 rounded-md border py-3 text-sm transition-colors duration-100"
                    :class="
                        !form.is_recurring
                            ? 'border-coral-400 bg-coral-400 text-white'
                            : 'border-warm-200 text-warm-900 hover:bg-warm-50'
                    "
                    @click="form.is_recurring = false"
                >
                    Date ponctuelle
                </button>
            </div>
        </div>
    </div>
</template>
