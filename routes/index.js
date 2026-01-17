import express from 'express';
import cronRouter from './cron.js';
import executionLogRouter from './execution.js';
const router = express.Router();

router.get('/health-check',(req,res)=>{
    res.status(200).send({
        status: "healthy",
        message: "Server is running smoothly"
    })
})
router.use('/cron',cronRouter);
router.use('/execution-logs',executionLogRouter);

export default router;