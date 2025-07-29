import { NextFunction, Request, Response } from "express";

import express from "express";

import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import session, { SessionOptions } from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import { Server as SocketIOServer } from "socket.io";
import router from "./router/router";
dotenv.config();
import "./database/db";
const MongoDBStore = connectMongoDBSession(session);

const PORT = Number(process.env.PORT) || 8080;
const app = express();

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
}

app.use(
  cors({
    origin: ["https://www.newsvist.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

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
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};
app.use(session(sessionOptions));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Backend is running" });
});
app.use("/api", router);

const server = app.listen(PORT, "0.0.0.0", () => {
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
  transports: ["websocket", "polling"],
});

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
