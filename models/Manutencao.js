const { dbAll, dbGet, dbRun } = require("./database");

class Manutencao {
  static async criar(veiculoId, clienteId, tipo, descricao, valor) {
    const sql = `
      INSERT INTO manutencoes 
      (veiculo_id, cliente_id, tipo, descricao, valor) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [veiculoId, clienteId, tipo, descricao, valor]);
    
    return await this.buscarPorId(result.id);
  }

  static async buscarTodos() {
    const sql = `
      SELECT 
        m.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM manutencoes m
      INNER JOIN clientes c ON m.cliente_id = c.id
      INNER JOIN veiculos v ON m.veiculo_id = v.id
      ORDER BY m.data DESC
    `;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        m.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM manutencoes m
      INNER JOIN clientes c ON m.cliente_id = c.id
      INNER JOIN veiculos v ON m.veiculo_id = v.id
      WHERE m.id = ?
    `;
    return await dbGet(sql, [id]);
  }

  static async buscarPorCliente(clienteId) {
    const sql = `SELECT * FROM manutencoes WHERE cliente_id = ?`;
    return await dbAll(sql, [clienteId]);
  }

  static async buscarPorVeiculo(veiculoId) {
    const sql = `SELECT * FROM manutencoes WHERE veiculo_id = ?`;
    return await dbAll(sql, [veiculoId]);
  }

  static async atualizarStatus(id, status) {
    const sql = `UPDATE manutencoes SET status = ? WHERE id = ?`;
    await dbRun(sql, [status, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM manutencoes WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Manutencao;