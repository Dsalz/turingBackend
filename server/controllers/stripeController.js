/* eslint-disable camelcase */
import stripe from 'stripe';
import dotenv from 'dotenv';
import db from '../database/config';
import queries from '../database/queries';

dotenv.config();

const stripeLib = stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default {
  /**
   * @description method for creating stripe charge
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} stripe response object
   */
  createCharge: async (req, res) => {
    const { stripeToken, order_id, description, amount, currency } = req.body;
    try {
      const chargeResponse = await stripeLib.charges.create({
        amount,
        description,
        currency: currency || 'usd',
        source: stripeToken,
        metadata: { order_id },
      });
      return res.status(200).send(chargeResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for handling stripe webhook events
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {undefined}
   */
  webhookHandler: async (req, res) => {
    const stripeSignature = req.headers['stripe-signature'];
    let stripeEvent;
    try {
      // using webhook signature to decode stripe event
      stripeEvent = stripe.webhooks.constructEvent(req.body, stripeSignature, webhookSecret);
    } catch (err) {
      return res.status(400).send({ error: err.message });
    }

    // Getting order Id from metadata
    const { order_id } = stripeEvent.data.object.metadata;

    switch (stripeEvent.type) {
    case 'charge.succeeded':
      // updating order status to paid when charge successfully carried out
      await db.query(queries.updateOrderStatusProcedure, [order_id, 1]);
      break;
    default:
      res.status(400).end();
      break;
    }

    // Acknowledge receipt of event
    return res.status(200).send({ received: true });
  },
};
