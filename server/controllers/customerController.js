/* eslint-disable camelcase */
import uuid from 'uuid';
import { USR_INVALID_EMAIL_PASSWORD, USR_EMAIL_ALREADY_EXISTS, USR_EMAIL_NOT_FOUND } from '../misc/errorCodes';
import responses from '../misc/responses';
import db from '../database/config';
import queries from '../database/queries';
import tokenizer from '../middlewares/tokenizer';

export default {

  /**
   * @description method for signing customer up
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer data
   */
  signCustomerUp: async (req, res) => {
    const {
      name,
      email,
      password
    } = req.body;
    try {
      const existingUserResponse = await db.query(queries.getCustomerByEmailProcedure, email);
      if (existingUserResponse[0].length) {
        return res.status(400).send(responses.invalidField(USR_EMAIL_ALREADY_EXISTS, 'Email already exists', 'email'));
      }
      const createUserResponse = await db.query(queries.createCustomerProcedure,
        [name, email, password]);
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        createUserResponse[0][0]['LAST_INSERT_ID()']);
      const createdCustomer = getCustomerResponse[0][0];
      delete createdCustomer.password;
      const { customer_id } = createdCustomer;
      const token = await tokenizer.createToken({ id: customer_id, email });
      return res.status(200).send({ message: 'User successfully created', customer: { schema: createdCustomer }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for logging customer in
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer data
   */
  logCustomerIn: async (req, res) => {
    const {
      email,
      password } = req.body;
    try {
      const existingUserResponse = await db.query(queries.getCustomerByEmailProcedure, email);
      const existingUser = existingUserResponse[0][0];
      if (!existingUser) {
        return res.status(404).send(responses.invalidField(USR_EMAIL_NOT_FOUND, 'User with email does not exist', 'email'));
      }
      const validPassword = password === existingUser.password;
      if (!validPassword) {
        return res.status(401).send(responses.invalidField(USR_INVALID_EMAIL_PASSWORD, 'Invalid password', 'password'));
      }
      const { customer_id } = existingUser;
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        customer_id);
      const userDetails = getCustomerResponse[0][0];
      delete userDetails.password;
      const token = await tokenizer.createToken({ id: customer_id, email });
      return res.status(200).send({ message: 'User successfully logged in', customer: { schema: userDetails }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for logging users in from facebook
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer data
   */
  facebookLogin: async (req, res) => {
    const {
      emails,
      displayName } = req.user;
    const email = emails[0];
    try {
      const existingUserResponse = await db.query(queries.getCustomerByEmailProcedure, email);
      const existingUser = existingUserResponse[0][0];

      // Logging them straight in if they already have an account on the platform
      if (existingUser) {
        const { customer_id } = existingUser;
        const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
          customer_id);
        const userDetails = getCustomerResponse[0][0];
        delete userDetails.password;
        const token = await tokenizer.createToken({ id: customer_id, email });
        return res.status(200).send({ customer: { schema: userDetails }, accessToken: `Bearer ${token}`, expires_in: '24h' });
      }

      // Creating a new account for them if they don't exist on the platform
      const createUserResponse = await db.query(queries.createCustomerProcedure,
        [displayName, email, uuid()]);
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        createUserResponse[0][0]['LAST_INSERT_ID()']);
      const createdCustomer = getCustomerResponse[0][0];
      delete createdCustomer.password;
      const { customer_id } = createdCustomer;
      const token = await tokenizer.createToken({ id: customer_id, email });
      return res.status(200).send({ customer: { schema: createdCustomer }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for updating customer details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer's updated data
   */
  updateCustomer: async (req, res) => {
    const { id } = req.user;
    const { name, email, password, day_phone, eve_phone, mob_phone } = req.body;

    try {
      const existingUserResponse = await db.query(queries.getCustomerByEmailProcedure, email);
      const user = existingUserResponse[0][0] || {};
      if (existingUserResponse[0].length && user.customer_id !== id) {
        return res.status(400).send(responses.invalidField(USR_EMAIL_ALREADY_EXISTS, 'Email already exists', 'email'));
      }
      const updateInfo = [
        id, name, email, password || user.password, day_phone, eve_phone, mob_phone
      ];
      await db.query(queries.updateCustomerProcedure, updateInfo);
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        id);
      const userDetails = getCustomerResponse[0][0];
      delete userDetails.password;
      return res.status(200).send(userDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting logged in customer's details
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer data
   */
  getCustomer: async (req, res) => {
    const { id } = req.user;
    try {
      const getUserResponse = await db.query(queries.getCustomerByIdProcedure,
        id);
      const user = getUserResponse[0][0];
      delete user.password;
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for updating customer address
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer's updated data
   */
  updateCustomerAddress: async (req, res) => {
    const { id } = req.user;
    const {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      shipping_region_id
    } = req.body;
    const updateInfo = [
      id, address_1, address_2, city, region, postal_code, country, shipping_region_id
    ];

    try {
      await db.query(queries.updateCustomerAddressProcedure, updateInfo);
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        id);
      const userDetails = getCustomerResponse[0][0];
      delete userDetails.password;
      return res.status(200).send(userDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for updating customer's credit card data
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} customer's updated data
   */
  updateCustomerCreditCard: async (req, res) => {
    const { id } = req.user;
    const { credit_card } = req.body;

    try {
      await db.query(queries.updateCustomerCreditCardProcedure, [id, credit_card]);
      const getCustomerResponse = await db.query(queries.getCustomerByIdProcedure,
        id);
      const userDetails = getCustomerResponse[0][0];
      delete userDetails.password;
      return res.status(200).send(userDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
};
