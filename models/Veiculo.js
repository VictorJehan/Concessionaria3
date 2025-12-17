const { dbAll, dbGet, dbRun } = require("./database");

class Veiculo {
  static async criar(marca, modelo, ano) {
    const sql = `INSERT INTO veiculos (marca, modelo, ano) VALUES (?, ?, ?)`;
    const result = await dbRun(sql, [marca, modelo, ano]);
    return {
      id: result.id,
      marca,
      modelo,
      ano,
      disponivel: 1,
    };
  }

  static async buscarTodos() {
    const sql = `SELECT * FROM veiculos ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `SELECT * FROM veiculos WHERE id = ?`;
    return await dbGet(sql, [id]);
  }

  static async buscarDisponiveis() {
    const sql = `SELECT * FROM veiculos WHERE disponivel = 1 ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async buscarVendidos() {
    const sql = `SELECT * FROM veiculos WHERE disponivel = 0 ORDER BY created_at DESC`;
    return await dbAll(sql);
  }

  static async atualizar(id, marca, modelo, ano, disponivel) {
    const sql = `
      UPDATE veiculos 
      SET marca = ?, modelo = ?, ano = ?, disponivel = ?
      WHERE id = ?
    `;
    await dbRun(sql, [marca, modelo, ano, disponivel, id]);
  }

  static async marcarComoVendido(id) {
    const sql = `UPDATE veiculos SET disponivel = 0 WHERE id = ?`;
    await dbRun(sql, [id]);
  }

  static async marcarComoDisponivel(id) {
    const sql = `UPDATE veiculos SET disponivel = 1 WHERE id = ?`;
    await dbRun(sql, [id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM veiculos WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Veiculo;