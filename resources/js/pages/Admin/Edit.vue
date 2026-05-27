<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3';
import { usePage } from '@inertiajs/vue3';
import Step1Info from '../../Components/Forms/Step1Info.vue';
import Step2Location from '../../Components/Forms/Step2Location.vue';
import Step3Schedule from '../../Components/Forms/Step3Schedule.vue';
import AppButton from '../../Components/ui/AppButton.vue';
import AppLayout from '../../Layouts/AppLayout.vue';

const props = defineProps<{
    truck: {
        id: string;
        name: string;
        cuisine_id: string;
        description: string | null;
        email: string | null;
        phone: string | null;
        instagram_url: string | null;
        photo_url: string | null;
        address: string;
        city: string;
        latitude: number | null;
        longitude: number | null;
        place_name: string | null;
        days: number[];
        opens_at: string;
        closes_at: string;
        is_recurring: boolean;
    };
}>();

const page = usePage<{ cuisines: any[] }>();

const form = useForm({
    name: props.truck.name,
    cuisine_id: props.truck.cuisine_id,
    description: props.truck.description ?? '',
    email: props.truck.email ?? '',
    phone: props.truck.phone ?? '',
    instagram_url: props.truck.instagram_url ?? '',
    photo: null as File | null,
    address: props.truck.address,
    city: props.truck.city,
    latitude: props.truck.latitude,
    longitude: props.truck.longitude,
    place_name: props.truck.place_name ?? '',
    days: [...props.truck.days],
    opens_at: props.truck.opens_at,
    closes_at: props.truck.closes_at,
    is_recurring: props.truck.is_recurring,
});

// PUT/PATCH/DELETE ne supportent pas multipart/form-data — on POST avec _method spoofing
// pour que l'upload de photo soit correctement transmis.
const submit = () => {
    form.transform((data) => ({ ...data, _method: 'put' })).post(
        `/mon-truck/${props.truck.id}`,
        { forceFormData: true },
    );
};
</script>

<template>
    <AppLayout>
        <div class="mx-auto max-w-lg px-4 py-8">
            <div class="mb-6 flex items-center gap-3">
                <Link
                    href="/mon-truck"
                    class="text-sm text-warm-500 hover:text-warm-900"
                    >← Mes trucks</Link
                >
                <span class="text-warm-200">·</span>
                <h1 class="text-xl font-medium text-warm-900">
                    Modifier {{ truck.name }}
                </h1>
            </div>

            <form class="space-y-8" @submit.prevent="submit">
                <!-- Section 1 -->
                <div>
                    <h2
                        class="mb-4 text-xs font-medium tracking-wide text-warm-500 uppercase"
                    >
                        Informations
                    </h2>
                    <div class="rounded-xl border border-warm-200 bg-white p-5">
                        <Step1Info
                            :form="form"
                            :cuisines="page.props.cuisines"
                        />
                    </div>
                </div>

                <!-- Section 2 -->
                <div>
                    <h2
                        class="mb-4 text-xs font-medium tracking-wide text-warm-500 uppercase"
                    >
                        Emplacement
                    </h2>
                    <div class="rounded-xl border border-warm-200 bg-white p-5">
                        <Step2Location :form="form" />
                    </div>
                </div>

                <!-- Section 3 -->
                <div>
                    <h2
                        class="mb-4 text-xs font-medium tracking-wide text-warm-500 uppercase"
                    >
                        Horaires
                    </h2>
                    <div class="rounded-xl border border-warm-200 bg-white p-5">
                        <Step3Schedule :form="form" />
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <Link href="/mon-truck">
                        <AppButton variant="secondary">Annuler</AppButton>
                    </Link>
                    <AppButton
                        type="submit"
                        variant="primary"
                        :disabled="form.processing"
                    >
                        {{
                            form.processing
                                ? 'Enregistrement…'
                                : 'Enregistrer les modifications'
                        }}
                    </AppButton>
                </div>

                <div
                    v-if="Object.keys(form.errors).length > 0"
                    class="text-center text-xs text-red-500"
                >
                    Corrigez les erreurs avant de soumettre.
                </div>
            </form>
        </div>
    </AppLayout>
</template>
