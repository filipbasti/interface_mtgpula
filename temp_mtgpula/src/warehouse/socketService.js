import { Socket, Presence } from "phoenix";
import { auth } from "./auth";
const baseURL = process.env.NODE_ENV === "development"
  ? "ws://localhost:4000/socket" // Local development
  : "wss://www.mtgpula.site:4043/socket"; // Production
class SocketService {
    constructor() {
        this.socket = null;
        this.channel = null;
        this.presence = null;
        this.lastToken = null;
    }


  async disconnectSocket() {
        if (this.socket) {
            this.socket.disconnect();
        
        
    }	}
    connectSocket(userToken) {
        this.socket = new Socket(baseURL, { params: { token: userToken },});
        this.socket.connect();
    }

    async reconnectSocket(newToken = null) {
        try {
            console.log("Reconnecting socket with new token!");
           if (this.socket) this.disconnectSocket();
            newToken = newToken || auth.getUser()
        
            this.connectSocket(newToken);
        } catch (error) {
            console.error("Failed to refresh token:", error);
            auth.logout();
        }
    }

    joinChannel(channelName, params = {}) {
        this.channel = this.socket.channel(channelName, params);
        this.presence = new Presence(this.channel);

        return new Promise((resolve, reject) => {
            this.channel.join()
                .receive("ok", resp => {
                    console.log("Joined successfully", resp);
                    resolve(resp);
                })
                .receive("error", async resp => {
                    console.error("Unable to join", resp);
                    if (resp.reason === 'unauthorized') {
                        await this.reconnect();
                        this.joinChannel(channelName, params).then(resolve).catch(reject);
                    } else {
                        reject(resp);
                    }
                });
        });
    }

    leaveChannel() {
        if (this.channel) {
            this.channel.leave();
            this.channel = null;
            this.presence = null;
        }
    }

    push(event, payload) {
        return new Promise((resolve, reject) => {
            this.channel.push(event, payload)
                .receive("ok", resp => resolve(resp))
                .receive("error", resp => reject(resp));
        });
    }

    onPresenceSync(callback) {
        if (this.presence) {
            this.presence.onSync(() => {
                callback(this.listPresences());
            });
        }
    }

    onPresenceJoin(callback) {
        if (this.presence) {
            this.presence.onJoin((id, current, newPresence) => {
                callback(id, current, newPresence);
            });
        }
    }

    onPresenceLeave(callback) {
        if (this.presence) {
            this.presence.onLeave((id, current, leftPresence) => {
                callback(id, current, leftPresence);
            });
        }
    }

    listPresences() {
        return this.presence.list((id, { metas: [first, ...rest] }) => {
            return {
                id: id,
                name: first.user_name,
                deck: first.deck
            };
        });
    }
}

const socketService = new SocketService();
export default socketService;