import axios from "axios";
import $router from "../router";
import socketService from "./socketService";
const baseURL = process.env.NODE_ENV === "development"
  ? "http://localhost:4000/api" // Local development
  : "http://mtg_pula:4000/api"; // Production
let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
  withCredentials: true,
});
Service.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Refresh token function
        error.config.headers["Authorization"] = `Bearer ${newToken}`;
        await auth.refreshToken();
        socketService.reconnectSocket(newToken);
        return Service.request(error.config);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        auth.logout(); // Handle logout
      }
    }
    return Promise.reject(error);
  }
);


const getAuthConfig = () => {
  const token = localStorage.getItem('token');
   // Debug line
  
  return {
      headers: {
          Authorization: `Bearer ${token}`
          
      }
  };
};
const auth = {

  constructor() { 
    this.refreshTimer = null;
  },

  startTokenRefreshTimer() {
    if (this.refreshTimer) {
      console.log("[DEBUG] Token refresh timer already running, skipping.");
      return;
    }
  
    const currentToken = this.getUser();
    if (!currentToken) return;
  
    const decoded = JSON.parse(atob(currentToken.split(".")[1]));
    console.log (decoded);
    const expiresAt = decoded.exp 
    console.log("[DEBUG] Token expires at:", new Date(expiresAt * 1000).toLocaleString());
    const now = Date.now()/1000;
    const delay = expiresAt -now- 30 ; // Refresh 30s before expiration
  
    console.log(`[DEBUG] Starting token refresh timer in ${delay}s...`);
  
    this.refreshTimer = setTimeout(async () => {
      this.refreshTimer = null;
      await this.refreshToken();
       // Reset timer after refresh
    }, delay*1000);

    
  },
  async refreshToken() {
    try{
      const currentToken = this.getUser();
      console.log("[DEBUG] Refreshing token... Current token:", currentToken);
        if (!currentToken) {
          console.log("[DEBUG] No token found, stopping refresh.");
          return;}
        let response = await Service.post("/accounts/refresh_session", {}, getAuthConfig());
        let newToken = response.data.token;

        if (!newToken) {
          console.log("[ERROR] Refresh failed: No new token received.");
          this.logout();
          return;
        }
        if (newToken === currentToken) {
          console.log("[DEBUG] Token is the same as before. No need to restart.");
          return; // Prevent loop
        }
    
        console.log("[DEBUG] Token refreshed successfully:", newToken);

        localStorage.setItem("token", newToken);


    socketService.reconnectSocket(newToken);
    this.startTokenRefreshTimer();
    return newToken;
    }
    catch(error){
      await auth.logout();
      $router.go();
      return null;
     }

  },
  async login(email, password) {
    let response = await Service.post("/accounts/sign_in",
      { email: email, hash_password: password }
    );
    let user = response.data;
    localStorage.setItem("token", user.token);
    socketService.connectSocket(user.token);
    this.startTokenRefreshTimer();

    return true;
  },
  async signup(userDetail) {
    await Service.post("/accounts/create", {
      account:{
      email: userDetail.email,
      full_name: userDetail.username,
      hash_password: userDetail.password,
 
    }
    });

    return true;
  },

  async current_user() {
      try{
    let response = await Service.get("/accounts/current", getAuthConfig());
    return response.data;}
    catch(error){ console.error('Current user error:', 
      error.response?.data || error);}
  },
  async logout() {
     socketService.disconnectSocket();
    localStorage.removeItem("token");
  },
  getUser() {
    return localStorage.getItem("token");
  },

  authenticated() {
    let user = auth.getUser();
    if (user) {
      return true;
    } else return false;
  },

  getUsers() {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  }
};

export { Service, auth, baseURL };