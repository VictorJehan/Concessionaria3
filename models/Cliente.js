const { dbAll, dbGet, dbRun } = require("./database");

class Cliente {
  static async criar(nome, email) {
    const sql = `INSERT INTO clientes (nome, email) VALUES (?, ?)`;
    const result = await dbRun(sql, [nome, email]);
    return {
      id: result.id,
      nome,
      email,
    };
  }

  static async buscarTodos() {
    const sql = `SELECT * FROM clientes ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `SELECT * FROM clientes WHERE id = ?`;
    return await dbGet(sql, [id]);
  }

  static async buscarPorEmail(email) {
    const sql = `SELECT * FROM clientes WHERE email = ?`;
    return await dbGet(sql, [email]);
  }

  static async atualizar(id, nome, email) {
    const sql = `UPDATE clientes SET nome = ?, email = ? WHERE id = ?`;
    await dbRun(sql, [nome, email, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM clientes WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Cliente;