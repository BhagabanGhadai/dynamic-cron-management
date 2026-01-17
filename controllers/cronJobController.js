import { createQueue, removeJobFromQueue } from '../configs/queue.js';
import CronJob from '../models/cronJobSchema.js';
import { scheduleCronJob } from '../configs/cron.js';
import redisClient from '../configs/redis.js';

export const createCronJob = async (req, res) => {
    try {
        const cronJob = new CronJob(req.body);
        await Promise.all([
            cronJob.save(),
            redisClient.hset('cron-jobs', cronJob.name, cronJob.cronExpression),
            scheduleCronJob(cronJob)
        ])
        res.status(201).json(cronJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCronJobs = async (req, res) => {
    try {
        const cronJobs = await CronJob.find();
        res.status(200).json(cronJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCronJobById = async (req, res) => {
    try {
        const cronJob = await CronJob.findById(req.params.id);
        if (!cronJob) return res.status(404).json({ message: 'CronJob not found' });
        res.status(200).json(cronJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCronJob = async (req, res) => {
    try {
        const cronJob = await CronJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cronJob) return res.status(404).json({ message: 'CronJob not found' });
        await Promise.all([
            cronJob.save(),
            redisClient.hset('cron-jobs', cronJob.name, cronJob.cronExpression),
            scheduleCronJob(cronJob)
        ])
        res.status(200).json(cronJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteCronJob = async (req, res) => {
    try {
        const cronJob = await CronJob.findByIdAndDelete(req.params.id);
        if (!cronJob) return res.status(404).json({ message: 'CronJob not found' });

        const queue = createQueue('cron-jobs');
        await Promise.all([
            redisClient.del(`lock:${cronJob.name}`),
            redisClient.hdel('cron-jobs', cronJob.name),
            removeJobFromQueue(queue, cronJob.name)
        ]);

        res.status(200).json({ message: 'CronJob deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
