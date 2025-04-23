<template>
    <div class="container mt-4">
        <h1 class="text-center">Tournament Management</h1>
        <p class="text-center">Your join code: <strong>{{ joinCode }}</strong></p>
        <div v-if="matches.length || standings.length">
            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingStandings">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseStandings" aria-expanded="true" aria-controls="collapseStandings">
                            Standings
                        </button>
                    </h2>
                    <div id="collapseStandings" class="accordion-collapse collapse show" aria-labelledby="headingStandings" data-bs-parent="#accordionExample">
                       <div class="accordion-body">
                        <StandingsTable :standings="standings" />
                    </div>
                    </div>
                </div>
                <div v-for="(match, index) in matches" :key="match.id" class="accordion-item">
                    <h2 class="accordion-header" :id="'heading' + index">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="true" :aria-controls="'collapse' + index">
                            Match {{ index + 1 }}: {{ match.player1.user.full_name }} vs {{ match.player2.user.full_name }}
                        </button>
                    </h2>
                 
                    <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <MatchDetails :organiser= "true" :match="match" @update-match="updateMatch" />
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary mt-4 w-100" @click="goToNextRound">Next Round</button>
        </div>
    </div>
</template>

<script>
import socketService from '../warehouse/socketService';
import { tournament_channel } from '../warehouse/tournament_channel';
import { auth } from '../warehouse/auth';
import MatchDetails from '../components/MatchDetails.vue';
import StandingsTable from '../components/StandingsTable.vue';

export default {
    name: 'OrganiserRoomView',
    components: {
        MatchDetails,
        StandingsTable
    },
    data() {
        return {
            standings: [],
            joinCode: '',
            matches: [],
            channel: null,
            authenticated: ""
        };
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
        async getStandings() {
            try {
                let standings = await tournament_channel.getStandings();
                this.standings = standings;
                return standings;
            } catch (e) {
                alert(e);
            }
        },
    
        async getAllMatches() {
            try {
                let matches = await tournament_channel.getCurrentMatches();
                console.log(matches);
                matches =matches.sort((a, b) => {
                    if (a.id < b.id) return -1;
                    if (a.id > b.id) return 1;
                    return 0;
                });
                this.matches = matches.map(match => {
                    match.player1OnPlay = match.on_play_id === match.player1.id;
                    match.player2OnPlay = match.on_play_id === match.player2.id;
                    return match;
                });
                return matches;
            } catch (e) {
                alert(e);
            }
        },
        async updateMatch(params) {
            try {
                console.log("Updating match:", params);
                await tournament_channel.updateMatch(params);
                let standings = await tournament_channel.getStandings();
                this.standings = standings;
            } catch (error) {
               alert(error);
            }
        },
        async goToNextRound() {
            try {
                console.log("Going to the next round");
                await tournament_channel.prepareRound(this.joinCode);
                this.matches = await this.getAllMatches();
            } catch (error) {
              alert("Tournament ended successfully");
            }
        }
    },
    async mounted() {
        await this.getCurrentUser();
        this.joinCode = this.$route.params.join_code;
        try {
            let res = await socketService.joinChannel(`tournament:${this.joinCode}`, {});
            if (res.users) {
                this.activeUsers = res.users;
            }
        } catch (e) {
           alert(e);
        }

        this.channel = socketService.channel;

        this.channel.on("matches_prepared", (payload) => {
            console.log("Matches prepared:", payload);
            this.getAllMatches();
        });

        this.channel.on("match_updated", (payload) => {
            console.log("Match updated:", payload);
            this.getAllMatches();
            this.getStandings();
        });

        this.matches = await this.getAllMatches();
        await this.getStandings();
    }
};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>