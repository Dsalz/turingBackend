/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';
import helperUtils from '../misc/helperUtils';

export default {
  /**
   * @description method for getting category by id
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} category data
   */
  getCategoryById: async (req, res) => {
    const { requestedCategory } = req;
    try {
      return res.status(200).send(requestedCategory);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting category by product
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} category data
   */
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
  /**
   * @description method for getting category by department
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} category data
   */
  getCategoryByDepartment: async (req, res) => {
    const { id } = req.params;

    try {
      const getCategoryResponse = await db.query(queries.getById('category', 'department_id'), id);
      return res.status(200).send(getCategoryResponse);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  /**
   * @description method for getting and paginating all categories
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @returns {object} category data
   */
  getAllCategories: async (req, res) => {
    const { order, page, limit } = req.query;
    const orderSort = order === 'desc' ? 'desc' : 'asc';
    try {
      const getCategoriesResponse = await db.query(queries.getAllAndSort('category', 'category_id', orderSort));
      const count = getCategoriesResponse.length;
      return res.status(200).send({
        count,
        rows: helperUtils.paginateData(getCategoriesResponse, page, limit),
        limit: Number(limit) || count,
        page: Number(page) || 1
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
};
