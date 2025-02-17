<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm mt-5">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>
            
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    v-model="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div class="mb-4 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="rememberMe" 
                  v-model="rememberMe"
                />
                <label class="form-check-label" for="rememberMe">Remember me</label>
                <router-link to="/forgot-password" class="float-end text-primary text-decoration-none">
                  Forgot Password?
                </router-link>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg" >
                  Login
                </button>
              </div>

              <p class="text-center mt-3 mb-0">
                Don't have an account? 
                <router-link to="/register" class="text-primary text-decoration-none">
                  Register
                </router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../warehouse/auth';


export default {
  data() {
    return {
      email: '',
      password: '',

      rememberMe: false
    }
  },
  methods: {
   async handleLogin() {
      // Add your login logic here

      try {
        await auth.login(this.email, this.password)
        this.$router.push('/');
       
     
      }
      catch (error) {
        console.error('Login failed:', error);
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
  border: none;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}

.input-group .form-control:focus + .input-group-text {
  border-color: #ced4da;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
