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
exports.generateUniqueUsername = exports.generateResetToken = exports.parseData = exports.sendError = void 0;
const User_1 = __importDefault(require("../models/User"));
const crypto = require("crypto");
const sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
};
exports.sendError = sendError;
const parseData = (req, res, next) => {
    const { video, tags } = req.body;
    if (video)
        req.body.video = JSON.parse(video);
    if (tags)
        req.body.tags = JSON.parse(tags);
    next();
};
exports.parseData = parseData;
// Function to generate the reset token
const generateResetToken = () => {
    const buffer = crypto.randomBytes(32);
    return buffer.toString("hex");
};
exports.generateResetToken = generateResetToken;
const generateUniqueUsername = (base) => __awaiter(void 0, void 0, void 0, function* () {
    let username = base.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (!username)
        username = "user";
    let exists = yield User_1.default.findOne({ username });
    let counter = 1;
    while (exists) {
        username = `${username}${Math.floor(Math.random() * 10000)}`;
        exists = yield User_1.default.findOne({ username });
        counter++;
        if (counter > 20)
            break;
    }
    return username;
});
exports.generateUniqueUsername = generateUniqueUsername;
