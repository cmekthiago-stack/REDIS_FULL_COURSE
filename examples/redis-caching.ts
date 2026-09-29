import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";
const redis = createClient({ url: redisUrl });

// cache key

const cacheKey = "example:products"
const cacheTtlSeconds = 60 

let dbProducts = ["Mouse", "Keyboard", "Monitor", "Headphones"];

async function run(){
  await redis.connect();

  // first request - cache miss
  let cached = await redis.get(cacheKey);

  // second request - cache hit

  if(cached){
    console.log("cache hit")
    console.log("data", JSON.parse(cached))
  } else {
    console.log("cache miss")
    // Read from main db
    
    const products = dbProducts

    // set/ save the products in cache
    // setEX - saves ttl so that your cache doesn't live forever
    
    await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(products));

    // stale cache problems

    dbProducts = ["Mouse", "Keyboard", "Monitor", "Headphones", "Desktop"];
    console.log(dbProducts, "dbProducts")

    cached = await redis.get(cacheKey);
    console.log("cached Data", JSON.parse(cached!));

    //cache invalidation
    await redis.del(cacheKey);
    console.log("Cache deleted");
    cached = await redis.get(cacheKey);

    if(!cached){
      console.log("Cache data after deleted");

      const freshProducts = dbProducts;
      await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(freshProducts));
     
    } 
    console.log("fresh data");

      

      // set/ save the products in cache
      // setEX - saves ttl so that your cache doesn't live forever



  }


  await redis.quit();
}

run().catch((error) => {
  console.error("Caching demo failed",error);
  process.exit(1);
});

