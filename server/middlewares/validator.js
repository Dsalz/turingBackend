/* eslint-disable camelcase */
import { USR_REQUIRED_FIELD, USR_INVALID_FIELD, USR_INVALID_SHIPPING_ID, USR_INVALID_EMAIL, USR_INVALID_EMAIL_PASSWORD, USR_INVALID_PHONE, USR_INVALID_CARD } from '../misc/errorCodes';
import responses from '../misc/responses';

export default {
  validateEmail: () => (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /\S[@]\S+[.]\S/;
    if (!email) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The email field is required', 'email'));
    }
    if ((email && typeof email !== 'string') || (email && !(emailRegex.test(email)))) {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL, 'Invalid Email', 'email'));
    }

    return next();
  },
  validateName: () => (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The name field is required', 'name'));
    }
    return next();
  },
  validatePassword: (required = false) => (req, res, next) => {
    const { password } = req.body;
    if (!password && required) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The password field is required', 'password'));
    }
    if (password && typeof password !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_EMAIL_PASSWORD, 'Invalid Password', 'password'));
    }
    return next();
  },
  validatePhoneNumbers: () => (req, res, next) => {
    const { day_phone, eve_phone, mob_phone } = req.body;
    if (day_phone && String(day_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'day_phone'));
    }
    if (eve_phone && String(eve_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'eve_phone'));
    }
    if (mob_phone && String(mob_phone).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_PHONE, 'Invalid phone number', 'mob_phone'));
    }
    return next();
  },

  validateCreditCard: (required = false) => (req, res, next) => {
    const { credit_card } = req.body;
    if (!credit_card && required) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The credit card field is required', 'credit_card'));
    }
    if (credit_card && String(credit_card).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_CARD, 'Invalid credit card details', 'credit_card'));
    }
    return next();
  },

  validateAddress: () => (req, res, next) => {
    const {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
      shipping_region_id
    } = req.body;
    if (!address_1) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The address field is required', 'address_1'));
    }
    if (typeof address_1 !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Address', 'address_1'));
    }
    if (address_2 && typeof address_2 !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Address', 'address_2'));
    }
    if (!city) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The city field is required', 'city'));
    }
    if (typeof city !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid City', 'city'));
    }
    if (!region) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The region field is required', 'region'));
    }
    if (typeof region !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Region', 'region'));
    }
    if (!postal_code) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The postal code field is required', 'postal_code'));
    }
    if (typeof postal_code !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Postal Code', 'postal_code'));
    }
    if (!country) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The country field is required', 'country'));
    }
    if (typeof country !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Country', 'country'));
    }
    if (!shipping_region_id) {
      return res.status(400).send(responses.invalidField(USR_INVALID_SHIPPING_ID, 'The shipping region field is required', 'shipping_region_id'));
    }
    if (typeof shipping_region_id !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_SHIPPING_ID, 'Invalid Shipping Region', 'shipping_region_id'));
    }
    return next();
  },
  validateOrder: () => (req, res, next) => {
    const {
      cart_id,
      shipping_id,
      tax_id,
      comments,
    } = req.body;
    if (!cart_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The cart id is required', 'cart_id'));
    }
    if (typeof cart_id !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Cart Id', 'cart_id'));
    }
    if (!shipping_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The shipping id is required', 'shipping_id'));
    }
    if (typeof shipping_id !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Shipping Id', 'shipping_id'));
    }
    if (!tax_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The tax id is required', 'tax_id'));
    }
    if (typeof tax_id !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Tax Id', 'tax_id'));
    }
    if (comments && typeof comments !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid Comment', 'comment'));
    }
    return next();
  },
  validatePathId: () => async (req, res, next) => {
    const { id } = req.params;
    const invalidNumber = /\D/g.test(id);

    if (invalidNumber) {
      return res.status(404).send({ error: { message: 'Endpoint not found' } });
    }

    return next();
  }
};
