import express from 'express';

// Routes
import customerRouter from './customer';

const router = express.Router();

router.use(customerRouter);

export default router;
