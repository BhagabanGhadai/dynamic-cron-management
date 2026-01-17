import express from 'express';
import {
    createCronJob,
    getAllCronJobs,
    getCronJobById,
    updateCronJob,
    deleteCronJob
} from '../controllers/cronJobController.js';


import validateRequest from '../middleware/validateRequest.js';
import { validateCronJob } from '../validators/cronJobValidation.js';

const cronRouter = express.Router();

cronRouter.post('/', validateRequest(validateCronJob), createCronJob);
cronRouter.get('/', getAllCronJobs);
cronRouter.get('/:id', getCronJobById);
cronRouter.put('/:id', validateRequest(validateCronJob), updateCronJob);
cronRouter.delete('/:id', deleteCronJob);

export default cronRouter;