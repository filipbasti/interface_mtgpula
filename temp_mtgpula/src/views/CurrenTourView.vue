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
            <PlayerList :players="addedPlayers" />
            <button class="btn btn-primary mt-4" @click="startTournament">Start Tournament</button>
        </div>
    </div>
</div>
</template>

<script>    
import socket from '../warehouse/socket';
import PlayerList from '../components/PlayerList.vue';

export default {
    components: {
        PlayerList
    },
    data(){
       return{
        channel: "",
        join_code: this.$route.params.join_code,
        activeUsers: [],
        addedPlayers: []
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
            this.addedPlayers = resp.map(player => ({name: player.user_id}))
           
        }) .receive("error", (resp) => {
                console.error("Failed to start tournament:", resp);
            });
    },
    methods: {
        addUserToPlayersList(player) {
            this.channel.push("add_player",{user_id: player.id, deck: player.deck})
            .receive("ok", (resp) => {
                console.log("Player added:", resp);
                this.addedPlayers.push({name: resp.full_name})
            })
            .receive("error", (resp) => {
                console.error("Failed to add player:", resp);
            });
        },
        startTournament() {
            this.channel.push("start_tournament", {})
            .receive("ok", (resp) => {
                console.log("Tournament started:", resp);
            })
            .receive("error", (resp) => {
                console.error("Failed to start tournament:", resp);
            });
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