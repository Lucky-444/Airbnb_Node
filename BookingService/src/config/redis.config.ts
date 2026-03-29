import IORedis, { Redis } from "ioredis";
import RedLock from "redlock";
import { serverConfig } from ".";

export const redisClient = new IORedis(serverConfig.REDIS_SERVER_URL);
function createRedisConnection() {
  try {
    // RETURN AN INNER FUNCTION: This function has access to the 'connection'
    // variable through closure, making it private and protected from external access
    return () => {
      // SINGLETON IMPLEMENTATION: Check if connection already exists
      // If it does, return the existing instance (no duplicate connections created)
      let connection: Redis | null = null;
      if (!connection) {
        // If connection doesn't exist yet, create it and cache it
        connection = new IORedis(serverConfig.REDIS_SERVER_URL);

        console.log(`Connected to Redis at ${serverConfig.REDIS_SERVER_URL}`);
        return connection;
      } else {
        return connection; // Return the existing connection instance
      }
    };
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error;
  }
}

/**
 * EXPORT SINGLETON INSTANCE: This immediately invokes createRedisConnection()
 * and stores the returned function. Each call to getRedisConnection() will
 * return the same Redis instance due to the singleton pattern.
 */
export const getRedisConnection = createRedisConnection();

export const redLock = new RedLock([redisClient], {
  driftFactor: 0.01, // default recommended (1%)
  retryCount: 3, // retry acquiring lock
  retryDelay: 200, // ms between retries
  retryJitter: 100, // random delay to avoid collisions
});
