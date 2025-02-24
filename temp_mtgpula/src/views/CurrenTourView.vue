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
                    <input type="text" v-model="searchEmail" class="form-control" placeholder="Search by email" @keyup.enter="addUserbyEmail">
                    <input type="text" v-model="deck" class="form-control" placeholder="Deck"  @keyup.enter="addUserbyEmail">
                    <button class="btn btn-primary mt-2" @click="addUserbyEmail">Search</button>
                </div>
                <PlayerList :players="addedPlayers" @remove-player="removePlayer" />
                <button class="btn btn-primary mt-4" @click="startTournament">Start Tournament</button>
            </div>
        </div>
    </div>
</template>

<script>
import socketService from '../warehouse/socketService';
import PlayerList from '../components/PlayerList.vue';
import { tournament_channel } from '../warehouse/tournament_channel';

export default {
    components: {
        PlayerList
    },
    data() {
        return {
            channel: null,
            join_code: this.$route.params.join_code,
            activeUsers: [],
            addedPlayers: [],
            searchEmail: "",
            deck: ""
        };
    },
    async mounted() {
        try {
            let res = await socketService.joinChannel(`tournament:${this.join_code}`, {});
            if (res.users) {
                this.activeUsers = res.users;
            }
        } catch (e) {
            console.log(e);
        }

        socketService.onPresenceSync((activeUsers) => {
            this.activeUsers = activeUsers;
        });

        socketService.onPresenceJoin((id, current, newPresence) => {
            if (!current) {
                console.log("User joined:", newPresence);
            } else {
                console.log("User updated:", newPresence);
            }
        });

        socketService.onPresenceLeave((id, current, leftPresence) => {
            if (current.metas.length === 0) {
                console.log("User left:", leftPresence);
            } else {
                console.log("User updated:", leftPresence);
            }
        });

        this.addedPlayers = await tournament_channel.getPlayers();
    },
    methods: {
        async startTournament() {
            try {
                await tournament_channel.prepareRound();
                console.log("Navigating to organiser-room with join_code:", this.join_code);
                this.$router.push(`/organiser-room/${this.join_code}`);
            } catch (error) {
                console.error("Error starting tournament:", error);
            }
        },
        async addUserToPlayersList(player) {
            try {
                let res = await tournament_channel.addUserToPlayersList(player);
                console.log("User added to players list:", res);
                this.addedPlayers.push(res);
            } catch (e) {
                console.log(e);
            }
        },
        async removePlayer(player) {
            try {
                await tournament_channel.removePlayer(player, this.addedPlayers);
            } catch (error) {
                console.error("Error removing player:", error);
            }
        },
        async searchUserByEmail() {
            try {
                const userId = await tournament_channel.getUserByEmail(this.searchEmail);
                console.log("User found:", userId);
            } catch (error) {
                console.error("Error finding user by email:", error);
            }
        },
        async addUserbyEmail() {
            try {
                const userId = await tournament_channel.getUserByEmail(this.searchEmail);
                const player = { id: userId, deck: this.deck };
                await this.addUserToPlayersList(player);
            } catch (error) {
                console.error("Error finding user by email:", error);
            }
        }
    }
};
</script>