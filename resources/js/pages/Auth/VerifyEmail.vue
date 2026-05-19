<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '../../Layouts/AppLayout.vue'

const page = usePage<{ flash?: { success?: string } }>()
const form = useForm({})

const resend = () => form.post('/email/verification-notification')
</script>

<template>
    <AppLayout>
        <div class="min-h-[calc(100vh-56px)] bg-warm-50 flex items-start justify-center p-4 pt-12">
            <div class="w-full max-w-sm bg-white border border-warm-200 rounded-xl p-6 shadow-sm">
                <h1 class="text-xl font-medium text-warm-900 mb-4">Vérifiez votre email</h1>

                <p class="text-sm text-warm-900 mb-6">
                    Un lien de vérification a été envoyé à votre adresse email. Cliquez sur ce lien pour activer votre compte.
                </p>

                <div
                    v-if="page.props.flash?.success"
                    class="mb-4 text-sm text-open-600 bg-open-50 border border-open-600/20 rounded-md px-3 py-2"
                >
                    {{ page.props.flash.success }}
                </div>

                <button
                    type="button"
                    class="w-full bg-coral-400 hover:bg-coral-600 text-white text-sm rounded-md py-2 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                    :disabled="form.processing"
                    @click="resend"
                >
                    Renvoyer le lien de vérification
                </button>
            </div>
        </div>
    </AppLayout>
</template>
