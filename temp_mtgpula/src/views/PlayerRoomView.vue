<template>
    <div>
        <h1>Welcome to the Tournament Room</h1>
        <p>Your join code: {{ joinCode }}</p>
    </div>
</template>

<script>
import socket from '../warehouse/socket';
export default {
    name: 'PlayerRoomView',
    data() {
        return {
            joinCode: ''
        };
    },
    created() {
        this.joinCode = this.$route.params.join_code;
        this.channel = socket.channel(`tournament:${this.$route.params.join_code}`)
        this.channel
        .join()
        .receive("ok", (resp) => {
          console.log("Joined successfully", resp)
          // You might receive initial active users list here
          if (resp.users) {
            this.activeUsers = resp.users
          }
        })
        .receive("error", (resp) => {
          console.log("Unable to join", resp)
        })
        this.channel.on("matches_prepared", (payload) => {
            console.log("Matches prepared:", payload);
            // Handle the matches prepared event
            // For example, you might want to update the state or notify the user
        });
    }

};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>