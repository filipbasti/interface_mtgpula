

<template><div>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">MTGPula</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/about">About</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/tournament/join">Tournament</router-link>
        </li>
       
      </ul>
      <ul class="d-flex navbar-nav" > 
        <li class="dropdown " v-if="authenticated">
          <img class="nav-link dropdown-toggle rounded-circle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" src="https://github.com/twbs.png" alt="Bootstrap" style="width: 3rem" >
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/login" v-if="!authenticated">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register" v-if="!authenticated">Register</router-link>
        </li>
       
      </ul>
    </div>
  </div>
</nav>
     
 
<RouterView />
</div>
</template>
<script>
import { authenticated } from './warehouse/store'
import { auth } from './warehouse/auth'

export default {
  data() {
    return { authenticated }
  },
 async mounted() {
   


  },
  methods:{
    logout(){
      auth.logout();
      this.authenticated = false;
    }
  }
}
</script>