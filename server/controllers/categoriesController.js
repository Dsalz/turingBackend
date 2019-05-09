/* eslint-disable camelcase */
import { CAT_NOT_FOUND, PRO_NOT_FOUND } from '../misc/errorCodes';
import db from '../database/config';
import queries from '../database/queries';
import responses from '../misc/responses';
import helperUtils from '../misc/helperUtils';

export default {
  getCategoryById: async (req, res) => {
    const { id } = req.params;

    try {
      const getCategoryResponse = await db.query(queries.getById('category', 'category_id'), id);
      const requestedCategory = getCategoryResponse[0];

      if (!requestedCategory) {
        return res.status(404).send(responses.invalidField(CAT_NOT_FOUND, 'Category with id does not exist', 'id'));
      }
      return res.status(200).send(requestedCategory);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getCategoryByProduct: async (req, res) => {
    const { id } = req.params;

    try {
      const getProductResponse = await db.query(queries.getById('product_category', 'product_id'), id);
      const requestedProduct = getProductResponse[0];
      if (!requestedProduct) {
        return res.status(404).send(responses.invalidField(PRO_NOT_FOUND, 'Product with id does not exist', 'id'));
      }

      const { category_id } = requestedProduct;

      const getCategoryResponse = await db.query(queries.getById('category', 'category_id'), category_id);
      const requestedCategory = getCategoryResponse[0];
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
