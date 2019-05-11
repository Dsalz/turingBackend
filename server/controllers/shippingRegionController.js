/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for getting shipping region by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} shipping region data
   */
  getShippingRegion: async (req, res) => {
    const { requestedShippingRegion } = req;
    try {
      return res.status(200).send(requestedShippingRegion);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting all shipping regions
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} all shipping regions
   */
  getAllShippingRegions: async (req, res) => {
    try {
      const getShippingRegionsResponse = await db.query(queries.getAllShippingRegionsProcedure);
      return res.status(200).send(getShippingRegionsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
