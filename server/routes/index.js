import express from 'express';

// Routes
import customerRouter from './customer';
import orderRouter from './order';
import departmentRouter from './department';

const router = express.Router();

router.use(customerRouter);
router.use(orderRouter);
router.use(departmentRouter);

export default router;
