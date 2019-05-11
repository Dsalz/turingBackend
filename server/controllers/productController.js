/* eslint-disable camelcase */
import db from '../database/config';
import queries from '../database/queries';
import helperUtils from '../misc/helperUtils';

export default {
  getProductById: async (req, res) => {
    const { requestedProduct } = req;
    try {
      return res.status(200).send(requestedProduct);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getProductDetails: async (req, res) => {
    const { id } = req.params;
    try {
      const getProductDetailsResponse = await db.query(queries.getProductDetailsProcedure, id);
      const requestedProductDetails = getProductDetailsResponse[0][0];
      return res.status(200).send(requestedProductDetails);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getProductLocation: async (req, res) => {
    const { id } = req.params;
    try {
      const getProductLocationResponse = await db.query(queries.getProductLocationProcedure, id);
      const requestedProductLocation = getProductLocationResponse[0][0];
      return res.status(200).send(requestedProductLocation);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getProductReviews: async (req, res) => {
    const { id } = req.params;
    try {
      const getProductReviewResponse = await db.query(queries.getProductReviewsProcedure, id);
      const requestedReviews = getProductReviewResponse[0];
      return res.status(200).send(requestedReviews);
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  postProductReview: async (req, res) => {
    const { id } = req.params;
    const { rating, review } = req.body;
    try {
      const dbInfo = [req.user.id, id, review, rating];
      await db.query(queries.createProductReviewProcedure, dbInfo);
      return res.status(200).send();
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getProductByCategory: async (req, res) => {
    const { id } = req.params;
    let { page, limit, description_length } = req.query;
    page = page || 1;
    limit = limit || 20;
    description_length = description_length || 200;
    const startIndex = (page - 1) * limit;
    const dbInfo = [id, description_length, limit, startIndex];
    try {
      const getProductResponse = await db.query(queries.getProductsByCategoryProcedure, dbInfo);
      const countProductResponse = await db.query(queries.countProductsByCategoryProcedure, id);
      const requestedProducts = getProductResponse[0];
      return res.status(200).send({
        total: countProductResponse[0][0].categories_count,
        rows: requestedProducts
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getProductByDepartment: async (req, res) => {
    const { id } = req.params;
    let { page, limit, description_length } = req.query;
    page = page || 1;
    limit = limit || 20;
    description_length = description_length || 200;
    const startIndex = (page - 1) * limit;
    const dbInfo = [id, description_length, limit, startIndex];
    try {
      const getProductResponse = await db.query(queries.getProductsByDepartmentProcedure, dbInfo);
      const countProductResponse = await db.query(queries.countProductsByDepartmentProcedure, id);
      const requestedProducts = getProductResponse[0];
      return res.status(200).send({
        total: countProductResponse[0][0].products_on_department_count,
        rows: requestedProducts
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  getAllProducts: async (req, res) => {
    let { page, limit, description_length } = req.query;
    page = page || 1;
    limit = limit || 200;
    description_length = description_length || 200;
    const startIndex = (page - 1) * limit;
    const dbInfo = [description_length, description_length, limit, startIndex];
    try {
      const getProductsResponse = await db.query(queries.getAllProductsProcedure, dbInfo);
      return res.status(200).send({
        total: getProductsResponse.length,
        rows: helperUtils.paginateData(getProductsResponse, page, limit)
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  },
  searchProducts: async (req, res) => {
    const { query_string } = req.query;
    let { page, limit, description_length, all_words } = req.query;
    page = page || 1;
    limit = limit || 20;
    description_length = description_length || 200;
    all_words = all_words || 'on';
    const startIndex = (page - 1) * limit;
    const dbInfo = [query_string, all_words, description_length, limit, startIndex];
    try {
      const getProductsResponse = await db.query(queries.productSearchProcedure, dbInfo);
      const countProductsResponse = await db.query(queries.countProductSearchProcedure,
        [query_string, all_words]);
      return res.status(200).send({
        total: countProductsResponse[0][0]['count(*)'],
        rows: getProductsResponse[0]
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }
};
