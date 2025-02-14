<template>
    <div class="card shadow-sm mt-4">
        <div class="card-body">
            <h3>Round {{ match.round }}</h3>
            <div class="row">
                <div class="col-md-6">
                    <h4>Player 1: {{ match.player1.user.full_name }}</h4>
                    <div class="mb-3">
                        <label for="player1Score" class="form-label">Player 1 Score:</label>
                        <input type="number" v-model="match.player_1_wins" id="player1Score" class="form-control" :disabled="match.player1.had_bye || match.player2.had_bye" />
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" v-model="match.player1OnPlay" @change="handleOnPlayChange('player1')" id="player1OnPlay" class="form-check-input" :disabled="match.player1.had_bye || match.player2.had_bye" />
                        <label for="player1OnPlay" class="form-check-label">Player 1 on Play</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4>Player 2: {{ match.player2.user.full_name }}</h4>
                    <div class="mb-3">
                        <label for="player2Score" class="form-label">Player 2 Score:</label>
                        <input type="number" v-model="match.player_2_wins" id="player2Score" class="form-control" :disabled="match.player1.had_bye || match.player2.had_bye" />
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" v-model="match.player2OnPlay" @change="handleOnPlayChange('player2')" id="player2OnPlay" class="form-check-input" :disabled="match.player1.had_bye || match.player2.had_bye" />
                        <label for="player2OnPlay" class="form-check-label">Player 2 on Play</label>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary mt-4 w-100" @click="submitScores" :disabled="match.player1.had_bye || match.player2.had_bye">Submit Scores</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MatchDetails',
    props: {
        match: Object,
        channel: Object
    },
    methods: {
        handleOnPlayChange(player) {
            if (player === 'player1') {
                if (this.match.player1OnPlay) {
                    this.match.player2OnPlay = false;
                }
            } else if (player === 'player2') {
                if (this.match.player2OnPlay) {
                    this.match.player1OnPlay = false;
                }
            }
        },
        async submitScores() {
            try {
                let params = {
                    id: this.match.id,
                    player_1_wins: this.match.player_1_wins,
                    player_2_wins: this.match.player_2_wins,
                    on_play_id: this.match.player1OnPlay ? this.match.player1.id : this.match.player2.id
                };
              
                console.log("Submitting scores:", params);
                await this.$emit('update-match', params);
            } catch (error) {
                console.error("Error submitting scores:", error);
            }
        }
    }
};
</script>

<style scoped>
h3 {
    color: #333;
}
</style>