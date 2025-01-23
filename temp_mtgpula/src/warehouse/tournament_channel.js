
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
    }
 }
 export {tournament_channel};