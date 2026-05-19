<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import AppButton from '../../Components/ui/AppButton.vue';
import AppLayout from '../../Layouts/AppLayout.vue';

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => form.post('/connexion');
</script>

<template>
    <AppLayout>
        <div
            class="flex min-h-[calc(100vh-56px)] items-start justify-center bg-warm-50 p-4 pt-12"
        >
            <div
                class="w-full max-w-sm rounded-xl border border-warm-200 bg-white p-6 shadow-sm"
            >
                <h1 class="mb-6 text-xl font-medium text-warm-900">
                    Connexion
                </h1>

                <form class="space-y-4" @submit.prevent="submit">
                    <div>
                        <label class="mb-1 block text-xs text-warm-500"
                            >Email</label
                        >
                        <input
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                        />
                        <p
                            v-if="form.errors.email"
                            class="mt-1 text-xs text-red-500"
                        >
                            {{ form.errors.email }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-1 block text-xs text-warm-500"
                            >Mot de passe</label
                        >
                        <input
                            v-model="form.password"
                            type="password"
                            autocomplete="current-password"
                            class="w-full rounded-md border border-warm-200 px-3 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-coral-400 focus:outline-none"
                        />
                        <p
                            v-if="form.errors.password"
                            class="mt-1 text-xs text-red-500"
                        >
                            {{ form.errors.password }}
                        </p>
                    </div>

                    <div class="flex items-center gap-2">
                        <input
                            id="remember"
                            v-model="form.remember"
                            type="checkbox"
                            class="h-5 w-5 rounded border-warm-200"
                        />
                        <label for="remember" class="text-xs text-warm-500"
                            >Se souvenir de moi</label
                        >
                    </div>

                    <AppButton
                        type="submit"
                        variant="primary"
                        class="w-full"
                        :disabled="form.processing"
                    >
                        {{ form.processing ? 'Connexion…' : 'Se connecter' }}
                    </AppButton>
                </form>

                <p class="mt-4 text-center text-xs text-warm-500">
                    Pas encore de compte ?
                    <Link
                        href="/inscription"
                        class="text-coral-400 hover:text-coral-600"
                        >Créer un compte</Link
                    >
                </p>
            </div>
        </div>
    </AppLayout>
</template>
