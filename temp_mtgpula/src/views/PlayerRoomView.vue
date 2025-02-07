<template>
    <div>
        <h1>Welcome to the Tournament Room</h1>
        <p>Your join code: {{ joinCode }}</p>
        {{ matches }}
        {{ authenticated }}
    </div>
</template>

<script>
import socket from '../warehouse/socket';
import { tournament_channel } from '../warehouse/tournament_channel';
import { auth } from '../warehouse/auth';
export default {
    name: 'PlayerRoomView',
    data() {
        return {
            joinCode: '',
           matches: [],
            channel: null,
            authenticated: ""
        };
    },

    methods: {
        async getCurrentUser() {
            try {
                console.log("Getting current user");
                let response = await auth.current_user();
                console.log("Current user:", response);
                this.authenticated = response;
              
            } catch (error) {
                console.error(error);
            }
            
        }
    },
   async mounted() {
        await this.getCurrentUser();
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
       this.matches = await tournament_channel.getCurrentMatches(this.channel)
    }
 

};
</script>

<style scoped>
h1 {
    color: #333;
}
</style>