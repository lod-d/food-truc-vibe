<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '../../Layouts/AppLayout.vue';

const page = usePage<{ flash?: { success?: string } }>();
const form = useForm({});

const resend = () => form.post('/email/verification-notification');
</script>

<template>
    <AppLayout>
        <div
            class="flex min-h-[calc(100vh-56px)] items-start justify-center bg-warm-50 p-4 pt-12"
        >
            <div
                class="w-full max-w-sm rounded-xl border border-warm-200 bg-white p-6 shadow-sm"
            >
                <h1 class="mb-4 text-xl font-medium text-warm-900">
                    Vérifiez votre email
                </h1>

                <p class="mb-6 text-sm text-warm-900">
                    Un lien de vérification a été envoyé à votre adresse email.
                    Cliquez sur ce lien pour activer votre compte.
                </p>

                <div
                    v-if="page.props.flash?.success"
                    class="mb-4 rounded-md border border-open-600/20 bg-open-50 px-3 py-2 text-sm text-open-600"
                >
                    {{ page.props.flash.success }}
                </div>

                <button
                    type="button"
                    class="w-full rounded-md bg-coral-400 py-2 text-sm text-white transition-colors hover:bg-coral-600"
                    :class="{
                        'cursor-not-allowed opacity-50': form.processing,
                    }"
                    :disabled="form.processing"
                    @click="resend"
                >
                    Renvoyer le lien de vérification
                </button>
            </div>
        </div>
    </AppLayout>
</template>
