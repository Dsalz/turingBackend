import express from 'express';

// Routes
import customerRouter from './user';

const router = express.Router();

router.use(customerRouter);

export default router;
