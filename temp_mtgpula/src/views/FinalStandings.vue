<template>
    <div class="final-standings">
        <h1>Final Standings</h1>
        <standingsTable :standings="standings" />
    </div>
</template>

<script>
import standingsTable from '../components/StandingsTable.vue';
import { tournament_channel } from '../warehouse/tournament_channel';
import socketService from '../warehouse/socketService';
export default {
    name: 'FinalStandings',
    components: {
        standingsTable
    },
    async mounted() {
      
        this.joinCode = this.$route.params.join_code;
        try {
            let res = await socketService.joinChannel(`tournament:${this.joinCode}`, {});
            
        } catch (e) {
           alert(e);
        }

        this.channel = socketService.channel;
        console.log(this.$route.params.join_code);
        await this.getStandings(this.$route.params.join_code);
    },
    data() {
        return {
            
         standings: [
        
        ],
     
        };
    },
    methods:{
        async getStandings(join_code){
            try{
                let standings = await tournament_channel.getStandings(join_code);
                this.standings = standings
            }catch(e){
                console.log(e);
            }
        }
    }

};
</script>

<style scoped>
.final-standings {
    padding: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
