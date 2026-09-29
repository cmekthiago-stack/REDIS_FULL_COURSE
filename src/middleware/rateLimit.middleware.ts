import { Request, Response, NextFunction} from 'express';
import { redisClient } from '../redis/client';


const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5; 

export async function productRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
){
  try{
    // each ip will get its own counter in redis
    // real prod pattern - behind a proxy or load balancer

    const ip = req.ip || 'unknown';
    const rateLimitKey = `rate_limit:products:${ip}`

    const currentCount = await redisClient.incr(rateLimitKey) || 0;

    if(currentCount === 1){
      await redisClient.expire(rateLimitKey, RATE_LIMIT_WINDOW_SECONDS)
    }

    res.setHeader("X-Ratelimit-limit", RATE_LIMIT_MAX_REQUESTS)
    res.setHeader("X-RateLimit-Remaining", Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentCount))

    if(currentCount > RATE_LIMIT_MAX_REQUESTS){
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later"
      })
    }

    next();

  } catch(error){
    console.error("rate limit redis error ",error)
    next(error)
  }

}