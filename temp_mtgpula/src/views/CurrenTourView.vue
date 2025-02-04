<template>
<div class="container mt-4">
    <div class="row">
        <div class="col-md-6">
            <h3 class="text-center">CURRENT Tournament</h3>
            <div class="card mt-4">
                <div class="card-header">
                    <h4>Users applied:</h4>
                </div>
                <ul class="list-group list-group-flush">
                    <li v-for="player in activeUsers" :key="player.id" class="list-group-item d-flex justify-content-between align-items-center">
                      <div class="d-flex  align-items-center w-100">
                        <p class="mb-0 me-2"> {{ player.name }} </p>
                        <div class="d-flex align-items-center">
                          <span class="me-2">Deck:</span>
                          <input type="text" class="form-control me-3" v-model="player.deck" style="width: 150px;">
                        </div>
                      </div>
                      <button @click="addUserToPlayersList(player)" class="btn btn-sm btn-outline-secondary">Add</button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-4">
                <input type="text" v-model="searchEmail" class="form-control" placeholder="Search by email" @keyup.enter="searchUserByEmail">
                <button class="btn btn-primary mt-2" @click="addUserbyEmail">Search</button>
            </div>
            <PlayerList :players="addedPlayers" @remove-player="removePlayer" />
            <button class="btn btn-primary mt-4" @click="startTournament">Start Tournament</button>
        </div>
    </div>
</div>
</template>

<script>    
import socket from '../warehouse/socket';
import PlayerList from '../components/PlayerList.vue';
import {tournament_channel} from '../warehouse/tournament_channel';
export default {
    components: {
        PlayerList
    },
    data(){
       return{
        channel: "",
        join_code: this.$route.params.join_code,
        activeUsers: [],
        addedPlayers: [],
        searchEmail: ""
    } 
    },
    mounted(){
        this.channel = socket.channel(`tournament:${this.join_code}`)
        this.channel
        .join()
        .receive("ok", (resp) => {
          console.log("Joined successfully", resp)
          // You might receive initial active users list here
          if (resp.users) {
            this.activeUsers = resp.users
          }
        })
        .receive("error", (resp) => {
          console.log("Unable to join", resp)
        })
        // Listen for user presence updates
        this.channel.on("presence_state", state => {
            this.handlePresenceState(state)
        })
        this.channel.on("presence_diff", diff => {
            this.handlePresenceDiff(diff)
        })
        this.channel.push("get_players", {}).receive("ok", (resp) => {
            console.log("Players list:", resp);
            this.addedPlayers = resp.map(player => ({name: player.id}))
           
        }) .receive("error", (resp) => {
                console.error("Failed to start tournament:", resp);
            });
    },
    methods: {
        addUserToPlayersList(player) {
            tournament_channel.addUserToPlayersList(player, this.channel, this.addedPlayers)
        },
        removePlayer(player) {
            tournament_channel.removePlayer(player, this.channel, this.addedPlayers)
        },
        searchUserByEmail() {
            tournament_channel.getUserByEmail(this.searchEmail, this.channel)
        },
        async addUserbyEmail() {
            try {
                const userId = await tournament_channel.getUserByEmail(this.searchEmail, this.channel)
                tournament_channel.addUserToPlayersList({id: userId, deck: "asdfasgfad"}, this.channel, this.addedPlayers)
                // You can now add the user to the players list or perform other actions
            } catch (error) {
                console.error("Error finding user by email:", error)
            }
        },
        handlePresenceState(state) {
            // Convert presence state to array of users
            console.log(state)
            this.activeUsers = Object.entries(state).map(([key, presence]) => ({
                id: key,
                name: presence.metas[0].user_name
            }))
        },
        handlePresenceDiff(diff) {
            // Handle users joining
            diff.joins && Object.entries(diff.joins).forEach(([key, presence]) => {
                this.activeUsers.push({
                    id: key,
                    name: presence.metas[0].user_name
                })
            })
            // Handle users leaving
            diff.leaves && Object.keys(diff.leaves).forEach(key => {
                this.activeUsers = this.activeUsers.filter(user => user.id !== key)
            })
        }
    }
}
</script>