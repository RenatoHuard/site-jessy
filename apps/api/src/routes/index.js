import { Router } from 'express';
import healthCheck from './health-check.js';
import uploadRouter from './upload.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/upload', uploadRouter);

    return router;
};
