import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://newsvist.onrender.com/api"
    : "http://localhost:8080/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
