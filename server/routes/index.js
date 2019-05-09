import express from 'express';

// Routes
import customerRouter from './customer';
import orderRouter from './order';

const router = express.Router();

router.use(customerRouter);
router.use(orderRouter);

export default router;
