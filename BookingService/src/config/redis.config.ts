import IORedis from 'ioredis';
import RedLock from 'redlock';
import { serverConfig } from '.';

export const redisClient = new IORedis(serverConfig.REDIS_SERVER_URL);


export const redLock = new RedLock([redisClient], {
  driftFactor: 0.01, // default recommended (1%)
  retryCount: 3, // retry acquiring lock
  retryDelay: 200, // ms between retries
  retryJitter: 100, // random delay to avoid collisions
});



