import { Worker } from "bullmq";
import { connection } from "../lib/queue";

const worker = new Worker(
  "research-queue",
  async (job) => {
    const { id, data } = job;
    console.log(`Processing job ${id} with data:`, data);

    console.log(`✅ Job ${job.id} completed!`);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.info(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`${job?.id} has failed with ${err.message}`);
});
