<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <h1 class="text-center mb-4">Home</h1>
  
          <!-- Input group for the message input and send button -->
          <div class="input-group mb-3">
            <input
              v-model="message"
              type="text"
              class="form-control"
              placeholder="Type your message..."
              aria-label="Message"
            />
            <button
              @click="sendMessage"
              class="btn btn-primary"
              type="button"
            >
              Send
            </button>
          </div>
  
          <!-- Display sent and received messages -->
          <ul class="list-group">
            <li
              v-for="(msg, index) in messages"
              :key="index"
              class="list-group-item"
            >
              {{ msg.sender }}  {{ msg.msg }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import socket from '../warehouse/socket'
  
  export default {
    data() {
      return {
        channel: null, // Channel instance
        message: "",   // Input field for the user's message
        messages: [],  // List of messages sent/received
      }
    },
    mounted() {
      // Join the "room:lobby" channel
      this.channel = socket.channel("room:lobby", {})
  
      this.channel
        .join()
        .receive("ok", (resp) => {
          console.log("Joined successfully", resp)
        })
        .receive("error", (resp) => {
          console.log("Unable to join", resp)
        })
  
      // Listen for incoming messages (if broadcasted from the backend)
      this.channel.on("new_msg", (payload) => {
        console.log("New message received:", payload)
        this.messages.push({msg:payload.body, sender:payload.sender}) // Append the new message to the list
      })
    },
    methods: {
      sendMessage() {
        // Ensure the message is not empty
        if (this.message.trim() === "") {
          console.log("Message is empty!")
          return
        }
  
        // Push the message to the channel
        this.channel
          .push("new_msg", { body: this.message })
          .receive("ok", (resp) => {
            console.log("Message sent successfully:", resp)
            this.messages.push(this.message) // Add the message to the list of messages
            this.message = "" // Clear the input field
          })
          .receive("error", (resp) => {
            console.log("Failed to send message:", resp)
          })
      },
    },
  }
  </script>
  
  <style scoped>
  /* Optional custom styling for spacing */
  .container {
    max-width: 600px;
  }
  
  .input-group input {
    border-right: none;
  }
  
  .input-group .btn {
    border-left: none;
  }
  
  .list-group {
    max-height: 400px;
    overflow-y: auto;
  }
  </style>
  