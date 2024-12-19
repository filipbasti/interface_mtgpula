import axios from "axios";
import $router from "../router";

const baseURL = "http://localhost:4000";
let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
});
Service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      auth.logout();
      $router.go();
    }
    // console.error('Interceptor', error.response);
  }
);
const auth = {
  async login(email, password) {
    let response = await Service.post("/api/accounts/sign_in",
      { email: email, hash_password: password }
    );
    let user = response.data;
    localStorage.setItem("token", user.token);

    return true;
  },
  async signup(userDetail) {
    await Service.post("/api/accounts/create", {
      account:{
      email: userDetail.email,
      full_name: userDetail.username,
      hash_password: userDetail.password,
 
    }
    });

    return true;
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
};

export { Service, auth, baseURL };