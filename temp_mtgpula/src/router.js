import { createWebHistory, createRouter } from 'vue-router'
import { auth } from './warehouse/auth'
import Home from './views/Home.vue'   
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import TournamentView from './views/TournamentView.vue'
import CurrenTourView from './views/CurrenTourView.vue'
import { authenticated } from './warehouse/store'

const routes = [
  { path: '/', component: Home }, 
  { path: '/register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/tournament', name: 'Tournament', component: TournamentView },
  { path: '/tournament/active/:join_code', name: 'CurrenTour', component: CurrenTourView},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  const javneStranice = ["/login", "/register"];
 
  const loginPotreban = !javneStranice.includes(to.path);

  let user = auth.getUser();  
  authenticated.value = user;

  if (loginPotreban && !user) {
    next("/login");
    return;
  }
  
  next();
});

export default router