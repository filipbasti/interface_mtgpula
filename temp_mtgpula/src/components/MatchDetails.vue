<template>
    <div class="card shadow-sm mt-4">
        <div class="card-body">
            <h3>Round {{ match.round }}</h3>
            <div class="row">
                <div class="col-md-6">
                    <h4>Player 1: {{ match.player1.user.full_name }}</h4>
                    <div class="mb-3">
                        <label class="form-label text-center w-100 h5">Player 1 Score:</label>
                        <div class="input-group px-5 row">
                            <button class="btn btn-outline-secondary col" @click="decrementScore('player1')" :disabled="match.player2.id == null">-</button>
                            <span class="form-control text-center col fs-3" >{{ match.player_1_wins }}</span>
                            <button class="btn btn-outline-secondary col" @click="incrementScore('player1')" :disabled="match.player2.id == null">+</button>
                        </div>
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" v-model="match.player1OnPlay" @change="handleOnPlayChange('player1')" id="player1OnPlay" class="form-check-input" :disabled="match.player2.id == null" />
                        <label for="player1OnPlay" class="form-check-label">Player 1 on Play</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <h4>Player 2: {{ match.player2.user.full_name }}</h4>
                    <div class="mb-3">
                        <label class="form-label text-center w-100 h5">Player 2 Score:</label>
                        <div class="input-group px-5 row">
                            <button class="btn btn-outline-secondary col" @click="decrementScore('player2')" :disabled="match.player2.id == null">-</button>
                            <span class="form-control text-center col fs-3">{{ match.player_2_wins }}</span>
                            <button class="btn btn-outline-secondary col" @click="incrementScore('player2')" :disabled="match.player2.id == null">+</button>
                        </div>
                    </div>
                    <div class="form-check mb-3">
                        <input type="checkbox" v-model="match.player2OnPlay" @change="handleOnPlayChange('player2')" id="player2OnPlay" class="form-check-input" :disabled="match.player2.id == null" />
                        <label for="player2OnPlay" class="form-check-label">Player 2 on Play</label>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary mt-4 w-100" @click="submitScores" :disabled="match.player2.id == null">Submit Scores</button>
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
        incrementScore(player) {
            if (player === 'player1' && this.match.player_1_wins < 2) {
                this.match.player_1_wins++;
            } else if (player === 'player2' && this.match.player_2_wins < 2) {
                this.match.player_2_wins++;
            }
        },
        decrementScore(player) {
            if (player === 'player1' && this.match.player_1_wins > 0) {
                this.match.player_1_wins--;
            } else if (player === 'player2' && this.match.player_2_wins > 0) {
                this.match.player_2_wins--;
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