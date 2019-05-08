/* eslint-disable camelcase */
import { USR_REQUIRED_FIELD, USR_INVALID_EMAIL, USR_INVALID_EMAIL_PASSWORD, USR_EMAIL_ALREADY_EXISTS, USR_INVALID_PHONE, USR_INVALID_CARD, USR_EMAIL_NOT_FOUND } from '../misc/errorCodes';
import responses from '../misc/responses';
import db from '../database/config';
import queries from '../database/queries';
import tokenizer from '../middlewares/tokenizer';

export default {
  signUserUp: async (req, res) => {
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

    const emailRegex = /\S[@]\S+[.]\S/;
    if (!name) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The name field is required', 'name'));
    }
    if (!email) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The email field is required', 'email'));
    }
    if (!password) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The password field is required', 'password'));
    }
    if (typeof email !== 'string' || !(emailRegex.test(email))) {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL, 'Invalid Email', 'email'));
    }
    if (typeof password !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL_PASSWORD, 'Invalid Password', 'password'));
    }
    if (day_phone && String(day_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'day_phone'));
    }
    if (eve_phone && String(eve_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'eve_phone'));
    }
    if (mob_phone && String(mob_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'mob_phone'));
    }
    if (credit_card && String(credit_card).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_CARD, 'Invalid credit card details', 'credit_card'));
    }

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
      const { id } = createdCustomer;
      const token = await tokenizer.createToken({ id, email });
      res.status(200).send({ message: 'User successfully created', customer: { schema: createdCustomer }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  logUserIn: async (req, res) => {
    const {
      email,
      password } = req.body;

    const emailRegex = /\S[@]\S+[.]\S/;
    if (!email) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The email field is required', 'email'));
    }
    if (!password) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The password field is required', 'password'));
    }
    if (typeof email !== 'string' || !(emailRegex.test(email))) {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL, 'Invalid Email', 'email'));
    }
    if (typeof password !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL_PASSWORD, 'Invalid Password', 'password'));
    }
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
      const { id } = existingUser;
      const token = await tokenizer.createToken({ id, email });
      res.status(200).send({ message: 'User successfully logged in', customer: { schema: existingUser }, accessToken: `Bearer ${token}`, expires_in: '24h' });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  }
};
