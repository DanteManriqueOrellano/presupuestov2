import { Redis } from "ioredis";
  export const redisTest = async (redis: Redis, userId: string, userEmail: string): Promise<void> => {
  await redis.set(userId, userEmail, "ex", 60);
}