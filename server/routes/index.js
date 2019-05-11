import express from 'express';

// Routes
import customerRouter from './customer';
import orderRouter from './order';
import departmentRouter from './department';
import categoryRouter from './categories';
import attributeRouter from './attribute';
import productRouter from './product';
import taxRouter from './tax';
import shippingRegionRouter from './shippingRegion';
import stripeRouter from './stripe';

const router = express.Router();

router.use(customerRouter);
router.use(orderRouter);
router.use(departmentRouter);
router.use(categoryRouter);
router.use(attributeRouter);
router.use(productRouter);
router.use(taxRouter);
router.use(shippingRegionRouter);
router.use(stripeRouter);

export default router;
