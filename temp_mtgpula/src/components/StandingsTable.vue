<template>
 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Player</th>
                    <th scope="col">Points</th>
                    <th scope="col">OMW%</th>
                    <th scope="col">GW%</th>
                    <th scope="col">OGP%</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(player, index) in standings" :key="player.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ player.user.full_name }}</td>
                    <td>{{ player.points }}</td>
                    <td>{{ player.omw }}</td>
                    <td>{{ player.gw }}</td>
                    <td>{{ player.ogp }}</td>
                </tr>
            </tbody>
        </table>
</template>

<script>
export default {
    name: 'StandingsTable',
    props: {
        standings: Array
    }
};
</script>

<style scoped>
</style>
