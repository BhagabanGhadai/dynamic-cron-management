
import { createWorker } from '../configs/queue.js';
import axios from 'axios';
import { registerExecutionLog } from '../controllers/executionLogController.js';

const processCronJob = async (job) => {
    const { name, webhookUrl, _id } = job.data;
    console.log(`Processing job: ${name}`);

    let status = 'SUCCESS';
    let responseStatus = null;
    let responseBody = null;
    let errorData = null;

    try {
        const response = await axios.post(webhookUrl);
        responseStatus = response.status;
        responseBody = response.data;
        console.log(`Job "${name}" executed successfully.`);
    } catch (error) {
        status = 'FAILURE';
        responseStatus = error.response ? error.response.status : 500;
        errorData = {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : null
        };
        console.error(`Job "${name}" failed: ${error.message}`);
    }
    await registerExecutionLog(_id, status, responseStatus, responseBody, errorData);
};

export const initWorker = () => {
    const worker = createWorker('cron-jobs', processCronJob);
    console.log('Worker started for queue: cron-jobs');

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`Job ${job.id} failed with ${err.message}`);
    });
};
