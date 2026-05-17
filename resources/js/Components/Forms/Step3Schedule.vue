<script setup lang="ts">
defineProps<{ form: any }>()

const DAYS = [
    { label: 'Lun', value: 0 },
    { label: 'Mar', value: 1 },
    { label: 'Mer', value: 2 },
    { label: 'Jeu', value: 3 },
    { label: 'Ven', value: 4 },
    { label: 'Sam', value: 5 },
    { label: 'Dim', value: 6 },
]

const toggleDay = (form: any, day: number) => {
    const idx = form.days.indexOf(day)

    if (idx === -1) {
        form.days.push(day)
    } else {
        form.days.splice(idx, 1)
    }
}
</script>

<template>
    <div class="space-y-5">
        <!-- Sélection des jours -->
        <div>
            <label class="block text-xs text-warm-500 mb-2">Jours de présence *</label>
            <div class="flex gap-2">
                <button
                    v-for="d in DAYS"
                    :key="d.value"
                    type="button"
                    class="flex-1 py-2 text-sm rounded-md border transition-colors duration-100"
                    :class="form.days.includes(d.value)
                        ? 'bg-coral-400 text-white border-coral-400'
                        : 'border-warm-200 text-warm-900 hover:bg-warm-50'"
                    @click="toggleDay(form, d.value)"
                >
                    {{ d.label }}
                </button>
            </div>
            <p v-if="form.errors.days" class="text-xs text-red-500 mt-1">{{ form.errors.days }}</p>
        </div>

        <!-- Horaires -->
        <div class="flex gap-4">
            <div class="flex-1">
                <label class="block text-xs text-warm-500 mb-1">Ouverture *</label>
                <input
                    v-model="form.opens_at"
                    type="time"
                    class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                />
                <p v-if="form.errors.opens_at" class="text-xs text-red-500 mt-1">{{ form.errors.opens_at }}</p>
            </div>
            <div class="flex-1">
                <label class="block text-xs text-warm-500 mb-1">Fermeture *</label>
                <input
                    v-model="form.closes_at"
                    type="time"
                    class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                />
                <p v-if="form.errors.closes_at" class="text-xs text-red-500 mt-1">{{ form.errors.closes_at }}</p>
            </div>
        </div>

        <!-- Type récurrent / ponctuel -->
        <div>
            <label class="block text-xs text-warm-500 mb-2">Type de présence</label>
            <div class="flex gap-3">
                <button
                    type="button"
                    class="flex-1 py-2 text-sm rounded-md border transition-colors duration-100"
                    :class="form.is_recurring
                        ? 'bg-coral-400 text-white border-coral-400'
                        : 'border-warm-200 text-warm-900 hover:bg-warm-50'"
                    @click="form.is_recurring = true"
                >
                    Chaque semaine
                </button>
                <button
                    type="button"
                    class="flex-1 py-2 text-sm rounded-md border transition-colors duration-100"
                    :class="!form.is_recurring
                        ? 'bg-coral-400 text-white border-coral-400'
                        : 'border-warm-200 text-warm-900 hover:bg-warm-50'"
                    @click="form.is_recurring = false"
                >
                    Date ponctuelle
                </button>
            </div>
        </div>
    </div>
</template>
