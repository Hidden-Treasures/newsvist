"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
let redisClient = null;
// Only try Redis if environment variables are set
if (process.env.REDIS_HOST) {
    redisClient = new ioredis_1.default({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
    });
    redisClient.on("connect", () => {
        console.log("✅ Redis connected");
    });
    redisClient.on("error", (err) => {
        console.error("❌ Redis error:", err);
    });
}
else {
    console.log("⚠️ Redis not configured, using in-memory fallback cache.");
}
exports.default = redisClient;
