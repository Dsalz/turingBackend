/* eslint-disable camelcase */
import { DEP_INVALID_ID, DEP_NOT_FOUND } from '../misc/errorCodes';
import db from '../database/config';
import queries from '../database/queries';
import responses from '../misc/responses';

export default {
  getDepartment: async (req, res) => {
    const { id } = req.params;
    const invalidNumber = /\D/g.test(id);

    if (invalidNumber) {
      return res.status(400).send(responses.invalidField(DEP_INVALID_ID, 'Invalid department id', 'id'));
    }
    try {
      const getDepartmentResponse = await db.query(queries.getDepartmentProcedure, id);
      const requestedDepartment = getDepartmentResponse[0][0];

      if (!requestedDepartment) {
        return res.status(400).send(responses.invalidField(DEP_NOT_FOUND, 'Department with Id does not exist', 'id'));
      }
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
