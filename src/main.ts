// [AI_START TIMESTAMP=2025-06-15 12:00:00]
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './style.css';

console.log('%c N1P MaaS SOP UI ', 'background: #000000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;');

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

const auth = useAuthStore();
auth.restoreSession();

app.use(router);
app.mount('#app');
// [AI_END LINES=25 TIMESTAMP=2025-06-15 12:00:00]
