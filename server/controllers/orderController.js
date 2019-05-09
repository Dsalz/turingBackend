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
      tax_id,
      comments,
    } = req.body;
    const { id } = req.user;
    const newOrder = {
      reference: cart_id,
      shipping_id,
      tax_id,
      customer_id: id,
      created_on: new Date(),
      comments,
    };

    try {
      const createdOrder = await db.query(queries.createNew('orders'), newOrder);
      const { insertId } = createdOrder;
      await db.query(queries.createNew('order_detail'), { order_id: insertId });
      res.status(200).send({ orderId: insertId });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const getOrderDetailsResponse = await db.query(queries.getAllByValue('order_detail', 'order_id'), id);
      const requestedOrderDetails = getOrderDetailsResponse[0];

      if (!requestedOrderDetails) {
        return res.status(400).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
      }
      const { quantity, unit_price } = requestedOrderDetails;
      const subtotal = quantity && unit_price ? Number(unit_price) * quantity : 0;
      return res.status(200).send({ ...requestedOrderDetails, subtotal });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getBriefOrder: async (req, res) => {
    const { id } = req.params;

    try {
      const getOrderResponse = await db.query(queries.getById('orders', 'order_id'), id);
      const requestedOrder = getOrderResponse[0];

      if (!requestedOrder) {
        return res.status(400).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
      }

      return res.status(200).send({ ...requestedOrder });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getCustomerOrders: async (req, res) => {
    const { id } = req.user;

    try {
      const getOrdersResponse = await db.query(queries.getAllByValue('orders', 'customer_id'), id);
      return res.status(200).send({ orders: getOrdersResponse });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  }
};
