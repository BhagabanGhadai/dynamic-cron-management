import { Queue, Worker } from 'bullmq';
import connection from './redis.js'


const queues = new Map();
export function createQueue(queueName) {
    if (queues.has(queueName)) {
        return queues.get(queueName);
    }
    console.log('Creating queue:', queueName);
    const queue = new Queue(queueName, {
        connection,
        limiter: {
            max: 10,
            duration: 1000
        }
    });
    queues.set(queueName, queue);
    return queue;
}

const workers = new Map();
export function createWorker(queueName, processor) {
    if (workers.has(queueName)) {
        return workers.get(queueName);
    }
    console.log('Creating worker:', queueName);
    const worker = new Worker(queueName, processor, {
        connection,
        concurrency: 10,
        autorun: true
    });
    workers.set(queueName, worker);
    return worker;
}



export async function addJobToQueue(queue, jobName, jobData) {
    console.log('Adding job to queue:', jobName);
    return await queue.add(jobName, jobData, {
        jobId: `${queue.name}-${jobName}`,
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
    });
}

export async function removeJobFromQueue(queue, jobName) {
    const jobId = `${queue.name}-${jobName}`;
    const job = await queue.getJob(jobId);
    if (job) {
        console.log(`Removing job ${jobId} from queue.`);
        await job.remove();
    } else {
        console.log(`Job ${jobId} not found in queue.`);
    }
}