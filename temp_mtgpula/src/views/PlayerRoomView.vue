<template>
    <div class="container mt-4">
        <h1 class="text-center">Welcome to the Tournament Room</h1>
        <p class="text-center">Your join code: <strong>{{ joinCode }}</strong></p>
        <ul class="nav nav-tabs" id="playerRoomTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="match-tab" data-bs-toggle="tab" data-bs-target="#match" type="button" role="tab" aria-controls="match" aria-selected="true">Match</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="standings-tab" data-bs-toggle="tab" data-bs-target="#standings" type="button" role="tab" aria-controls="standings" aria-selected="false">Standings</button>
            </li>
        </ul>
        <div class="tab-content" id="playerRoomTabsContent">
            <div class="tab-pane fade show active" id="match" role="tabpanel" aria-labelledby="match-tab">
                <div v-if="currentMatch && updateMatchFlag" class="card shadow-sm mt-4">
                    <div class="card-body">
                        <h2 class="card-title">Match Details</h2>
                        <div class="row">
                            <div class="col-md-6">
                                <h3>Player 1: {{ currentMatch.player1.user.full_name }}</h3>
                                <div class="mb-3">
                                    <label for="player1Score" class="form-label">Player 1 Score:</label>
                                    <input type="number" v-model="currentMatch.player_1_wins" id="player1Score" class="form-control" :disabled="currentMatch.player2.id == null" />
                                </div>
                                <div class="form-check mb-3">
                                    <input type="checkbox" v-model="player1OnPlay" id="player1OnPlay" class="form-check-input" :disabled="currentMatch.player2.id == null" />
                                    <label for="player1OnPlay" class="form-check-label">Player 1 on Play</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h3>Player 2: {{ currentMatch.player2.user.full_name }}</h3>
                                <div class="mb-3">
                                    <label for="player2Score" class="form-label">Player 2 Score:</label>
                                    <input type="number" v-model="currentMatch.player_2_wins" id="player2Score" class="form-control" :disabled="currentMatch.player2.id == null" />
                                </div>
                                <div class="form-check mb-3">
                                    <input type="checkbox" v-model="player2OnPlay" id="player2OnPlay" class="form-check-input" :disabled="currentMatch.player2.id == null" />
                                    <label for="player2OnPlay" class="form-check-label">Player 2 on Play</label>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary mt-4 w-100" @click="submitScores" :disabled="currentMatch.player2.id == null">Submit Scores</button>
                    </div>
                </div>
                <div v-else class="card shadow-sm mt-4">
                    <div class="card-body">
                        <h2 class="card-title">Waiting for organiser to start a new round</h2>
                        <p>Sit back and relax</p>
                    </div>
                </div>
            </div>
            <div class="tab-pane fade" id="standings" role="tabpanel" aria-labelledby="standings-tab">
                <div class="card shadow-sm mt-4">
                    <div class="card-body">
                        <h2 class="card-title">Standings</h2>
                        <StandingsTable :standings="standings" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import socketService from '../warehouse/socketService';
import { tournament_channel } from '../warehouse/tournament_channel';
import { auth } from '../warehouse/auth';
import StandingsTable from '../components/StandingsTable.vue';

export default {
    name: 'PlayerRoomView',
    components: {
        StandingsTable
    },
    data() {
        return {
            joinCode: '',
            matches: [],
            channel: null,
            authenticated: "",
            currentMatch: null,
            player2OnPlay: false,
            player1OnPlay: false,
            standings: [],
            updateMatchFlag: false
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
        settingFlag(player1wins, player2wins) {
            return player1wins === 0 && player2wins === 0;
        },
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
                let matches = await tournament_channel.getCurrentMatches();
                let match = matches.find(match => match.player1.user.id === this.authenticated.user.id || match.player2.user.id === this.authenticated.user.id);
                console.log(match);
                this.currentMatch = match;
                this.currentMatch.on_play_id === match.player1.id ? this.player1OnPlay = true : this.player2OnPlay = true;
                this.updateMatchFlag = this.settingFlag(this.currentMatch.player_1_wins, this.currentMatch.player_2_wins);
                return match;
            } catch (e) {
                console.error(e);
            }
        },
        async getStandings() {
            try {
                let standings = await tournament_channel.getStandings();
                console.log(standings);
                this.standings = standings;
                return standings;
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
                await tournament_channel.updateMatch(params);
            } catch (error) {
                console.error("Error submitting scores:", error);
            }
        },
        startTournament() {
            tournament_channel.startTournament();
        }
    },
    async mounted() {
        await this.getCurrentUser();
        this.joinCode = this.$route.params.join_code;
        try {
            let res = await socketService.joinChannel(`tournament:${this.joinCode}`, { deck: this.$route.query.deck });
            if (res.users) {
                this.activeUsers = res.users;
            }
        } catch (e) {
            console.log(e);
        }

        this.channel = socketService.channel;

        this.channel.on("matches_prepared", async (payload) => {
            console.log("Matches prepared:", payload);
            await this.getCurrentPlayerMatch();
           await this.getStandings()
        });

        this.channel.on("match_updated", async (payload) => {
            console.log("Match updated:", payload);
            if (payload.id === this.currentMatch.id) this.updateMatchFlag = false;
            let res = await this.getStandings();
            console.log(res);   
        });

        this.currentMatch = await this.getCurrentPlayerMatch();
        await this.getStandings();
    }
};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>