import express from 'express';

// Controllers
import categoriesController from '../controllers/categoriesController';

// Middlewares
import validator from '../middlewares/validator';

const categoriesRouter = express.Router();

// Route for getting all categories
categoriesRouter.get('/categories',
  validator.validatePaginationQuery,
  categoriesController.getAllCategories);

// Route for getting category by product
categoriesRouter.get('/categories/inProduct/:id',
  validator.validatePathId,
  validator.validateProductId,
  categoriesController.getCategoryByProduct);

// Route for getting category by product
categoriesRouter.get('/categories/inDepartment/:id',
  validator.validatePathId,
  validator.validateDepartmentId,
  categoriesController.getCategoryByDepartment);

// Route for getting category by id
categoriesRouter.get('/categories/:id',
  validator.validatePathId,
  validator.validateCategoryId,
  categoriesController.getCategoryById);


export default categoriesRouter;
