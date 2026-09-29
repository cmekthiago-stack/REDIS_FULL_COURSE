import {createClient} from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";

export const redisClient = createClient({
  url: redisUrl,
});
redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("ready", () => console.log("Redis client ready"));
redisClient.on("error", (error) => console.log("Redis client error", error));
redisClient.on("end", () => console.log("Redis client connected closed"));

export async function connectRedis(): Promise<void> {
  if(!redisClient.isOpen){
    await redisClient.connect();
  }

  const pong = await redisClient.ping()
  console.log('redis ping response', pong)
}

export async function disconnectRedis(): Promise<void> {
  if(redisClient.isOpen){
    await redisClient.quit();
  }
}

// The Cache-Aside Pattern is a caching strategy where the application first checks the cache for the requested data.
//  If the data is found (a cache hit), it is returned directly to the application, ensuring fast access.
//  If the data is not found (a cache miss), the application retrieves it from the main database, stores a copy in the cache, and returns the fetched data.
//  This pattern is widely used to improve the efficiency and scalability of applications by ensuring frequently accessed data is quickly available.
//  The cache hit occurs when the application requests data and finds it in the cache, avoiding a trip to the primary database, which significantly reduces latency and load on the database.