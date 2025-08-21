import Redis from "ioredis";

let redisClient: Redis | null = null;

// Only try Redis if environment variables are set
if (process.env.REDIS_HOST) {
  redisClient = new Redis({
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
} else {
  console.log("⚠️ Redis not configured, using in-memory fallback cache.");
}

export default redisClient;
