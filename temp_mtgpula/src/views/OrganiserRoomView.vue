<template>
    <div class="container mt-4">
        <h1 class="text-center">Tournament Management</h1>
        <p class="text-center">Your join code: <strong>{{ joinCode }}</strong></p>
        <div v-if="matches.length" class="card shadow-sm mt-4">
            <div class="card-body">
                <h2 class="card-title">All Rounds</h2>
                <div v-for="match in matches" :key="match.id" class="mb-4">
                    <h3>Round {{ match.round }}</h3>
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Player 1: {{ match.player1.user.full_name }}</h4>
                            <div class="mb-3">
                                <label for="player1Score" class="form-label">Player 1 Score:</label>
                                <input type="number" v-model="match.player_1_wins" id="player1Score" class="form-control" />
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" v-model="match.player1OnPlay" id="player1OnPlay" class="form-check-input" />
                                <label for="player1OnPlay" class="form-check-label">Player 1 on Play</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4>Player 2: {{ match.player2.user.full_name }}</h4>
                            <div class="mb-3">
                                <label for="player2Score" class="form-label">Player 2 Score:</label>
                                <input type="number" v-model="match.player_2_wins" id="player2Score" class="form-control" />
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" v-model="match.player2OnPlay" id="player2OnPlay" class="form-check-input" />
                                <label for="player2OnPlay" class="form-check-label">Player 2 on Play</label>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary mt-4 w-100" @click="submitScores(match)">Submit Scores</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import socket from '../warehouse/socket';
import { tournament_channel } from '../warehouse/tournament_channel';
import { auth } from '../warehouse/auth';

export default {
    name: 'OrganiserRoomView',
    data() {
        return {
            joinCode: '',
            matches: [],
            channel: null,
            authenticated: ""
        };
    },
    watch: {
        'matches.player1OnPlay'(newVal) {
            if (newVal) {
                this.matches.player2OnPlay = false;
            }
        },
        'matches.player2OnPlay'(newVal) {
            if (newVal) {
                this.matches.player1OnPlay = false;
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
        async getAllMatches() {
            try {
                let matches = await tournament_channel.getCurrentMatches(this.channel);
                console.log(matches);
                this.matches = matches.map(match => {
                    match.player1OnPlay = match.on_play_id === match.player1.id;
                    match.player2OnPlay = match.on_play_id === match.player2.id;
                    return match;
                });
                return matches;
            } catch (e) {
                console.error(e);
            }
        },
        async submitScores(match) {
            try {
                let params = {
                    id: match.id,
                    player_1_wins: match.player_1_wins,
                    player_2_wins: match.player_2_wins,
                    on_play_id: match.player1OnPlay ? match.player1.id : match.player2.id
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
        this.matches = await this.getAllMatches();
    }
};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>