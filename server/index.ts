import { NextFunction, Request, Response } from "express";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");
import session, { SessionOptions } from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import { Server as SocketIOServer } from "socket.io";
const MongoDBStore = connectMongoDBSession(session);
dotenv.config({ path: "config.env" });
import "./database/db";

interface ServerToClientEvents {
  liveNewsUpdate: (data: LiveUpdatePayload) => void;
}

interface ClientToServerEvents {
  liveUpdate: (data: LiveUpdatePayload) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId?: string;
}

interface LiveUpdatePayload {
  title: string;
  content: string;
  timestamp?: string;
  // Add any other fields you want here
}

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["https://www.newsvist.com", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static("public", {
    maxAge: "1d",
  })
);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: "sessions",
});

const sessionOptions: SessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  },
};
app.use(session(sessionOptions));

// connectDB();
app.use("/api", require("./Router/router"));

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: ["https://www.newsvist.com", "http://localhost:3000"],
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  },
  transports: ["polling"],
});

module.exports = io;

io.on("connection", async (socket) => {
  console.log("A user connected");

  socket.on("liveUpdate", async (data) => {
    console.log("Live News Received:", data);
    io.emit("liveNewsUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

export default io;
