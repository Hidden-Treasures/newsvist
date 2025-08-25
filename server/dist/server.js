"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const socket_io_1 = require("socket.io");
const router_1 = __importDefault(require("./router/router"));
dotenv_1.default.config();
require("./database/db");
const scheduler_1 = require("./jobs/scheduler");
const PORT = Number(process.env.PORT) || 8080;
const app = (0, express_1.default)();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
app.use((0, cors_1.default)({
    origin: [
        "https://newsvist.com",
        "https://www.newsvist.com",
        "https://newsvist.vercel.app",
        "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use((0, compression_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: true }));
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
});
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
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
app.use((0, express_session_1.default)(sessionOptions));
app.get("/", (req, res) => {
    res.status(200).json({ message: "Backend is running" });
});
app.use("/api", router_1.default);
// Start schedulers
(0, scheduler_1.startSchedulers)();
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://www.newsvist.com", "http://localhost:3000"],
        methods: ["GET", "POST", "HEAD"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    io.on("connection", (socket) => {
        console.log("A user connected");
        socket.on("join-room", (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });
        socket.on("leave-room", (room) => {
            socket.leave(room);
            console.log(`User left room: ${room}`);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
}));
exports.default = io;
