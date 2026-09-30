
import dotenv from "dotenv";
import { createClient } from "redis";
import {redisClient} from "../redis/client"

const notification_channel = "notification";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";

export interface NotificationsPayload{
    id: string;
    title: string;
    message: string;
    createdAt: string;
}

export async function publishNotification(notification:NotificationsPayload): Promise<void>{
    await redisClient.publish(notification_channel, JSON.stringify(notification));
}

const subscriberClient = createClient({url: redisUrl})
subscriberClient.on("error", (err)=>{
  console.error("subs redis error", err);
})

async function startNotificationSubscriber(){
  await subscriberClient.connect()

  await subscriberClient.subscribe(notification_channel, (message)=>{
    try{
      const notification = JSON.parse(message) as NotificationsPayload;

      console.log("New noti received", notification)
      console.log("title", notification.title)
      console.log("message", notification.message)
      console.log("createdAt", notification.createdAt)



    }catch{
      console.log("New noti received (new)", message)
    }
  })
}
startNotificationSubscriber().catch((err)=>{
 console.error("failed to start noti", err) ;
 process.exit(1);
}
)
//export const notificationSubscriber = async () => {
  //  const subscriber = redisClient.duplicate();
    //subscriber.subscribe(notification_channel, (err, count) => {
      //  if (err) {
        //    console.error(`Failed to subscribe: ${err}`);
        //} else {
          //  console.log(`Subscribed successfully! Now listening for messages in ${notification_channel}...`);
        //}
    //});

    //subscriber.on("message", (channel, message) => {
        // Handle the received message
      //  console.log(`Received message from ${channel}: ${message}`);
    //});
//}