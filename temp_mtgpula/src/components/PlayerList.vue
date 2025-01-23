<template>
    <div class="container">
        <h1 class="my-4">Game Dashboard</h1>
        <ul class="list-group">
            <li v-for="player in players" :key="player.id" class="list-group-item">
                {{ player.name }}
                <button @click="$emit('remove-player', player)" class="btn btn-danger btn-sm float-right">
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
h1 {
    font-family: Arial, sans-serif;
}
</style>

