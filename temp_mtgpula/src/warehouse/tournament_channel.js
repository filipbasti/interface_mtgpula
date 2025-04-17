import socketService from "./socketService";
import  router  from "../router";


const tournament_channel = {
    async getPlayers() {
        try {
            console.log("Getting players");
            let resp = await socketService.push("get_players", {});
            return resp.players;
        } catch (error) {
            console.log("Failed to get players:", error);
            throw error;
        }
    },

    async getStandings(join_code =null) {
        try {
            let params = join_code ? { join_code: join_code } : {};
            let resp = await socketService.push("get_standings", params);
            console.log("Standings found:", resp);
            return resp.players;
        } catch (error) {
            console.error("Failed to get standings:", error);
            throw error;
        }
    },


    async addUserToPlayersList(player) {
        try {
            let res = await socketService.push("add_player", { user_id: player.id, deck: player.deck });
            console.log("Player added:", res.player);
            return res.player;
        } catch (error) {
            throw error;
        }
    },

    async getUserByEmail(email) {
        try {
            let resp = await socketService.push("get_user_by_email", { email: email });
            console.log("Player found:", resp.user_id);
            return resp.user_id;
        } catch (error) {
           alert("User not found")
            throw error;
        }
    },

    async removePlayer(player, addedPlayers) {
        try {
            console.log("Removing player:", player);
            await socketService.push("remove_player", { player_id: player.id });
            
            addedPlayers.splice(addedPlayers.findIndex(p => p.id == player.id), 1);
        } catch (error) {
            console.error("Failed to remove player:", error);
            throw error;
        }
    },

    async prepareRound(join_code =null) {
        try {
            let resp = await socketService.push("prepare_matches", {});
            console.log("Tournament started:", resp);
            return resp;
        } catch (error) {
            console.error("Failed to start tournament:", error);
            if (error.redirect) {
                router.push(`/final-standings/${join_code}`);
            }
            throw error;
        }
    },

    async getCurrentMatches() {
        try {
            let resp = await socketService.push("current_matches", {});
            console.log("Matches found:", resp.matches);
            return resp.matches;
        } catch (error) {
            console.error("Failed to get matches:", error);
            throw error;
        }
    },
    async dropPlayer(player) {
        try {
            console.log("Removing player:", player);
            await socketService.push("drop_player", { player_id: player.id });
        } catch (error) {
            console.error("Failed to remove player:", error);
            throw error;
        }
    }
    ,

    async updateMatch(match_params) {
        try {
            let resp = await socketService.push("update_match", match_params);
            console.log("Match updated:", resp);
            return resp;
        } catch (error) {
            console.error("Failed to update match:", error);
            throw error;
        }
    }
};

export { tournament_channel };