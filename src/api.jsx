import axios from "axios";

const api = axios.create({
  baseURL: "https://krstoreapi.phalla.lol/api",
});

export default api;
