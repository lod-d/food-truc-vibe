import { ref } from 'vue';

const KEY = 'demo-banner-dismissed';

const dismissed = ref(
    typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem(KEY) === '1',
);

export function useDemoBanner() {
    const dismiss = () => {
        dismissed.value = true;
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(KEY, '1');
        }
    };

    return { dismissed, dismiss };
}
