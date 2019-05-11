import express from 'express';

// Controllers
import shippingRegionController from '../controllers/shippingRegionController';

// Middlewares
import validator from '../middlewares/validator';

const shippingRegionRouter = express.Router();

// Route for getting all shipping regions
shippingRegionRouter.get('/shipping/regions',
  shippingRegionController.getAllShippingRegions);

// Route for getting shipping region by id
shippingRegionRouter.get('/shipping/regions/:id',
  validator.validatePathId,
  validator.validateShippingRegionId,
  shippingRegionController.getShippingRegion);


export default shippingRegionRouter;
