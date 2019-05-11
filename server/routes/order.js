import express from 'express';

// Controllers
import orderController from '../controllers/orderController';

// Middlewares
import validator from '../middlewares/validator';
import tokenizer from '../middlewares/tokenizer';

const orderRouter = express.Router();

// Route for creating new orders
orderRouter.post('/orders',
  tokenizer.verifyToken,
  validator.validateOrder,
  orderController.createOrder);

// Route for getting brief order details by id
orderRouter.get('/orders/shortDetail/:id',
  tokenizer.verifyToken,
  validator.validatePathId,
  validator.validateOrderId,
  orderController.getBriefOrder);

// Route for getting orders by logged in customer
orderRouter.get('/orders/inCustomer',
  tokenizer.verifyToken,
  orderController.getCustomerOrders);

// Route for getting order by id
orderRouter.get('/orders/:id',
  tokenizer.verifyToken,
  validator.validatePathId,
  validator.validateOrderId,
  orderController.getOrder);


export default orderRouter;
