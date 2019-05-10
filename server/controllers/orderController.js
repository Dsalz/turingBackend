/* eslint-disable camelcase */
import { ORD_NOT_FOUND } from '../misc/errorCodes';
import db from '../database/config';
import queries from '../database/queries';
import responses from '../misc/responses';

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

      if (!requestedOrderDetails) {
        return res.status(404).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
      }
      return res.status(200).send(requestedOrderDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getBriefOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const getOrderResponse = await db.query(queries.getBriefOrderDetailsProcedure, id);
      const requestedOrder = getOrderResponse[0][0];

      if (!requestedOrder) {
        return res.status(404).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
      }

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
