//Publishers and Subscribers: 
// Publishers are clients that send messages to specific channels,
//  while subscribers are clients that receive messages from those channels. Subscribers can subscribe to one or more channels.

// Channels: Channels are the communication pathways in Redis Pub/Sub. 
// Messages are published to specific channels, and subscribers listen to messages on one or more channels.
//  Channels are identified by names, such as "news," "chatroom," or "events".

//Publish-Subscribe Model: 
// In this model, publishers and subscribers are decoupled.
// Publishers publish messages to channels without knowing who, if anyone, is listening. 
// Subscribers receive messages from channels without knowing who, if anyone, is publishing.

import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";

const channel = "Demo:notifications";

async function run (){
  // a client publishes and the other subscribes

  const publisher = createClient({url:redisUrl})
  const subscriber = createClient({url:redisUrl})

  await publisher.connect()
  await subscriber.connect();

  console.log('publisher connected')
  console.log('subscriber connected')
  console.log("Ping ->", await publisher.ping())
  console.log("Subscriber listens")

  await subscriber.subscribe(channel, (message) =>{
    const data = JSON.parse(message)

    console.log("Subscriber received")
    console.log("title", data.title)
    console.log("message", data.message)
  })
  console.log("subscribed to channel", channel)

  console.log("Publisher is now sending events")

  const event = {
    title: "Redis course",
    message: "pub/sub demo"
  }
  const receivers = await publisher.publish(channel, JSON.stringify(event))
  console.log("published to channel", channel, "with active", receivers, "receivers")

  await new Promise ((resolve) => setTimeout(resolve, 300))

  await subscriber.unsubscribe(channel)
  await subscriber.quit()
  await publisher.quit()

  console.log("pub/sub demo done")
} 
run().catch((error) => {
  console.error("pub/sub demo failed",error);
  process.exit(1);
});

