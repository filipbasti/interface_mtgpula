<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h1 class="display-4">Welcome to MTGPula</h1>
        <p class="lead">Your ultimate tournament management platform</p>
        <button @click="$router.push('/tournament/join')" class="btn btn-primary btn-lg mt-3">Get me started</button>
      </div>
    </div>
  </div>
</template>

<script>



export default {

}
</script>

<style scoped>
.container {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

h1 {
  color: #343a40;
}

.lead {
  color: #6c757d;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
</style>