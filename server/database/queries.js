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
};
