import express from 'express';

// Controllers
import stripeController from '../controllers/stripeController';

// Middlewares
import validator from '../middlewares/validator';
import tokenizer from '../middlewares/tokenizer';

const stripeRouter = express.Router();

// Route for creating charge
stripeRouter.post('/stripe/charge',
  tokenizer.verifyToken,
  validator.validateStripeCharge,
  stripeController.createCharge);

// Stripe Webhook
stripeRouter.post('/stripe/webhooks',
  stripeController.webhookHandler);


export default stripeRouter;
