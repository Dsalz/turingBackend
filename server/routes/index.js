import express from 'express';

// Routes
import customerRouter from './customer';
import orderRouter from './order';
import departmentRouter from './department';
import categoryRouter from './categories';

const router = express.Router();

router.use(customerRouter);
router.use(orderRouter);
router.use(departmentRouter);
router.use(categoryRouter);

export default router;
