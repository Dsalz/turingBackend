import express from 'express';

// Routes
import customerRouter from './customer';
import orderRouter from './order';
import departmentRouter from './department';
import categoryRouter from './categories';
import attributeRouter from './attribute';
import productRouter from './product';

const router = express.Router();

router.use(customerRouter);
router.use(orderRouter);
router.use(departmentRouter);
router.use(categoryRouter);
router.use(attributeRouter);
router.use(productRouter);

export default router;
