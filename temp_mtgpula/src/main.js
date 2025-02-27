import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { auth } from './warehouse/auth'
import socketService from './warehouse/socketService'
createApp(App).use(router).mount('#app')




const token = auth.getUser();


if (token !== null) {
  socketService.connectSocket(token);
  auth. startTokenRefreshTimer();
 
}




import 'bootstrap/dist/js/bootstrap.js'