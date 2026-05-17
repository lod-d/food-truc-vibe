<script setup lang="ts">
import { ref } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'
import AppLayout from '../../Layouts/AppLayout.vue'
import AppButton from '../../Components/ui/AppButton.vue'
import StepIndicator from '../../Components/Forms/StepIndicator.vue'
import Step1Info from '../../Components/Forms/Step1Info.vue'
import Step2Location from '../../Components/Forms/Step2Location.vue'
import Step3Schedule from '../../Components/Forms/Step3Schedule.vue'

const page = usePage<{ cuisines: any[] }>()

const STEPS = ['Mon truck', 'Emplacement', 'Horaires']
const currentStep = ref(1)

const form = useForm({
    // Step 1
    name:          '',
    cuisine_id:    '',
    description:   '',
    phone:         '',
    instagram_url: '',
    photo:         null as File | null,
    // Step 2
    address:       '',
    city:          '',
    latitude:      null as number | null,
    longitude:     null as number | null,
    place_name:    '',
    // Step 3
    days:          [] as number[],
    opens_at:      '',
    closes_at:     '',
    is_recurring:  true,
})

const step1Valid = () => form.name && form.cuisine_id
const step2Valid = () => form.address && form.latitude !== null && form.longitude !== null
const step3Valid = () => form.days.length > 0 && form.opens_at && form.closes_at

const next = () => {
    if (currentStep.value === 1 && !step1Valid()) return
    if (currentStep.value === 2 && !step2Valid()) return
    currentStep.value++
}

const prev = () => {
    if (currentStep.value > 1) currentStep.value--
}

const submit = () => {
    form.post('/trucks', {
        forceFormData: true,
    })
}
</script>

<template>
    <AppLayout>
        <div class="min-h-[calc(100vh-56px)] bg-warm-50 flex items-start justify-center p-4 pt-8">
            <div class="w-full max-w-lg bg-white border border-warm-200 rounded-xl p-6 shadow-sm">
                <h1 class="text-2xl font-medium text-warm-900 mb-6">Enregistrer mon truck</h1>

                <StepIndicator :steps="STEPS" :current="currentStep" class="mb-8" />

                <form @submit.prevent="submit">
                    <Step1Info v-if="currentStep === 1" :form="form" :cuisines="page.props.cuisines" />
                    <Step2Location v-else-if="currentStep === 2" :form="form" />
                    <Step3Schedule v-else-if="currentStep === 3" :form="form" />

                    <!-- Navigation -->
                    <div class="flex items-center justify-between mt-8 pt-6 border-t border-warm-200">
                        <AppButton
                            v-if="currentStep > 1"
                            variant="secondary"
                            @click="prev"
                        >
                            ← Retour
                        </AppButton>
                        <div v-else />

                        <AppButton
                            v-if="currentStep < 3"
                            variant="primary"
                            @click="next"
                        >
                            Suivant →
                        </AppButton>
                        <AppButton
                            v-else
                            type="submit"
                            variant="primary"
                            :disabled="form.processing || !step3Valid()"
                        >
                            {{ form.processing ? 'Enregistrement…' : 'Enregistrer mon truck' }}
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
