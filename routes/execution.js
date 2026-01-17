import express from 'express';
import {
    createExecutionLog,
    getAllExecutionLogs,
    getExecutionLogsByJobId,
    getExecutionLogById,
    deleteExecutionLog
} from '../controllers/executionLogController.js';

import validateRequest from '../middleware/validateRequest.js';
import { validateExecutionLog } from '../validators/executionLogValidation.js';

const executionLogRouter = express.Router();

executionLogRouter.post('/', validateRequest(validateExecutionLog), createExecutionLog);
executionLogRouter.get('/', getAllExecutionLogs);
executionLogRouter.get('/job/:cronJobId', getExecutionLogsByJobId);
executionLogRouter.get('/:id', getExecutionLogById);
executionLogRouter.delete('/:id', deleteExecutionLog);

export default executionLogRouter;