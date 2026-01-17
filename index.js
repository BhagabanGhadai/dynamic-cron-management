import express from 'express';
import router from './routes/index.js';
import { dbConnection } from './configs/db.js';
import { executeCronJobs } from './configs/cron.js'
import { env } from './configs/env.js';
import { initWorker } from './workers/cronWorker.js';

const app = express();
dbConnection();
app.use(express.json());
app.use('/api', router);
executeCronJobs();
initWorker();

app.listen(env.APP_PORT, () => {
    console.log("Server is running on port 3000");
});