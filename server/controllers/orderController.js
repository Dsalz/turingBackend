/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for creating order
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} object containing the order id
   */
  createOrder: async (req, res) => {
    const {
      cart_id,
      shipping_id,
      tax_id
    } = req.body;
    const { id } = req.user;
    try {
      const createdOrderResponse = await db.query(queries.createOrderProcedure,
        [cart_id, id, shipping_id, tax_id]);
      return res.status(200).send(createdOrderResponse[0][0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting long order details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} order data
   */
  getOrder: async (req, res) => {
    const { id } = req.params;
    try {
      const getOrderDetailsResponse = await db.query(queries.getOrderDetailsProcedure, id);
      const requestedOrderDetails = getOrderDetailsResponse[0][0];
      return res.status(200).send(requestedOrderDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for getting short order details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} order data
   */
  getBriefOrder: async (req, res) => {
    const { requestedOrder } = req;

    try {
      return res.status(200).send(requestedOrder);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting orders by logged in user
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} customer's orders
   */
  getCustomerOrders: async (req, res) => {
    const { id } = req.user;

    try {
      const getOrdersResponse = await db.query(queries.getCustomerOrdersProcedure, id);
      return res.status(200).send(getOrdersResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
