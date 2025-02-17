const tournament_channel = {

    getPlayers(channel) { 
        
        return new Promise ((resolve, reject) => {
        channel.push("get_players", {}).receive("ok", (resp) => {
            console.log("Players found:", resp.players);
            resolve(resp.players);
       
       
    }) .receive("error", (resp) => {
            console.error("Failed to start tournament:", resp);
            reject(resp);
        });})
    },
    getStandings(channel) { 
            
            return new Promise ((resolve, reject) => {
            channel.push("get_standings", {}).receive("ok", (resp) => {
                console.log("Standings found:", resp);
                resolve(resp.players);
        
        
        }) .receive("error", (resp) => {
                console.error("Failed to get standings:", resp);
                reject(resp);
            });})
    },

    addUserToPlayersList(player, channel, addedPlayers) {
        channel.push("add_player",{user_id: player.id, deck: player.deck})
        .receive("ok", (resp) => {
            console.log("Player added:", resp);
            addedPlayers.push(resp.player)
        })
        .receive("error", (resp) => {
            console.error("Failed to add player:", resp);
        });
    },
    getUserByEmail(email, channel) {
        return new Promise((resolve, reject) => {
            channel.push("get_user_by_email", { email: email })
            .receive("ok", (resp) => {
                console.log("Player found:", resp.user_id);
                resolve(resp.user_id);
            })
            .receive("error", (resp) => {
                console.error("Failed to find player:", resp);
                reject(resp);
            });
        });
    },
    removePlayer(player, channel, addedPlayers) {
        console.log("Removing player:", player);
        channel.push("remove_player",{player_id: player.id})
        .receive("ok", (resp) => {
            console.log("Player removed:", resp);
            addedPlayers.splice(addedPlayers.findIndex(p => p.id === resp.id), 1)
        })
        .receive("error", (resp) => {
            console.error("Failed to remove player:", resp);
        });
    },
    prepareRound(channel) {
        return new Promise((resolve, reject) =>
        channel.push("prepare_matches")
        .receive("ok", (resp) => {
            console.log("Tournament started:", resp);
            resolve(resp);
        })
        .receive("error", (resp) => {
            console.error("Failed to start tournament:", resp);
            resp.redirect==true ? window.location.href = "/tournament" : null;
            reject(resp);
        }));
    },
   getCurrentMatches(channel) {
       return new Promise((resolve, reject ) => 
        channel.push("current_matches")
       .receive("ok", (resp) => {
           console.log("Matches found:", resp.matches);
           resolve(resp.matches);
          
           
       })
       .receive("error", (resp) => {
           console.error("Failed to get matches:", resp);
           reject(resp);
       }));
    },
    updateMatch(channel, match_params) {
        return new Promise ((resolve, reject ) => channel.push("update_match", match_params)
        .receive("ok", (resp) => {
            console.log("Match updated:", resp);
            resolve(resp);
        })
        .receive("error", (resp) => {
            console.error("Failed to update match:", resp);
            reject(resp);
        }));
    }
}
export {tournament_channel};