import { io } from "socket.io-client";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://newsvist.onrender.com"
    : "http://localhost:8080";

const socket = io(baseURL);

export default socket;
