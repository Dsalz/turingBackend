import express from 'express';

// Controllers
import shoppingCartController from '../controllers/shoppingCartController';

// Middlewares
import validator from '../middlewares/validator';

const shoppingCartRouter = express.Router();

// Route for getting unique cart id
shoppingCartRouter.get('/shoppingcart/generateUniqueId',
  shoppingCartController.getCartId);

// Route for adding product to cart
shoppingCartRouter.post('/shoppingcart/add',
  validator.validateAddProductToCart,
  shoppingCartController.addProductToCart);

// Route for updating an item in cart
shoppingCartRouter.put('/shoppingcart/update/:id',
  validator.validatePathId,
  validator.validateItemId,
  validator.validateUpdateCartItem,
  shoppingCartController.updateShoppingCart);

// Route for removing item from cart
shoppingCartRouter.delete('/shoppingcart/removeProduct/:id',
  validator.validatePathId,
  validator.validateItemId,
  shoppingCartController.removeItemFromCart);

// Route for emptying shopping cart
shoppingCartRouter.delete('/shoppingcart/empty/:id',
  validator.validateCartId,
  shoppingCartController.emptyShoppingCart);

// Route for moving item to cart
shoppingCartRouter.get('/shoppingcart/moveToCart/:id',
  validator.validatePathId,
  validator.validateItemId,
  shoppingCartController.moveToCart);

// Route for getting total amount
shoppingCartRouter.get('/shoppingcart/totalAmount/:id',
  validator.validateCartId,
  shoppingCartController.getTotalAmount);

// Route for saving item for later
shoppingCartRouter.get('/shoppingcart/saveForLater/:id',
  validator.validatePathId,
  validator.validateItemId,
  shoppingCartController.saveForLater);

// Route for getting saved items
shoppingCartRouter.get('/shoppingcart/getSaved/:id',
  validator.validateCartId,
  shoppingCartController.getSavedItem);

// Route for getting products in cart
shoppingCartRouter.get('/shoppingcart/:id',
  validator.validateCartId,
  shoppingCartController.getProductsFromCart);

export default shoppingCartRouter;
