<script setup lang="ts">
/* eslint-disable vue/no-mutating-props -- Inertia useForm est conçu pour être muté depuis les composants enfants */
import { ref, watch } from 'vue';

const props = defineProps<{
    form: any;
    cuisines: Array<{ id: string; name: string; emoji: string; slug: string }>;
}>();

const duplicateWarning = ref(false);
let nameCheckTimer: ReturnType<typeof setTimeout> | null = null;

watch(
    () => props.form.name,
    (val) => {
        duplicateWarning.value = false;

        if (nameCheckTimer) {
            clearTimeout(nameCheckTimer);
        }

        if (!val || val.trim().length < 3) {
            return;
        }

        nameCheckTimer = setTimeout(async () => {
            const res = await fetch(
                `/api/trucks/check-name?name=${encodeURIComponent(val.trim())}`,
            );
            const json = await res.json();
            duplicateWarning.value = json.exists;
        }, 400);
    },
);
</script>

<template>
    <div class="space-y-5">
        <!-- Nom -->
        <div>
            <label class="mb-1 block text-xs text-warm-500"
                >Nom du food truck *</label
            >
            <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Burger Bros"
                class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                :class="
                    duplicateWarning
                        ? 'border-amber-400 focus:ring-amber-400'
                        : ''
                "
            />
            <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">
                {{ form.errors.name }}
            </p>
            <p v-else-if="duplicateWarning" class="mt-1 text-xs text-amber-600">
                Un truck avec ce nom existe déjà. Vérifiez avant de continuer.
            </p>
        </div>

        <!-- Type de cuisine -->
        <div>
            <label class="mb-2 block text-xs text-warm-500"
                >Type de cuisine *</label
            >
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="c in cuisines"
                    :key="c.id"
                    type="button"
                    class="rounded-full border px-4 py-2.5 text-sm transition-colors duration-100"
                    :class="
                        form.cuisine_id === c.id
                            ? 'border-coral-400 bg-coral-400 text-white'
                            : 'border-warm-200 text-warm-900 hover:bg-warm-50'
                    "
                    @click="form.cuisine_id = c.id"
                >
                    {{ c.emoji }} {{ c.name }}
                </button>
            </div>
            <p v-if="form.errors.cuisine_id" class="mt-1 text-xs text-red-500">
                {{ form.errors.cuisine_id }}
            </p>
        </div>

        <!-- Description -->
        <div>
            <label class="mb-1 block text-xs text-warm-500">Description</label>
            <textarea
                v-model="form.description"
                rows="3"
                placeholder="Décrivez votre cuisine, vos spécialités..."
                class="w-full resize-none rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
            />
        </div>

        <!-- Email -->
        <div>
            <label class="mb-1 block text-xs text-warm-500"
                >Email (pour recevoir une confirmation)</label
            >
            <input
                v-model="form.email"
                type="email"
                placeholder="contact@montruck.fr"
                class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
            />
            <p v-if="form.errors.email" class="mt-1 text-xs text-red-500">
                {{ form.errors.email }}
            </p>
        </div>

        <!-- Photo -->
        <div>
            <label class="mb-1 block text-xs text-warm-500"
                >Photo (optionnel)</label
            >
            <input
                type="file"
                accept="image/*"
                class="w-full text-sm text-warm-500 file:mr-3 file:rounded-full file:border-0 file:bg-coral-50 file:px-3 file:py-1.5 file:text-xs file:text-coral-600 hover:file:bg-coral-50"
                @change="
                    (e) =>
                        (form.photo =
                            (e.target as HTMLInputElement).files?.[0] ?? null)
                "
            />
        </div>

        <!-- Téléphone -->
        <div>
            <label class="mb-1 block text-xs text-warm-500">Téléphone</label>
            <input
                v-model="form.phone"
                type="tel"
                placeholder="06 12 34 56 78"
                class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm placeholder:text-warm-500 focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
            />
        </div>

        <!-- Instagram -->
        <div>
            <label class="mb-1 block text-xs text-warm-500">Instagram</label>
            <div
                class="flex items-center rounded-md border border-warm-200 focus-within:border-transparent focus-within:ring-2 focus-within:ring-coral-400"
            >
                <span class="pl-3 text-sm text-warm-500">@</span>
                <input
                    v-model="form.instagram_url"
                    type="text"
                    placeholder="monburgertruck"
                    class="flex-1 rounded-md px-2 py-3 text-sm focus:outline-none"
                />
            </div>
        </div>
    </div>
</template>
