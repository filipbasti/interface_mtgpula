<template>
  <div class="container">
    <h1>Home</h1>
    <button @click="refreshToken">refresh</button>
  </div>

</template>
<script>

import { auth } from '../warehouse/auth';
export default {

  methods: {
    async refreshToken() {
      try {

       let token =  await auth.refreshToken()
        console.log('Refresh token:', token)
      } catch (error) {
        console.error('Refresh token failed:', error)
      }
    }
  }
}
</script>