<template>
    <div class="container">
        <h4 class="my-4">Player List:</h4>
        <ul class="list-group player-list">
            <li v-for="player in players" :key="player.id" class="list-group-item d-flex justify-content-between align-items-center">
                {{ player.user.full_name }}
                <button @click="$emit('remove-player', player)" class="btn btn-danger btn-sm">
                   X
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'PlayerList',
    props: {
        players: {
            type: Array,
            required: true
        }
    }
}
</script>

<style scoped>


.player-list {
    max-height: 25rem; /* Set the height to accommodate 10 instances */
    overflow-y: auto; /* Enable vertical scrolling */
}
</style>