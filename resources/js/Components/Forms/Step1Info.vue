<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    form: any
    cuisines: Array<{ id: string; name: string; emoji: string; slug: string }>
}>()

const duplicateWarning = ref(false)
let nameCheckTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.form.name, (val) => {
    duplicateWarning.value = false

    if (nameCheckTimer) {
clearTimeout(nameCheckTimer)
}

    if (!val || val.trim().length < 3) {
return
}

    nameCheckTimer = setTimeout(async () => {
        const res = await fetch(`/api/trucks/check-name?name=${encodeURIComponent(val.trim())}`)
        const json = await res.json()
        duplicateWarning.value = json.exists
    }, 400)
})
</script>

<template>
    <div class="space-y-5">
        <!-- Nom -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Nom du food truck *</label>
            <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Burger Bros"
                class="w-full border border-warm-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent placeholder:text-warm-500"
                :class="duplicateWarning ? 'border-amber-400 focus:ring-amber-400' : ''"
            />
            <p v-if="form.errors.name" class="text-xs text-red-500 mt-1">{{ form.errors.name }}</p>
            <p v-else-if="duplicateWarning" class="text-xs text-amber-600 mt-1">
                Un truck avec ce nom existe déjà. Vérifiez avant de continuer.
            </p>
        </div>

        <!-- Type de cuisine -->
        <div>
            <label class="block text-xs text-warm-500 mb-2">Type de cuisine *</label>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="c in cuisines"
                    :key="c.id"
                    type="button"
                    class="text-sm rounded-full px-4 py-2.5 border transition-colors duration-100"
                    :class="form.cuisine_id === c.id
                        ? 'bg-coral-400 text-white border-coral-400'
                        : 'border-warm-200 text-warm-900 hover:bg-warm-50'"
                    @click="form.cuisine_id = c.id"
                >
                    {{ c.emoji }} {{ c.name }}
                </button>
            </div>
            <p v-if="form.errors.cuisine_id" class="text-xs text-red-500 mt-1">{{ form.errors.cuisine_id }}</p>
        </div>

        <!-- Description -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Description</label>
            <textarea
                v-model="form.description"
                rows="3"
                placeholder="Décrivez votre cuisine, vos spécialités..."
                class="w-full border border-warm-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent placeholder:text-warm-500 resize-none"
            />
        </div>

        <!-- Email -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Email (pour recevoir une confirmation)</label>
            <input
                v-model="form.email"
                type="email"
                placeholder="contact@montruck.fr"
                class="w-full border border-warm-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent placeholder:text-warm-500"
            />
            <p v-if="form.errors.email" class="text-xs text-red-500 mt-1">{{ form.errors.email }}</p>
        </div>

        <!-- Photo -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Photo (optionnel)</label>
            <input
                type="file"
                accept="image/*"
                class="w-full text-sm text-warm-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-coral-50 file:text-coral-600 hover:file:bg-coral-50"
                @change="(e) => form.photo = (e.target as HTMLInputElement).files?.[0] ?? null"
            />
        </div>

        <!-- Téléphone -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Téléphone</label>
            <input
                v-model="form.phone"
                type="tel"
                placeholder="06 12 34 56 78"
                class="w-full border border-warm-200 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent placeholder:text-warm-500"
            />
        </div>

        <!-- Instagram -->
        <div>
            <label class="block text-xs text-warm-500 mb-1">Instagram</label>
            <div class="flex items-center border border-warm-200 rounded-md focus-within:ring-2 focus-within:ring-coral-400 focus-within:border-transparent">
                <span class="pl-3 text-sm text-warm-500">@</span>
                <input
                    v-model="form.instagram_url"
                    type="text"
                    placeholder="monburgertruck"
                    class="flex-1 px-2 py-3 text-sm focus:outline-none rounded-md"
                />
            </div>
        </div>
    </div>
</template>
