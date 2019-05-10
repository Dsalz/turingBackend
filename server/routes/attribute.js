import express from 'express';

// Controllers
import attributeController from '../controllers/attributeController';

// Middlewares
import validator from '../middlewares/validator';

const attributeRouter = express.Router();

// Route for getting attributes
attributeRouter.get('/attributes',
  attributeController.getAllAttributes);

// Route for getting attribute values
attributeRouter.get('/attributes/values/:id',
  validator.validatePathId(),
  attributeController.getAttributeValues);

// Route for getting attribute values by product id
attributeRouter.get('/attributes/inProduct/:id',
  validator.validatePathId(),
  attributeController.getAttributeByProduct);

// Route for getting attribute by id
attributeRouter.get('/attributes/:id',
  validator.validatePathId(),
  attributeController.getAttributeById);


export default attributeRouter;
