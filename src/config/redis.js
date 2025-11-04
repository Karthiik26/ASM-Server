import { createClient } from "redis";
import { ENV } from "./env.config.js";

// const redisClient = createClient({
//   url: ENV.REDIS_URL || "redis://localhost:6379",
// });

const redisClient = createClient({
  username: ENV.REDIS_USERNAME,
  password: ENV.REDIS_PASSWORD,
  socket: {
    host: ENV.REDIS_HOST,
    port: ENV.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

await redisClient.connect();

export default redisClient;
