<template>
    <div class="container ">
        <div class="row mt-3">
        <div class="col">
            <div class="card text-center mb-3">
                <div class="card-body shadow">
                <h3 class="card-title my-5">Join as a player</h3>
                <p class="card-text my-5">Enter tournament code to enter</p>
                <input type="text" v-model="playerRoomCode" class="form-control-sm me-2 mb-5" placeholder="Enter code">
                <a href="#" @click="joinPlayerRoom" class="btn btn-primary">Join</a>
            </div>
                
            
            </div>
          
        </div>
        <div class="col ">
            <div class="card text-center shadow">
                <div class="card-body ">
                <h3 class="card-title my-5">Create or join existing as organiser</h3>
                <p class="card-text my-5">Enter tournament code to enter as organiser</p>
                <div><input v-model="adminCode" type="text" class="form-control-sm me-2 mb-3" placeholder="Enter code">
                <a href="#" class="btn btn-primary" @click="joinActive">Join</a>
            </div>
            <p class="card-text ">Or</p>
            <router-link to="/tournament"><a href="#" class="btn btn-primary">Create new </a> </router-link>
            </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>


export default {
    name: 'JoinTournamentView',
    methods:{
        joinActive(){
            this.$router.push('/tournament/active/'+this.adminCode)
        },
        joinPlayerRoom(){
            this.$router.push('/player-room/'+this.playerRoomCode)
        }
    },
    data(){
        return{
           adminCode: "",
           playerRoomCode: ""
        } 
    },
};
</script>

<style scoped>



</style>