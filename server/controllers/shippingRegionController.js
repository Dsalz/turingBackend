/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  getShippingRegion: async (req, res) => {
    const { requestedShippingRegion } = req;
    try {
      return res.status(200).send(requestedShippingRegion);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllShippingRegions: async (req, res) => {
    try {
      const getShippingRegionsResponse = await db.query(queries.getAllShippingRegionsProcedure);
      return res.status(200).send(getShippingRegionsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
