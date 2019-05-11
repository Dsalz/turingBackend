/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  getTax: async (req, res) => {
    const { requestedTax } = req;
    try {
      return res.status(200).send(requestedTax);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllTax: async (req, res) => {
    try {
      const getTaxResponse = await db.query(queries.getAll('tax'));
      return res.status(200).send(getTaxResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
