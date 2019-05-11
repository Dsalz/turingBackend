/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';
import helperUtils from '../misc/helperUtils';

export default {
  getCategoryById: async (req, res) => {
    const { requestedCategory } = req;
    try {
      return res.status(200).send(requestedCategory);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getCategoryByProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const getCategoryResponse = await db.query(queries.getProductCategoriesProcedure, id);
      const requestedCategory = getCategoryResponse[0][0];
      return res.status(200).send([requestedCategory]);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getCategoryByDepartment: async (req, res) => {
    const { id } = req.params;

    try {
      const getCategoryResponse = await db.query(queries.getById('category', 'department_id'), id);
      return res.status(200).send(getCategoryResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllCategories: async (req, res) => {
    const { order, page, limit } = req.query;
    const orderSort = order === 'desc' ? 'desc' : 'asc';
    try {
      const getCategoriesResponse = await db.query(queries.getAllAndSort('category', 'category_id', orderSort));
      const total = getCategoriesResponse.length;
      return res.status(200).send({
        categories: helperUtils.paginateData(getCategoriesResponse, page, limit),
        limit: Number(limit) || total,
        total,
        page: Number(page) || 1
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
};
