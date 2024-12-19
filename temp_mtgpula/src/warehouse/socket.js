import {Socket} from 'phoenix'

let token = localStorage.getItem("token")
let socket = new Socket("ws://localhost:4000/socket", {params: {token: token}})
socket.connect()


export default socket
