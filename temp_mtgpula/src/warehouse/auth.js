import axios from "axios";
import $router from "../router";
import socketService from "./socketService";

const baseURL = "https://mtg-pula.onrender.com/api";

let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
  withCredentials: true,
});

// Attach token to all requests
Service.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle 401 errors and refresh token
Service.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        console.log("[DEBUG] 401 detected, refreshing token...");
        const newToken = await auth.refreshToken();
        
        if (!newToken) {
          console.log("[ERROR] Token refresh failed, logging out...");
          auth.logout();
          return Promise.reject(error);
        }
        
        // Retry original request with new token
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        return Service.request(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        auth.logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

const auth = {
  refreshTimer: null,

  startTokenRefreshTimer() {
    if (this.refreshTimer) {
      console.log("[DEBUG] Token refresh timer already running, skipping.");
      return;
    }
    
    const currentToken = this.getUser();
    if (!currentToken) return;
    
    const decoded = JSON.parse(atob(currentToken.split(".")[1]));
    const expiresAt = decoded.exp;
    const now = Date.now() / 1000;
    const delay = expiresAt - now - 30; // Refresh 30s before expiration
    
    console.log(`[DEBUG] Token refresh in ${delay / 1000}s...`);
    
    this.refreshTimer = setTimeout(async () => {
      this.refreshTimer = null;
      await this.refreshToken();
    }, delay * 1000);
  },

  async refreshToken() {
    try {
      const currentToken = this.getUser();
      console.log("[DEBUG] Refreshing token... Current token:", currentToken);
      if (!currentToken) return null;
      
      let response = await Service.post("/accounts/refresh_session", {});
      let newToken = response.data.token;
      
      if (!newToken) {
        console.log("[ERROR] No new token received.");
        this.logout();
        return null;
      }
      
      console.log("[DEBUG] Token refreshed successfully:", newToken);
      localStorage.setItem("token", newToken);
      socketService.reconnectSocket(newToken);
      this.startTokenRefreshTimer();
      return newToken;
    } catch (error) {
      console.error("[ERROR] Token refresh failed", error);
      this.logout();
      return null;
    }
  },

  async login(email, password) {
    let response = await Service.post("/accounts/sign_in", { email, hash_password: password });
    let user = response.data;
    localStorage.setItem("token", user.token);
    socketService.connectSocket(user.token);
    this.startTokenRefreshTimer();
    return true;
  },

  async logout() {
    socketService.disconnectSocket();
    localStorage.removeItem("token");
    this.refreshTimer = null;
  },

  getUser() {
    return localStorage.getItem("token");
  },

  authenticated() {
    return !!this.getUser();
  }
};

export { Service, auth, baseURL };
