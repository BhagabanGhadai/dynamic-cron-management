import cron from 'node-cron';
import CronJob from '../models/cronJobSchema.js';
import redisClient from './redis.js';
import { createQueue, addJobToQueue } from './queue.js';


export async function executeCronJobs() {
    const cronJobs = await CronJob.find({ isActive: true });
    const queue = createQueue('cron-jobs');
    cronJobs.map((cronJob) => {
        redisClient.hset('cron-jobs', cronJob.name, cronJob.cronExpression);
    })
    for (const cronJob of cronJobs) {
        const isScheduled = await redisClient.hget('cron-jobs', cronJob.name);
        if (!isScheduled) continue;
        await scheduleCronJob(cronJob, queue);
    }
}

export const scheduleCronJob = async (cronJob, queue = null) => {
    if (!queue) {
        queue = createQueue('cron-jobs');
    }
    cron.schedule(cronJob.cronExpression, async () => {
        const lock = await redisClient.set(`lock:${cronJob.name}`, cronJob.name, 'NX', 'EX', 60);
        if (lock) {
            await addJobToQueue(queue, cronJob.name, cronJob);
        }
    });
}