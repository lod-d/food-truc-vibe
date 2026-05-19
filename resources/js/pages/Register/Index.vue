<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';
import Step1Info from '../../Components/Forms/Step1Info.vue';
import Step2Location from '../../Components/Forms/Step2Location.vue';
import Step3Schedule from '../../Components/Forms/Step3Schedule.vue';
import StepIndicator from '../../Components/Forms/StepIndicator.vue';
import AppButton from '../../Components/ui/AppButton.vue';
import AppLayout from '../../Layouts/AppLayout.vue';

const page = usePage<{ cuisines: any[] }>();

const STEPS = ['Mon truck', 'Emplacement', 'Horaires'];
const currentStep = ref(1);

const form = useForm({
    // Step 1
    name: '',
    cuisine_id: '',
    description: '',
    email: '',
    phone: '',
    instagram_url: '',
    photo: null as File | null,
    // Step 2
    address: '',
    city: '',
    latitude: null as number | null,
    longitude: null as number | null,
    place_name: '',
    // Step 3
    days: [] as number[],
    opens_at: '',
    closes_at: '',
    is_recurring: true,
});

const step1Valid = () => form.name && form.cuisine_id;
const step2Valid = () =>
    form.address && form.latitude !== null && form.longitude !== null;
const step3Valid = () =>
    form.days.length > 0 && form.opens_at && form.closes_at;

const next = () => {
    if (currentStep.value === 1 && !step1Valid()) {
        return;
    }

    if (currentStep.value === 2 && !step2Valid()) {
        return;
    }

    currentStep.value++;
};

const prev = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
    }
};

const step1Fields = [
    'name',
    'cuisine_id',
    'description',
    'email',
    'phone',
    'instagram_url',
    'photo',
];
const step2Fields = ['address', 'city', 'latitude', 'longitude', 'place_name'];

const submit = () => {
    form.post('/trucks', {
        forceFormData: true,
        onError: (errors) => {
            if (step1Fields.some((f) => f in errors)) {
                currentStep.value = 1;
            } else if (step2Fields.some((f) => f in errors)) {
                currentStep.value = 2;
            }
        },
    });
};
</script>

<template>
    <AppLayout>
        <div
            class="flex min-h-[calc(100vh-56px)] items-start justify-center bg-warm-50 p-4 pt-8"
        >
            <div
                class="w-full max-w-lg rounded-xl border border-warm-200 bg-white p-6 shadow-sm"
            >
                <h1 class="mb-6 text-2xl font-medium text-warm-900">
                    Enregistrer mon truck
                </h1>

                <StepIndicator
                    :steps="STEPS"
                    :current="currentStep"
                    class="mb-8"
                />

                <form @submit.prevent="submit">
                    <Step1Info
                        v-if="currentStep === 1"
                        :form="form"
                        :cuisines="page.props.cuisines"
                    />
                    <Step2Location v-else-if="currentStep === 2" :form="form" />
                    <Step3Schedule v-else-if="currentStep === 3" :form="form" />

                    <!-- Navigation -->
                    <div
                        class="mt-8 flex items-center justify-between border-t border-warm-200 pt-6"
                    >
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
                            {{
                                form.processing
                                    ? 'Enregistrement…'
                                    : 'Enregistrer mon truck'
                            }}
                        </AppButton>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
