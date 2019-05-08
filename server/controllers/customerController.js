/* eslint-disable camelcase */
import { USR_INVALID_EMAIL_PASSWORD, USR_EMAIL_ALREADY_EXISTS, USR_EMAIL_NOT_FOUND } from '../misc/errorCodes';
import responses from '../misc/responses';
import db from '../database/config';
import queries from '../database/queries';
import tokenizer from '../middlewares/tokenizer';

export default {
  signCustomerUp: async (req, res) => {
    const {
      name,
      email,
      password,
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      day_phone, eve_phone,
      mob_phone,
      credit_card } = req.body;

    const newCustomer = {
      name,
      email,
      password,
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      day_phone,
      eve_phone,
      mob_phone,
      credit_card
    };
    try {
      const existingUser = await db.query(queries.getByEmail('customer'), email);
      if (existingUser.length) {
        return res.status(400).send(responses.invalidField(USR_EMAIL_ALREADY_EXISTS, 'Email already exists', 'email'));
      }
      await db.query(queries.createNew('customer'), newCustomer);
      const createdCustomerResponse = await db.query(queries.getByEmail('customer'), email);
      const createdCustomer = createdCustomerResponse[0];
      delete createdCustomer.password;
      const { customer_id } = createdCustomer;
      const token = await tokenizer.createToken({ id: customer_id, email });
      res.status(200).send({ message: 'User successfully created', customer: { schema: createdCustomer }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  logCustomerIn: async (req, res) => {
    const {
      email,
      password } = req.body;
    try {
      const existingUserResponse = await db.query(queries.getByEmail('customer'), email);
      const existingUser = existingUserResponse[0];
      if (!existingUser) {
        return res.status(400).send(responses.invalidField(USR_EMAIL_NOT_FOUND, 'User with email does not exist', 'email'));
      }
      const validPassword = password === existingUser.password;
      if (!validPassword) {
        return res.status(401).send(responses.invalidField(USR_INVALID_EMAIL_PASSWORD, 'Invalid password', 'password'));
      }
      delete existingUser.password;
      const { customer_id } = existingUser;
      const token = await tokenizer.createToken({ id: customer_id, email });
      res.status(200).send({ message: 'User successfully logged in', customer: { schema: existingUser }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  updateCustomer: async (req, res) => {
    const { id } = req.user;
    const { name, email, password, day_phone, eve_phone, mob_phone } = req.body;
    const updatedCustomer = { name, email, password, day_phone, eve_phone, mob_phone };

    try {
      const existingUserResponse = await db.query(queries.getByEmail('customer'), email);
      const user = existingUserResponse[0] || {};
      if (existingUserResponse.length && user.customer_id !== id) {
        return res.status(400).send(responses.invalidField(USR_EMAIL_ALREADY_EXISTS, 'Email already exists', 'email'));
      }
      updatedCustomer.password = password || user.password;
      await db.query(queries.updateByEmail('customer'), [updatedCustomer, email]);
      delete user.password;
      delete updatedCustomer.password;
      res.status(200).send({ ...user, ...updatedCustomer });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getCustomer: async (req, res) => {
    const { id } = req.user;
    try {
      const getUserResponse = await db.query(queries.getById('customer', 'customer_id'), id);
      const user = getUserResponse[0];
      delete user.password;
      res.status(200).send({ ...user });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  updateCustomerAddress: async (req, res) => {
    const { email } = req.user;
    const {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      shipping_region_id
    } = req.body;
    const updatedCustomer = {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      shipping_region_id
    };

    try {
      const getUserResponse = await db.query(queries.getByEmail('customer'), email);
      const user = getUserResponse[0];
      await db.query(queries.updateByEmail('customer'), [updatedCustomer, email]);
      delete user.password;
      res.status(200).send({ ...user, ...updatedCustomer });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  updateCustomerCreditCard: async (req, res) => {
    const { email } = req.user;
    const { credit_card } = req.body;
    const updatedCustomer = { credit_card };

    try {
      const getUserResponse = await db.query(queries.getByEmail('customer'), email);
      const user = getUserResponse[0];
      await db.query(queries.updateByEmail('customer'), [updatedCustomer, email]);
      delete user.password;
      res.status(200).send({ ...user, ...updatedCustomer });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
};
