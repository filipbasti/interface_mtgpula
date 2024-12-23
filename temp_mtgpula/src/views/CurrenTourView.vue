<template>
<div>
    <h3>CURRENT Tournament</h3>
</div>

</template>
<script>    
import socket from '../warehouse/socket';

export default {
    data(){
       return{
        channel: "",
        join_code: this.$route.params.join_code
    } 
    },
    mounted(){
        this.channel = socket.channel(`tournament:${this.join_code}`)
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
                // Push the "list_present_users" event to the server
        this.channel.push("list_present_users", {})
        .receive("ok", (resp) => {
            console.log("Present users:", resp.players);
        })
        .receive("error", (resp) => {
            console.error("Failed to list present users:", resp);
        });

            }

}
</script>