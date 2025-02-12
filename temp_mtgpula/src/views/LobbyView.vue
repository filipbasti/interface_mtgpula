<template>
    <div class="lobby-view">
        <h1>Lobby</h1>
        <LobbyChat />
    </div>
</template>

<script>
import LobbyChat from '../components/LobbyChat.vue';

export default {
    name: 'LobbyView',
    components: {
        LobbyChat
    }
};
</script>

<style scoped>
.lobby-view {
    padding: 20px;
}
</style>