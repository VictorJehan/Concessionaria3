const { dbAll, dbGet, dbRun } = require("./database");

class Vendedor {
  static async criar(nome, setor) {
    const sql = `INSERT INTO vendedores (nome, setor) VALUES (?, ?)`;
    const result = await dbRun(sql, [nome, setor]);
    return {
      id: result.id,
      nome,
      setor,
    };
  }

  static async buscarTodos() {
    const sql = `SELECT * FROM vendedores ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `SELECT * FROM vendedores WHERE id = ?`;
    return await dbGet(sql, [id]);
  }

  static async atualizar(id, nome, setor) {
    const sql = `UPDATE vendedores SET nome = ?, setor = ? WHERE id = ?`;
    await dbRun(sql, [nome, setor, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM vendedores WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Vendedor;