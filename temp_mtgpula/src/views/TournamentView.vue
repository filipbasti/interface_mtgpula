<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Create Tournament</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleCreateTournament">
              <div class="mb-3">
                <label for="tournamentName" class="form-label">Tournament Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="tournamentName"
                  v-model="tournament.name"
                  placeholder="Enter tournament name"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="numberOfRounds" class="form-label">Number of Rounds</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="numberOfRounds"
                  v-model="tournament.number_of_rounds"
                  min="1"
                  max="10"
                  required
                />
                <div class="form-text">Choose between 1 and 10 rounds</div>
              </div>

             

              <div class="d-grid gap-2">
                <button  class="btn btn-primary" >
                  <i class="fas fa-trophy me-2"></i>Create Tournament
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                  <i class="fas fa-undo me-2"></i>Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

     
      </div>
    </div>
  </div>
</template>

<script>
import { tournament } from '../warehouse/tournament'    
export default {
  name: 'TournamentView',
  data() {
    return {
      tournament: {
        name: '',
        finished: false,
        current_round: 0,
        number_of_rounds: 5
      }
    }
  },
  methods: {
    handleCreateTournament() {
     
  tournament.createTournament({tournament:{...this.tournament}})  
     console.log("uspio")
      // Add your API call here
    },
    resetForm() {
      this.tournament = {
        name: '',
        finished: false,
        current_round: 0,
        number_of_rounds: 5
      }
    }
  }
}
</script>

<style scoped>
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.card {
  border: none;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  padding: 0.75rem;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #6c757d;
  border-color: #6c757d;
}
</style>
