/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
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
  getBriefOrder: async (req, res) => {
    const { requestedOrder } = req;

    try {
      return res.status(200).send(requestedOrder);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getCustomerOrders: async (req, res) => {
    const { id } = req.user;

    try {
      const getOrdersResponse = await db.query(queries.getCustomerOrdersProcedure, id);
      return res.status(200).send({ orders: getOrdersResponse[0] });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
