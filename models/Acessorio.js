const { dbAll, dbGet, dbRun } = require("./database");

class Acessorio {
  static async criar(nome, descricao, preco) {
    const sql = `
      INSERT INTO acessorios (nome, descricao, preco) 
      VALUES (?, ?, ?)
    `;
    const result = await dbRun(sql, [nome, descricao || null, preco]);
    return {
      id: result.id,
      nome,
      descricao,
      preco,
    };
  }

  static async buscarTodos() {
    const sql = `SELECT * FROM acessorios ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `SELECT * FROM acessorios WHERE id = ?`;
    return await dbGet(sql, [id]);
  }

  static async atualizar(id, nome, descricao, preco) {
    const sql = `
      UPDATE acessorios 
      SET nome = ?, descricao = ?, preco = ?
      WHERE id = ?
    `;
    await dbRun(sql, [nome, descricao || null, preco, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM acessorios WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Acessorio;