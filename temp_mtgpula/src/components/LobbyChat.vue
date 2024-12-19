<template>
    <div class="container-fluid mt-5">
      <div class="row">
        <!-- Active Users Sidebar -->
        <div class="col-md-3">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="fas fa-users me-2"></i>Active Users
                <span class="badge bg-light text-primary float-end">{{ activeUsers.length }}</span>
              </h5>
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush">
                <li v-for="user in activeUsers" 
                    :key="user.id" 
                    class="list-group-item d-flex align-items-center">
                  <img :src="`https://ui-avatars.com/api/?name=${user.name}&background=random`" 
                       class="rounded-circle me-2"
                       width="32"
                       height="32"
                       :alt="user.name">
                  <span>{{ user.name }}</span>
                  <span class="badge bg-success rounded-pill ms-auto">online</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <!-- Chat Area -->
        <div class="col-md-9">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h4 class="mb-0">Chat Room</h4>
            </div>
            <div class="card-body chat-container">
              <!-- Messages -->
              <ul class="list-group messages-list">
                <li v-for="(msg, index) in messages"
                    :key="index"
                    class="list-group-item border-0">
                  <div class="d-flex align-items-start">
                    <img :src="`https://ui-avatars.com/api/?name=${msg.sender}&background=random`" 
                         class="rounded-circle me-2"
                         width="32"
                         height="32"
                         :alt="msg.sender">
                    <div>
                      <div class="fw-bold">{{ msg.sender }}</div>
                      <div>{{ msg.msg }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- Input Area -->
            <div class="card-footer bg-white">
              <div class="input-group">
                <input
                  v-model="message"
                  type="text"
                  class="form-control"
                  placeholder="Type your message..."
                  @keyup.enter="sendMessage"
                />
                <button
                  @click="sendMessage"
                  class="btn btn-primary"
                  type="button"
                >
                  <i class="fas fa-paper-plane me-1"></i>Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import socket from '../warehouse/socket'
  
  export default {
    data() {
      return {
        channel: null,
        message: "",
        messages: [],
        activeUsers: [] // Will store active users
      }
    },
    mounted() {
      this.channel = socket.channel("room:lobby", {})
  
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
  
      // Listen for new messages
      this.channel.on("new_msg", (payload) => {
        console.log("New message received:", payload)
        this.messages.push({
          msg: payload.body,
          sender: payload.sender
        })
        this.scrollToBottom()
      })
  
      // Listen for user presence updates
      this.channel.on("presence_state", state => {
        // Handle initial presence state
        this.handlePresenceState(state)
      })
  
      this.channel.on("presence_diff", diff => {
        // Handle presence changes
        this.handlePresenceDiff(diff)
      })
    },
    methods: {
      sendMessage() {
        if (this.message.trim() === "") {
          return
        }
  
        this.channel
          .push("new_msg", { body: this.message })
          .receive("ok", (resp) => {
            this.message = ""
          })
          .receive("error", (resp) => {
            console.log("Failed to send message:", resp)
          })
      },
      handlePresenceState(state) {
        // Convert presence state to array of users
        console.log(state)
        this.activeUsers = Object.entries(state).map(([key, presence]) => ({
          id: key,
          name: presence.metas[0].user_name
        }))
   
      },
      handlePresenceDiff(diff) {
        // Handle users joining
        diff.joins && Object.entries(diff.joins).forEach(([key, presence]) => {
          this.activeUsers.push({
            id: key,
            name: presence.metas[0].user_name
          })
        })
  
        // Handle users leaving
        diff.leaves && Object.keys(diff.leaves).forEach(key => {
          this.activeUsers = this.activeUsers.filter(user => user.id !== key)
        })
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const container = document.querySelector('.messages-list')
          container.scrollTop = container.scrollHeight
        })
      }
    }
  }
  </script>
  
  <style scoped>
  .chat-container {
    height: calc(100vh - 300px);
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .messages-list {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .list-group-item {
    margin-bottom: 0.5rem;
  }
  
  .input-group input {
    border-right: none;
  }
  
  .input-group .btn {
    border-left: none;
  }
  
  /* Custom scrollbar */
  .messages-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .messages-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .messages-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .messages-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>
    