/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  /**
   * @description method for getting department by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} department information
   */
  getDepartment: async (req, res) => {
    const { requestedDepartment, params } = req;
    const { id } = params;
    try {
      return res.status(200).send({ department_id: Number(id), ...requestedDepartment });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting all departments
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {array} all departments
   */
  getAllDepartments: async (req, res) => {
    try {
      const getDepartmentsResponse = await db.query(queries.getAllDepartmentsProcedure);
      return res.status(200).send(getDepartmentsResponse[0]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
