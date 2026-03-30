import { Job, Worker } from "bullmq";
import { NotificationDTO } from "../dtos/notification.dto";
import { MAILER_QUEUE_NAME, mailerDLQ } from "../queues/mailer.queue";
import { getRedisConnection } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { renderTemplate } from "../templates/template.handler";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";


export const setupEmailWorker = () => {
  const emailProcessor = new Worker<NotificationDTO>(
    MAILER_QUEUE_NAME, // Name of the queue to process
    async (job: Job) => {
      if (!job.name || job.name !== MAILER_PAYLOAD) {
        throw new Error(
          `Invalid job name: ${job.name}. Expected: ${MAILER_PAYLOAD}`,
        );
      }

      const payload = job.data;
      console.log("Processing email job with payload:", payload);

      // Simulate email sending logic (replace with actual email sending code)
      const emailContent = await renderTemplate(payload.templateId, payload.params);

      await sendEmail(payload.to, payload.subject, emailContent);

      logger.info(`Email job with ID ${job.id} processed successfully.`); // Log successful processing
      
    }, // Processor function to handle the email sending logic

    {
      connection: getRedisConnection(), // Use the singleton Redis connection for the worker
    }, // connection options for the worker
  );

  emailProcessor.on("completed", (job) => {
    console.log(`Email Job ${job.id} completed successfully.`);
  });

  emailProcessor.on("failed", async (job, err) => {
    console.error(`Email Job ${job?.id} failed with error:`, err);

    if (job && job.attemptsMade === job.opts.attempts) {
      await mailerDLQ.add("FAILED_EMAIL", {
        originalJobId: job.id,
        payload: job.data,
        error: err.message,
        failedAt: new Date(),
      });

      logger.error(`Job ${job.id} moved to DLQ`);
    }
  });
};
