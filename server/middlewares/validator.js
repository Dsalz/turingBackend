/* eslint-disable camelcase */
import {
  USR_REQUIRED_FIELD,
  USR_INVALID_FIELD,
  USR_INVALID_SHIPPING_ID,
  USR_INVALID_EMAIL,
  USR_INVALID_EMAIL_PASSWORD,
  USR_INVALID_PHONE,
  USR_INVALID_CARD,
  PAG_ORDER_NOT_MATCHED,
  PRO_NOT_FOUND,
  DEP_NOT_FOUND,
  DEP_INVALID_ID,
  CAT_NOT_FOUND,
  ATT_NOT_FOUND,
  ORD_NOT_FOUND,
  TAX_NOT_FOUND,
  CAR_NOT_FOUND,
  ITM_NOT_FOUND
} from '../misc/errorCodes';
import db from '../database/config';
import queries from '../database/queries';
import responses from '../misc/responses';

export default {
  /**
   * @description middleware method for validating email field passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateEmail: (req, res, next) => {
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
  /**
   * @description middleware method for validating name field passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateName: (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The name field is required', 'name'));
    }
    return next();
  },
  /**
   * @description method for returning middleware to validate password field passed in body
   * @param {bool} required - Boolean value depicting if password is required for route or not
   * @returns {undefined}
   */
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
  /**
   * @description middleware method for validating all phone number fields passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validatePhoneNumbers: (req, res, next) => {
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
  /**
   * @description middleware method for validating credit card field passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateCreditCard: (req, res, next) => {
    const { credit_card } = req.body;
    if (!credit_card) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'The credit card field is required', 'credit_card'));
    }
    if (credit_card && String(credit_card).length < 7) {
      return res.status(400).send(responses.invalidField(USR_INVALID_CARD, 'Invalid credit card details', 'credit_card'));
    }
    return next();
  },

  /**
   * @description middleware method for validating address fields passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateAddress: (req, res, next) => {
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

  /**
   * @description middleware method for validating order fields passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateOrder: (req, res, next) => {
    const {
      cart_id,
      shipping_id,
      tax_id
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
    return next();
  },
  /**
   * @description middleware method for validating id passed in route
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validatePathId: async (req, res, next) => {
    const { id } = req.params;
    const invalidNumber = /\D/g.test(id);

    if (invalidNumber) {
      return res.status(404).send({ error: { message: 'Endpoint not found' } });
    }

    return next();
  },
  /**
   * @description middleware method for validating pagination fields passed as queries in route
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validatePaginationQuery: async (req, res, next) => {
    const { order, page, limit, description_length, all_words } = req.query;
    const loweredOrder = order ? order.toLowerCase() : '';

    if (order && loweredOrder !== 'asc' && loweredOrder !== 'desc') {
      return res.status(400).send(responses.invalidField(PAG_ORDER_NOT_MATCHED, 'Invalid order', 'order'));
    }

    if (limit && /\D/g.test(limit)) {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid limit', 'limit'));
    }

    if (page && /\D/g.test(page)) {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid page', 'page'));
    }

    if (description_length && /\D/g.test(description_length)) {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid description length', 'description_length'));
    }

    if (all_words && all_words !== 'on' && all_words !== 'off') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid all words query parameter', 'all_words'));
    }

    req.query.order = loweredOrder;
    return next();
  },

  /**
   * @description middleware method for validating query string passed as a query in the route
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateSearchQuery: async (req, res, next) => {
    const { query_string } = req.query;
    if (!query_string) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Query string is required', 'query_string'));
    }

    return next();
  },

  /**
   * @description middleware method for validating review fields passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateReview: async (req, res, next) => {
    const { review, rating } = req.body;
    if (!review) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Review is required', 'review'));
    }

    if (typeof review !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid review', 'review'));
    }

    if (!rating) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Rating is required', 'rating'));
    }

    if (typeof rating !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid rating', 'rating'));
    }

    return next();
  },
  /**
   * @description middleware method for validating product id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateProductId: async (req, res, next) => {
    const { id } = req.params;
    const getProductResponse = await db.query(queries.getProductByIdProcedure, id);
    const requestedProduct = getProductResponse[0][0];

    if (!requestedProduct) {
      return res.status(404).send(responses.invalidField(PRO_NOT_FOUND, 'Product with Id does not exist', 'id'));
    }
    req.requestedProduct = requestedProduct;
    return next();
  },
  /**
   * @description middleware method for validating department id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateDepartmentId: async (req, res, next) => {
    const { id } = req.params;
    const invalidNumber = /\D/g.test(id);

    if (invalidNumber) {
      return res.status(400).send(responses.invalidField(DEP_INVALID_ID, 'Invalid department id', 'id'));
    }
    const getDepartmentResponse = await db.query(queries.getDepartmentProcedure, id);
    const requestedDepartment = getDepartmentResponse[0][0];

    if (!requestedDepartment) {
      return res.status(404).send(responses.invalidField(DEP_NOT_FOUND, 'Department with Id does not exist', 'id'));
    }
    req.requestedDepartment = requestedDepartment;
    return next();
  },

  /**
   * @description middleware method for validating category id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateCategoryId: async (req, res, next) => {
    const { id } = req.params;
    const getCategoryResponse = await db.query(queries.getById('category', 'category_id'), id);
    const requestedCategory = getCategoryResponse[0];

    if (!requestedCategory) {
      return res.status(404).send(responses.invalidField(CAT_NOT_FOUND, 'Category with id does not exist', 'id'));
    }
    req.requestedCategory = requestedCategory;
    return next();
  },

  /**
   * @description middleware method for validating attribute id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateAttributeId: async (req, res, next) => {
    const { id } = req.params;
    const getAttributeResponse = await db.query(queries.getById('attribute', 'attribute_id'), id);
    const requestedAttribute = getAttributeResponse[0];

    if (!requestedAttribute) {
      return res.status(404).send(responses.invalidField(ATT_NOT_FOUND, 'Attribute with Id does not exist', 'attribute_id'));
    }
    req.requestedAttribute = requestedAttribute;
    return next();
  },

  /**
   * @description middleware method for validating order id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateOrderId: async (req, res, next) => {
    const { id } = req.params;
    const getOrderResponse = await db.query(queries.getBriefOrderDetailsProcedure, id);
    const requestedOrder = getOrderResponse[0][0];

    if (!requestedOrder) {
      return res.status(404).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
    }
    req.requestedOrder = requestedOrder;
    return next();
  },

  /**
   * @description middleware method for validating tax id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateTaxId: async (req, res, next) => {
    const { id } = req.params;
    const getTaxResponse = await db.query(queries.getById('tax', 'tax_id'), id);
    const requestedTax = getTaxResponse[0];

    if (!requestedTax) {
      return res.status(404).send(responses.invalidField(TAX_NOT_FOUND, 'Tax with Id does not exist', 'id'));
    }
    req.requestedTax = requestedTax;
    return next();
  },
  /**
   * @description middleware method for validating cart id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateCartId: async (req, res, next) => {
    const { id } = req.params;
    const getCartResponse = await db.query(queries.getById('shopping_cart', 'cart_id'), id);
    const requestedCart = getCartResponse[0];

    if (!requestedCart) {
      return res.status(404).send(responses.invalidField(CAR_NOT_FOUND, 'Cart with Id does not exist', 'id'));
    }
    req.requestedCart = requestedCart;
    return next();
  },
  /**
   * @description middleware method for validating item id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateItemId: async (req, res, next) => {
    const { id } = req.params;
    const getItemResponse = await db.query(queries.getById('shopping_cart', 'item_id'), id);
    const requestedItem = getItemResponse[0];

    if (!requestedItem) {
      return res.status(404).send(responses.invalidField(ITM_NOT_FOUND, 'Item with Id does not exist', 'id'));
    }
    req.requestedItem = requestedItem;
    return next();
  },

  /**
   * @description middleware method for validating shipping region id passed in route
   * and verifying that it exists in the database
   *
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateShippingRegionId: async (req, res, next) => {
    const { id } = req.params;
    const getRegionResponse = await db.query(queries.getShippingRegionByIdProcedure, id);
    const requestedRegion = getRegionResponse[0];

    if (!requestedRegion.length && id !== '1') {
      return res.status(404).send(responses.invalidField(USR_INVALID_SHIPPING_ID, 'Shipping Region with Id does not exist', 'id'));
    }
    req.requestedShippingRegion = requestedRegion;
    return next();
  },

  /**
   * @description middleware method for validating stripe charge fields passed in body
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateStripeCharge: async (req, res, next) => {
    const { stripeToken, order_id, description, amount, currency } = req.body;

    if (!stripeToken) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Stripe token is required', 'stripeToken'));
    }

    if (typeof stripeToken !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid stripe token', 'stripeToken'));
    }
    if (!order_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Order id is required', 'order_id'));
    }

    if (typeof order_id !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid order id', 'order_id'));
    }
    if (!description) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Description is required', 'description'));
    }

    if (typeof description !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid description', 'description'));
    }
    if (!amount) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Amount is required', 'amount'));
    }

    if (typeof amount !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid amount', 'amount'));
    }
    if (currency && typeof currency !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid currency', 'currency'));
    }
    const getOrderResponse = await db.query(queries.getBriefOrderDetailsProcedure, order_id);
    const requestedOrder = getOrderResponse[0][0];
    if (!requestedOrder) {
      return res.status(404).send(responses.invalidField(ORD_NOT_FOUND, 'Order with Id does not exist', 'id'));
    }
    return next();
  },
  /**
   * @description middleware method for validating fields passed in body when adding product to cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateAddProductToCart: async (req, res, next) => {
    const { cart_id, product_id, attributes } = req.body;

    if (!cart_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Cart id is required', 'cart_id'));
    }

    if (typeof cart_id !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid cart id', 'cart_id'));
    }
    if (!product_id) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Product id is required', 'product_id'));
    }

    if (typeof product_id !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid product id', 'product_id'));
    }
    if (!attributes) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Attributes are required', 'attributes'));
    }

    if (typeof attributes !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid attributes', 'attributes'));
    }

    const getCartResponse = await db.query(queries.getById('shopping_cart', 'cart_id'), cart_id);
    const requestedCart = getCartResponse[0];

    if (!requestedCart) {
      return res.status(404).send(responses.invalidField(CAR_NOT_FOUND, 'Cart with Id does not exist', 'cart_id'));
    }

    const getProductResponse = await db.query(queries.getProductByIdProcedure, product_id);
    const requestedProduct = getProductResponse[0][0];

    if (!requestedProduct) {
      return res.status(404).send(responses.invalidField(PRO_NOT_FOUND, 'Product with Id does not exist', 'product_id'));
    }
    return next();
  },
  /**
   * @description middleware method for validating quanity field passed in body when updating cart
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateUpdateCartItem: async (req, res, next) => {
    const { quantity } = req.body;
    if (typeof quantity !== 'number') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid quantity', 'quantity'));
    }
    return next();
  },
  /**
   * @description middleware method for validating access token field passed in body when
   * logging in with facebook
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - Function for passing to the next middleware
   * @returns {undefined}
   */
  validateAccessToken: async (req, res, next) => {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).send(responses.invalidField(USR_REQUIRED_FIELD, 'Access token is required', 'access_token'));
    }
    if (typeof access_token !== 'string') {
      return res.status(400).send(responses.invalidField(USR_INVALID_FIELD, 'Invalid access token', 'access_token'));
    }
    return next();
  },
};
