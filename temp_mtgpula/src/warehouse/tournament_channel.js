const tournament_channel = {
    addUserToPlayersList(player, channel, addedPlayers) {
        channel.push("add_player",{user_id: player.id, deck: player.deck})
        .receive("ok", (resp) => {
            console.log("Player added:", resp);
            addedPlayers.push({name: resp.id})
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
        channel.push("remove_player",{player_id: player.name})
        .receive("ok", (resp) => {
            console.log("Player removed:", resp);
            addedPlayers.splice(addedPlayers.findIndex(p => p.name === resp), 1)
        })
        .receive("error", (resp) => {
            console.error("Failed to remove player:", resp);
        });
    },
    prepareRound(channel) {
        channel.push("prepare_matches")
        .receive("ok", (resp) => {
            console.log("Tournament started:", resp);
        })
        .receive("error", (resp) => {
            console.error("Failed to start tournament:", resp);
            resp.redirect==true ? window.location.href = "/tournament" : null;
        });
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