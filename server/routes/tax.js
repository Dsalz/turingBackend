import express from 'express';

// Controllers
import taxController from '../controllers/taxController';

// Middlewares
import validator from '../middlewares/validator';

const taxRouter = express.Router();

// Route for getting all taxes
taxRouter.get('/tax',
  taxController.getAllTax);

// Route for getting tax by id
taxRouter.get('/tax/:id',
  validator.validatePathId,
  validator.validateTaxId,
  taxController.getTax);


export default taxRouter;
