import Redis from "ioredis";
import { serverConfig } from ".";

/**
 * SINGLETON PATTERN: This function demonstrates the Singleton design pattern using
 * JavaScript closures. It ensures only ONE Redis connection instance exists throughout
 * the entire application lifecycle, preventing multiple unnecessary connections.
 */
function createRedisConnection() {
  // Extract Redis configuration from environment variables
  const redisHost = serverConfig.REDIS_HOST || "localhost";
  const redisPort = serverConfig.REDIS_PORT || 6379;

  try {
    // CLOSURE VARIABLE: 'connection' is declared in the outer function scope
    // and is accessible to the inner function. This creates a private variable
    // that persists as long as the returned function exists.
    let connection: Redis;

    // Store Redis configuration options
    const redisConfig = {
      port: redisPort,
      host: redisHost,
      maxRetriesPerRequest: null, //5 automatic retries to handle reconnection logic manually
    };

    // RETURN AN INNER FUNCTION: This function has access to the 'connection'
    // variable through closure, making it private and protected from external access
    return () => {
      // SINGLETON IMPLEMENTATION: Check if connection already exists
      // If it does, return the existing instance (no duplicate connections created)
      if (connection) {
        return connection;
      } else {
        // If connection doesn't exist yet, create it and cache it
        connection = new Redis(redisConfig);
        console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
        return connection;
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
