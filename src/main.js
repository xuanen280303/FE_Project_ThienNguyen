import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createPinia } from 'pinia';
import LoadingVue from './components/Loading.vue';
import viLocale from './utils/viLocale';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.component('Loading', LoadingVue);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    locale: viLocale
});

app.use(pinia);
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
