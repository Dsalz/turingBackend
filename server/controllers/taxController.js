/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for getting tax item by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} tax item data
   */
  getTax: async (req, res) => {
    const { requestedTax } = req;
    try {
      return res.status(200).send(requestedTax);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting all tax items
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} all tax items
   */
  getAllTax: async (req, res) => {
    try {
      const getTaxResponse = await db.query(queries.getAll('tax'));
      return res.status(200).send(getTaxResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
