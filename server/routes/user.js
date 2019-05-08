import express from 'express';

// Controllers
import customerController from '../controllers/customerController';

const customerRouter = express.Router();

customerRouter.post('/customers', customerController.signUserUp);
customerRouter.post('/customers/login', customerController.logUserIn);


export default customerRouter;
