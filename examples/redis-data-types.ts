
//string
//hash
//list
//set
//sorted list
//ttl

// string
//stores one value under one key
//plain text, numbers stored as text, counters
//key: page views
//value: "1000"

import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";
const redis = createClient({ url: redisUrl });

async function run(){
  //open connection to redis server
  await redis.connect();
  console.log("Connected to Redis")
  console.log("ping", await redis.ping());

  const stringKey = "demo: page_views"

  await redis.set(stringKey, "1000");
  const pageViews = await redis.get(stringKey);
  console.log("page views", pageViews);

  // trsing can also get incremented
  const afterIncr = await redis.incr(stringKey);
  console.log("page views", afterIncr)

  //hash  - stores many fields under one key
  //key: keyname
  //fields: name and email

  const hashKey = "demo:user:profile"
  await redis.hSet(hashKey, {
    name: "John Doe",
    email: "john.doe@example.com"
  });

  const user = await redis.hGetAll(hashKey);
  console.log("user", user)

  // list - redis list ordered collection of values
  
  const listKey = "demo:messages";
  await redis.lPush(listKey, "Hello");
  await redis.lPush(listKey, "World");
  const messages = await redis.lRange(listKey, 0, -1);
  console.log("messages", messages)

  const listiKey = "demo:messages";
  await redis.lPush(listKey, "Hello");
  await redis.rPush(listKey, "World");
  const messagess = await redis.lRange(listKey, 0, -1);
  console.log("messages", messagess)


  // lPush - adds an item at the beginneng of the list
  // rPush - adds an item at the end of the list
  // lRange - gets a range of items from the list
  //ltrim - keeps onl part of the list
  // set - redis set unordered collection of values

  const setKey = "demo:tags";
  await redis.sAdd(setKey, "tag1");
  await redis.sAdd(setKey, "tag2");
  await redis.sAdd(setKey, "tag2");

  const tags = await redis.sCard(setKey);
  console.log(tags)

  // sAdd - adds an item to the set
  // sCard - gets the number of items in the set
  // sMembers - gets all the items in the set
  // sIsMember - checks if an item is in the set
  // sRem - removes an item from the set

  // zset - redis zset ordered collection of values with a score

  const rankKey = "demo:rank"
  await redis.zAdd(rankKey, { score: 1030, value: "one" });
  await redis.zAdd(rankKey, { score: 2547, value: "two" });

  const newScore = await redis.zIncrBy(rankKey, 120, "one" );
  console.log(newScore)

  const rank = await redis.zRevRank(rankKey, "two")
  console.log(rank)

  // Get reverse rank of "two" (highest score = rank 0)

  //zRevRank - Gets the reverse rank (highest score = rank 0).

  //ttl/expiry - gets the time to live of a key
  //del - deletes a key

  const otpKey = "demo:otp"
  await redis.set(otpKey, "123456");
  await redis.expire(otpKey, 60);

  const ttl = await redis.ttl(otpKey);
  console.log(ttl)


  await redis.quit();
  



}

run().catch((error) => {
  console.error("Demo failed:",error)
  process.exit(1);
});
