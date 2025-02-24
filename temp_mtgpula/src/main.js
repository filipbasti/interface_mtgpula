import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

createApp(App).use(router).mount('#app')


import socketService from './warehouse/socketService';

const token = localStorage.getItem('token');
if (token) {
    socketService.connect(token);
}
import 'bootstrap/dist/js/bootstrap.js'