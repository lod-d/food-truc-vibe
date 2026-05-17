<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import AppButton from '../../Components/ui/AppButton.vue'
import AppLayout from '../../Layouts/AppLayout.vue'

const form = useForm({
    email:    '',
    password: '',
    remember: false,
})

const submit = () => form.post('/connexion')
</script>

<template>
    <AppLayout>
        <div class="min-h-[calc(100vh-56px)] bg-warm-50 flex items-start justify-center p-4 pt-12">
            <div class="w-full max-w-sm bg-white border border-warm-200 rounded-xl p-6 shadow-sm">
                <h1 class="text-xl font-medium text-warm-900 mb-6">Connexion</h1>

                <form class="space-y-4" @submit.prevent="submit">
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
                            autocomplete="current-password"
                            class="w-full border border-warm-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-400 focus:border-transparent"
                        />
                        <p v-if="form.errors.password" class="text-xs text-red-500 mt-1">{{ form.errors.password }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <input id="remember" v-model="form.remember" type="checkbox" class="rounded border-warm-200" />
                        <label for="remember" class="text-xs text-warm-500">Se souvenir de moi</label>
                    </div>

                    <AppButton type="submit" variant="primary" class="w-full" :disabled="form.processing">
                        {{ form.processing ? 'Connexion…' : 'Se connecter' }}
                    </AppButton>
                </form>

                <p class="text-xs text-warm-500 text-center mt-4">
                    Pas encore de compte ?
                    <Link href="/inscription" class="text-coral-400 hover:text-coral-600">Créer un compte</Link>
                </p>
            </div>
        </div>
    </AppLayout>
</template>
