import axios from "axios";

const api = axios.create({
  baseURL: "https://krstoreapi.phalla.lol/api", // base API
});

export default api;
