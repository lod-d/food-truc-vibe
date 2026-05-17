<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import AppButton from '../../Components/ui/AppButton.vue'
import AppLayout from '../../Layouts/AppLayout.vue'

const form = useForm({
    name:                  '',
    email:                 '',
    password:              '',
    password_confirmation: '',
})

const submit = () => form.post('/inscription')
</script>

<template>
    <AppLayout>
        <div class="min-h-[calc(100vh-56px)] bg-warm-50 flex items-start justify-center p-4 pt-12">
            <div class="w-full max-w-sm bg-white border border-warm-200 rounded-xl p-6 shadow-sm">
                <h1 class="text-xl font-medium text-warm-900 mb-6">Créer un compte</h1>

                <form class="space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="block text-xs text-warm-500 mb-1">Nom</label>
                        <input
                            v-model="form.name"
                            type="text"
                            autocomplete="name"
                            class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                        />
                        <p v-if="form.errors.name" class="text-xs text-red-500 mt-1">{{ form.errors.name }}</p>
                    </div>

                    <div>
                        <label class="block text-xs text-warm-500 mb-1">Email</label>
                        <input
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                        />
                        <p v-if="form.errors.email" class="text-xs text-red-500 mt-1">{{ form.errors.email }}</p>
                    </div>

                    <div>
                        <label class="block text-xs text-warm-500 mb-1">Mot de passe</label>
                        <input
                            v-model="form.password"
                            type="password"
                            autocomplete="new-password"
                            class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                        />
                        <p v-if="form.errors.password" class="text-xs text-red-500 mt-1">{{ form.errors.password }}</p>
                    </div>

                    <div>
                        <label class="block text-xs text-warm-500 mb-1">Confirmer le mot de passe</label>
                        <input
                            v-model="form.password_confirmation"
                            type="password"
                            autocomplete="new-password"
                            class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                        />
                    </div>

                    <AppButton type="submit" variant="primary" class="w-full" :disabled="form.processing">
                        {{ form.processing ? 'Création…' : 'Créer mon compte' }}
                    </AppButton>
                </form>

                <p class="text-xs text-warm-500 text-center mt-4">
                    Déjà un compte ?
                    <Link href="/connexion" class="text-coral-400 hover:text-coral-600">Se connecter</Link>
                </p>
            </div>
        </div>
    </AppLayout>
</template>
