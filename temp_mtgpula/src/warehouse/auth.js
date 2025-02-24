import axios from "axios";
import $router from "../router";
import socketService from "./socketService";
const baseURL = "http://localhost:4000/api";
let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
  withCredentials: true,
});
Service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      auth.refreshToken();
    }
     console.error('Interceptor', error.response);
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

  async refreshToken() {
    try{
    let response = await Service.post("/accounts/refresh_session", {}, getAuthConfig());
    localStorage.setItem("token", response.token);
    $router.go();
    return response.token;
    }
    catch(error){
      auth.logout();
      $router.go();
      throw error;
     }

  },
  async login(email, password) {
    let response = await Service.post("/accounts/sign_in",
      { email: email, hash_password: password }
    );
    let user = response.data;
    localStorage.setItem("token", user.token);
    socketService.connect(user.token);

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
  logout() {
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