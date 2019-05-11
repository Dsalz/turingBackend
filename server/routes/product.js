import express from 'express';

// Controllers
import productController from '../controllers/productController';

// Middlewares
import validator from '../middlewares/validator';
import tokenizer from '../middlewares/tokenizer';

const productRouter = express.Router();

// Route for getting all products
productRouter.get('/products',
  validator.validatePaginationQuery,
  productController.getAllProducts);

// Route for searching through products
productRouter.get('/products/search',
  validator.validateSearchQuery,
  validator.validatePaginationQuery,
  productController.searchProducts);

// Route for getting product by category
productRouter.get('/products/inCategory/:id',
  validator.validatePathId,
  validator.validateCategoryId,
  validator.validatePaginationQuery,
  productController.getProductByCategory);

// Route for getting product by department
productRouter.get('/products/inDepartment/:id',
  validator.validatePathId,
  validator.validateDepartmentId,
  validator.validatePaginationQuery,
  productController.getProductByDepartment);

// Route for getting product by id
productRouter.get('/products/:id',
  validator.validatePathId,
  validator.validateProductId,
  productController.getProductById);

// Route for getting product details by id
productRouter.get('/products/:id/details',
  validator.validatePathId,
  validator.validateProductId,
  productController.getProductDetails);

// Route for getting product locations by id
productRouter.get('/products/:id/locations',
  validator.validatePathId,
  validator.validateProductId,
  productController.getProductLocation);

// Route for getting product reviews by id
productRouter.get('/products/:id/reviews',
  validator.validatePathId,
  validator.validateProductId,
  productController.getProductReviews);

// Route for posting product review
productRouter.post('/products/:id/reviews',
  tokenizer.verifyToken,
  validator.validatePathId,
  validator.validateProductId,
  validator.validateReview,
  productController.postProductReview);


export default productRouter;
