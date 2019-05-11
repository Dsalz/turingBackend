/* eslint-disable camelcase */
import uuid from 'uuid';
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for generating cart id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} cart id
   */
  getCartId: async (req, res) => {
    try {
      const cart_id = uuid().replace(/[-]/g, '');
      await db.query(queries.createNew('shopping_cart'), { cart_id });
      return res.status(200).send({ cart_id });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for adding product to cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} an array of products in the cart
   */
  addProductToCart: async (req, res) => {
    const { cart_id, product_id, attributes } = req.body;
    try {
      await db.query(queries.addProductToShoppingCartProcedure, [cart_id, product_id, attributes]);
      const getCartProductsResponse = await db.query(queries.getProductFromShoppingCartProcedure,
        cart_id);
      return res.status(200).send(getCartProductsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting products in shopping cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} an array of products in the cart
   */
  getProductsFromCart: async (req, res) => {
    const { id } = req.params;
    try {
      const getCartProductsResponse = await db.query(queries.getProductFromShoppingCartProcedure,
        id);
      return res.status(200).send(getCartProductsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for updating the shopping cart by item
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} array of items in cart
   */
  updateShoppingCart: async (req, res) => {
    const { params, body, requestedItem } = req;
    const { id } = params;
    const { quantity } = body;
    const { cart_id } = requestedItem;
    try {
      await db.query(queries.updateShoppingCartProcedure, [id, quantity]);
      const getCartProductsResponse = await db.query(queries.getProductFromShoppingCartProcedure,
        cart_id);
      return res.status(200).send(getCartProductsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for removing item from cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined}
   */
  removeItemFromCart: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(queries.removeProductFromShoppingCartProcedure, id);
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for emptying shopping cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} empty array
   */
  emptyShoppingCart: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(queries.emptyShoppingCartProcedure, id);
      return res.status(200).send([]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for moving product to cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined}
   */
  moveToCart: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(queries.moveToCartProcedure, id);
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting cart total amount
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} object containing cart total amount
   */
  getTotalAmount: async (req, res) => {
    const { id } = req.params;
    try {
      const getTotalAmountResponse = await db.query(queries.getTotalAmountFromShoppingCartProcedure,
        id);
      return res.status(200).send(getTotalAmountResponse[0][0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for saving item for later
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined}
   */
  saveForLater: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query(queries.saveForLaterShoppingCartProcedure, id);
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for getting saved item
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} object containing item saved
   */
  getSavedItem: async (req, res) => {
    const { id } = req.params;
    try {
      const getSavedItemResponse = await db.query(queries.getSavedProductFromShoppingCartProcedure,
        id);
      return res.status(200).send(getSavedItemResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
};
