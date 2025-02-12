<template>
    <div class="container mt-4">
        <h1 class="text-center">Welcome to the Tournament Room</h1>
        <p class="text-center">Your join code: <strong>{{ joinCode }}</strong></p>
        <div v-if="currentMatch" class="card shadow-sm mt-4">
            <div class="card-body">
                <h2 class="card-title">Match Details</h2>
                <div class="row">
                    <div class="col-md-6">
                        <h3>Player 1: {{ currentMatch.player1.user.full_name }}</h3>
                        <div class="mb-3">
                            <label for="player1Score" class="form-label">Player 1 Score:</label>
                            <input type="number" v-model="currentMatch.player_1_wins" id="player1Score" class="form-control" />
                        </div>
                        <div class="form-check mb-3">
                            <input type="checkbox" v-model="player1OnPlay" id="player1OnPlay" class="form-check-input" />
                            <label for="player1OnPlay" class="form-check-label">Player 1 on Play</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h3>Player 2: {{ currentMatch.player2.user.full_name }}</h3>
                        <div class="mb-3">
                            <label for="player2Score" class="form-label">Player 2 Score:</label>
                            <input type="number" v-model="currentMatch.player_2_wins" id="player2Score" class="form-control" />
                        </div>
                        <div class="form-check mb-3">
                            <input type="checkbox" v-model="player2OnPlay" id="player2OnPlay" class="form-check-input" />
                            <label for="player2OnPlay" class="form-check-label">Player 2 on Play</label>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary mt-4 w-100" @click="submitScores">Submit Scores</button>
            </div>
        </div>
    </div>
</template>

<script>
import socket from '../warehouse/socket';
import { tournament_channel } from '../warehouse/tournament_channel';
import { auth } from '../warehouse/auth';

export default {
    name: 'PlayerRoomView',
    data() {
        return {
            joinCode: '',
            matches: [],
            channel: null,
            authenticated: "",
            currentMatch: null,
            player2OnPlay: false,
            player1OnPlay: false
        };
    },
    watch: {
        'player1OnPlay'(newVal) {
            if (newVal) {
                this.player2OnPlay = false;
            }
        },
        'player2OnPlay'(newVal) {
            if (newVal) {
                this.player1OnPlay = false;
            }
        }
    },
    methods: {
        async getCurrentUser() {
            try {
                let response = await auth.current_user();
                this.authenticated = response;
            } catch (error) {
                console.error(error);
            }
        },
        async getCurrentPlayerMatch() {
            try {
                let matches = await tournament_channel.getCurrentMatches(this.channel);
                let match = matches.find(match => match.player1.user.id === this.authenticated.user.id || match.player2.user.id === this.authenticated.user.id);
                console.log(match);
                this.currentMatch = match;
                this.currentMatch.on_play_id == match.player1.id? this.player1OnPlay = true : this.player2OnPlay = true;
                return match;
            } catch (e) {
                console.error(e);
            }
        },
        async submitScores() {
            try {
                let params = {
                    id: this.currentMatch.id,
                    player_1_wins: this.currentMatch.player_1_wins,
                    player_2_wins: this.currentMatch.player_2_wins,
                    on_play_id: this.player1OnPlay ? this.currentMatch.player1.id : this.currentMatch.player2.id
                };
              
                console.log("Submitting scores:", params);
                await tournament_channel.updateMatch(this.channel, params);
            } catch (error) {
                console.error("Error submitting scores:", error);
            }
        },
        startTournament() {
            tournament_channel.startTournament(this.channel);
        }
    },
    async mounted() {
        await this.getCurrentUser();
        this.joinCode = this.$route.params.join_code;
        this.channel = socket.channel(`tournament:${this.$route.params.join_code}`);
        this.channel
            .join()
            .receive("ok", (resp) => {
                console.log("Joined successfully", resp);
                // You might receive initial active users list here
                if (resp.users) {
                    this.activeUsers = resp.users;
                }
            })
            .receive("error", (resp) => {
                console.log("Unable to join", resp);
            });
        this.channel.on("matches_prepared", (payload) => {
            console.log("Matches prepared:", payload);
            // Handle the matches prepared event
            // For example, you might want to update the state or notify the user
        });
        this.currentMatch = await this.getCurrentPlayerMatch();
    }
};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>