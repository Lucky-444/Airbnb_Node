import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../config/redis.config";
import { DLQ_QUEUE_NAME } from "../queues/mailer.queue";
import logger from "../config/logger.config";

export const setupDLQWorker = () => {
  const dlqWorker = new Worker(
    DLQ_QUEUE_NAME,
    async (job: Job) => {
      console.error("🚨 DLQ JOB RECEIVED:", job.data);

      const { originalJobId, payload, error, failedAt } = job.data;

      // 🔥 What you can do here:

      // 1. Log properly
      logger.error("DLQ Job Failed Permanently", {
        originalJobId,
        payload,
        error,
        failedAt,
      });

      // 2. Store in DB (optional)
      // await FailedJobsModel.create({...})

      // 3. Send alert (future upgrade)
      // sendSlackAlert(...)
      // sendAdminEmail(...)

      // 4. Retry manually (optional logic)
      // await mailerQueue.add("payload:mail", payload);

      console.log(`Handled DLQ job for original job ${originalJobId}`);
    },
    {
      connection: getRedisConnection(),
    },
  );

  dlqWorker.on("completed", (job) => {
    console.log(`DLQ Job ${job.id} processed successfully`);
  });

  dlqWorker.on("failed", (job, err) => {
    console.error(`DLQ Job ${job?.id} failed again:`, err);
  });
};
