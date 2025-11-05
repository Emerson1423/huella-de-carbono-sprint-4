import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de que esta línea existe
import './Responsive.css';//
const app = createApp(App);
app.use(router); // Usa el router
app.mount('#app');