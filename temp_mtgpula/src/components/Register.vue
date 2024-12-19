<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm mt-5">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Register</h2>
            
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-user"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    v-model="username"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div class="mb-3">
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
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword" 
                    v-model="confirmPassword"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg">
                  Register
                </button>
              </div>

              <p class="text-center mt-3 mb-0">
                Already have an account? 
                <router-link to="/login" class="text-primary text-decoration-none">
                  Login
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
import { auth } from "../warehouse/auth";
export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      confirmPassword: ''   
    }
  },
  methods: {
    handleSubmit() {
      // Add your registration logic here
      if(this.password !== this.confirmPassword){
        alert("Passwords do not match");
        return;
      }
      let userDetail = {
        username: this.username,
        email: this.email,
        password: this.password
      }
    
      try{
      auth.signup(userDetail)
      this.$router.push('/');
      }catch(error){
        console.error('Error during registration:', error);
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
</style>

