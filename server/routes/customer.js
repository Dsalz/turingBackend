import express from 'express';

// Controllers
import customerController from '../controllers/customerController';

// Middlewares
import validator from '../middlewares/validator';
import tokenizer from '../middlewares/tokenizer';

const customerRouter = express.Router();

// Route for signing new customers up
customerRouter.post('/customers',
  validator.validateName(true),
  validator.validateEmail(true),
  validator.validatePassword(true),
  validator.validatePhoneNumbers(),
  validator.validateCreditCard(),
  customerController.signCustomerUp);

// Route for logging customers in
customerRouter.post('/customers/login',
  validator.validateEmail(true),
  validator.validatePassword(true),
  customerController.logCustomerIn);

// Route for updating customer information
customerRouter.put('/customer',
  tokenizer.verifyToken,
  validator.validateName(true),
  validator.validateEmail(true),
  validator.validatePassword(),
  validator.validatePhoneNumbers(),
  customerController.updateCustomer);

// Route for getting customer information
customerRouter.get('/customer',
  tokenizer.verifyToken,
  customerController.getCustomer);

// Route for updating customer address
customerRouter.put('/customers/address',
  tokenizer.verifyToken,
  validator.validateAddress(),
  customerController.updateCustomerAddress);

// Route for updating customer credit card
customerRouter.put('/customers/creditCard',
  tokenizer.verifyToken,
  validator.validateCreditCard(true),
  customerController.updateCustomerCreditCard);


export default customerRouter;