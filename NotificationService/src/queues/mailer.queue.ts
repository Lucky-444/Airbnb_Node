import { Queue } from "bullmq";

import { getRedisConnection } from "../config/redis.config";

export const MAILER_QUEUE_NAME = "mailer-queue";

// Create a BullMQ queue for handling mailer tasks, using the singleton Redis connection
export const mailerQueue = new Queue(MAILER_QUEUE_NAME, {
  connection: getRedisConnection(), // Use the singleton Redis connection
  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false, // IMPORTANT → keep failed jobs
  },
});

export const DLQ_QUEUE_NAME = "mailer-dlq";

export const mailerDLQ = new Queue(DLQ_QUEUE_NAME, {
  connection: getRedisConnection(),
});

