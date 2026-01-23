import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second by default
});

export const limiters = {
  // Strict limiter for Auth routes (5 attempts per minute per IP)
  auth: new RateLimiterMemory({
    points: 5,
    duration: 60, 
  }),
  
  // General API limiter (100 requests per minute)
  api: new RateLimiterMemory({
    points: 100,
    duration: 60,
  }),
};

export async function checkRateLimit(limiter: RateLimiterMemory, key: string) {
  try {
    await limiter.consume(key);
    return { success: true };
  } catch (rejRes) {
    return { success: false, retryAfter: (rejRes as any).msBeforeNext / 1000 };
  }
}
