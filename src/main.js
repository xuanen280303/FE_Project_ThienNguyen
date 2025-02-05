import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import notification from './utils/notification';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';
import { createPinia } from 'pinia';
import LoadingVue from './components/Loading.vue';

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
    }
});
app.config.globalProperties.$notification = notification;
app.use(pinia);
app.use(ToastService);

app.use(ConfirmationService);

app.mount('#app');
