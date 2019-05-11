export default {
  createNew: table => `INSERT INTO ${table} set ?`,
  getById: (table, id) => `Select * from ${table} where ${id} = ?`,
  getByEmail: table => `Select * from ${table} where email = ?`,
  getAll: table => `Select * from ${table}`,
  getAllAndSort: (table, sortBy, order) => `Select * from ${table} ORDER BY ${sortBy} ${order}`,
  getAllByValue: (table, value) => `Select * from ${table} where ${value} = ?`,
  updateById: table => `UPDATE ${table} SET ? WHERE id = ? `,
  updateByEmail: table => `UPDATE ${table} SET ? WHERE email = ? `,
  deleteById: table => `DELETE FROM ${table} where id = ?`,

  // Product Procedures
  getProductAttributesProcedure: 'CALL catalog_get_product_attributes(?)',

  // Order Procedures
  getOrderDetailsProcedure: 'CALL orders_get_order_details(?)',
  getBriefOrderDetailsProcedure: 'CALL orders_get_order_short_details(?)',
  getCustomerOrdersProcedure: 'CALL orders_get_by_customer_id(?)',
  createOrderProcedure: 'CALL shopping_cart_create_order(?,?,?,?)',

  // Department Procedures
  getDepartmentProcedure: 'CALL catalog_get_department_details(?)',
  getAllDepartmentsProcedure: 'CALL catalog_get_departments()',
  getDepartmentCategoriesProcedure: 'CALL catalog_get_department_categories(?)',

  // Category Procedures
  getProductCategoriesProcedure: 'CALL catalog_get_categories_for_product(?)',

  // Customer Procedures
  createCustomerProcedure: 'CALL customer_add(?,?,?)',
  getCustomerByEmailProcedure: 'CALL customer_get_login_info(?)',
  getCustomerByIdProcedure: 'CALL customer_get_customer(?)',
  updateCustomerProcedure: 'CALL customer_update_account(?,?,?,?,?,?,?)',
  updateCustomerCreditCardProcedure: 'CALL customer_update_credit_card(?,?)',
  updateCustomerAddressProcedure: 'CALL customer_update_address(?,?,?,?,?,?,?,?)',

  // Product Procedures
  getProductByIdProcedure: 'CALL catalog_get_product_info(?)',
  getProductDetailsProcedure: 'CALL catalog_get_product_details(?)',
  getProductLocationProcedure: 'CALL catalog_get_product_locations(?)',
  productSearchProcedure: 'CALL catalog_search(?,?,?,?,?)',
  countProductSearchProcedure: 'CALL catalog_count_search_result(?,?)',
  countProductsByCategoryProcedure: 'CALL catalog_count_products_in_category(?)',
  countProductsByDepartmentProcedure: 'CALL catalog_count_products_on_department(?)',
  getProductsByCategoryProcedure: 'CALL catalog_get_products_in_category(?,?,?,?)',
  getProductsByDepartmentProcedure: 'CALL catalog_get_products_on_department(?,?,?,?)',
  getProductReviewsProcedure: 'CALL catalog_get_product_reviews(?)',
  createProductReviewProcedure: 'CALL catalog_create_product_review(?,?,?,?)',
  getAllProductsProcedure: "SELECT product_id, name, IF(LENGTH(description) <= ?,description,CONCAT(LEFT(description, ?),'...')) AS description,price, discounted_price, thumbnail FROM product ORDER BY display DESC",
  countAllProductsProcedure: 'CALL catalog_count_products_on_catalog()',

  // Shipping Region Procedures
  getAllShippingRegionsProcedure: 'CALL customer_get_shipping_regions()',
  getShippingRegionByIdProcedure: 'CALL orders_get_shipping_info(?)'
};
