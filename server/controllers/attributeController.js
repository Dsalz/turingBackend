/* eslint-disable camelcase */
import { ATT_NOT_FOUND } from '../misc/errorCodes';
import db from '../database/config';
import queries from '../database/queries';
import responses from '../misc/responses';

export default {
  getAttributeById: async (req, res) => {
    const { id } = req.params;
    try {
      const getAttributeResponse = await db.query(queries.getById('attribute', 'attribute_id'), id);
      const requestedAttribute = getAttributeResponse[0];

      if (!requestedAttribute) {
        return res.status(404).send(responses.invalidField(ATT_NOT_FOUND, 'Attribute with Id does not exist', 'attribute_id'));
      }
      return res.status(200).send(requestedAttribute);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAttributeValues: async (req, res) => {
    const { id } = req.params;
    try {
      const getAttributesResponse = await db.query(queries.getById('attribute_value', 'attribute_id'), id);
      return res.status(200).send(getAttributesResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },

  getAttributeByProduct: async (req, res) => {
    const { id } = req.params;
    try {
      const getAttributeResponse = await db.query(queries.getProductAttributesProcedure, id);
      return res.status(200).send(getAttributeResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllAttributes: async (req, res) => {
    try {
      const getAttributesResponse = await db.query(queries.getAll('attribute'));
      return res.status(200).send({ attributes: getAttributesResponse });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
