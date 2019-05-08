export default {
  createNew: table => `INSERT INTO ${table} set ?`,
  getById: table => `Select * from ${table} where id = ?`,
  getByEmail: table => `Select * from ${table} where email = ?`,
  getAll: table => `Select * from ${table}`,
  updateById: table => `UPDATE ${table} SET item = ? WHERE id = ?`,
  deleteById: table => `DELETE FROM ${table} where id = ?`,
};
