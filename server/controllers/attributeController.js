/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for getting attribute by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} attribute data
   */
  getAttributeById: async (req, res) => {
    const { requestedAttribute } = req;
    try {
      return res.status(200).send(requestedAttribute);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  /**
   * @description method for getting attribute values by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} list of sttributes
   */
  getAttributeValues: async (req, res) => {
    const { id } = req.params;
    try {
      const getAttributesResponse = await db.query(queries.getById('attribute_value', 'attribute_id'), id);
      return res.status(200).send(getAttributesResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting attribute by product
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} list of attributes
   */
  getAttributeByProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const getAttributeResponse = await db.query(queries.getProductAttributesProcedure, id);
      return res.status(200).send(getAttributeResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting all attributes
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} list of attributes
   */
  getAllAttributes: async (req, res) => {
    try {
      const getAttributesResponse = await db.query(queries.getAll('attribute'));
      return res.status(200).send(getAttributesResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
