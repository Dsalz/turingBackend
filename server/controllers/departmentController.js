/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';

export default {
  getDepartment: async (req, res) => {
    const { requestedDepartment, params } = req;
    const { id } = params;
    try {
      return res.status(200).send({ department_id: Number(id), ...requestedDepartment });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllDepartments: async (req, res) => {
    try {
      const getDepartmentsResponse = await db.query(queries.getAllDepartmentsProcedure);
      return res.status(200).send({ departments: getDepartmentsResponse[0] });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
