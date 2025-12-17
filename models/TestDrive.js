const { dbAll, dbGet, dbRun } = require("./database");

class TestDrive {
  static async criar(clienteId, veiculoId, vendedorId, dataAgendamento, observacoes) {
    const sql = `
      INSERT INTO test_drives 
      (cliente_id, veiculo_id, vendedor_id, data_agendamento, observacoes) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [
      clienteId,
      veiculoId,
      vendedorId,
      dataAgendamento,
      observacoes || null,
    ]);
    
    return await this.buscarPorId(result.id);
  }

  static async buscarTodos() {
    const sql = `
      SELECT 
        t.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        v.marca,
        v.modelo,
        v.ano,
        vd.nome as vendedor_nome
      FROM test_drives t
      INNER JOIN clientes c ON t.cliente_id = c.id
      INNER JOIN veiculos v ON t.veiculo_id = v.id
      INNER JOIN vendedores vd ON t.vendedor_id = vd.id
      ORDER BY t.data_agendamento DESC
    `;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        t.*,
        c.nome as cliente_nome,
        c.email as cliente_email,
        v.marca,
        v.modelo,
        v.ano,
        vd.nome as vendedor_nome
      FROM test_drives t
      INNER JOIN clientes c ON t.cliente_id = c.id
      INNER JOIN veiculos v ON t.veiculo_id = v.id
      INNER JOIN vendedores vd ON t.vendedor_id = vd.id
      WHERE t.id = ?
    `;
    return await dbGet(sql, [id]);
  }

  static async buscarPorCliente(clienteId) {
    const sql = `SELECT * FROM test_drives WHERE cliente_id = ?`;
    return await dbAll(sql, [clienteId]);
  }

  static async buscarPorVeiculo(veiculoId) {
    const sql = `SELECT * FROM test_drives WHERE veiculo_id = ?`;
    return await dbAll(sql, [veiculoId]);
  }

  static async atualizarStatus(id, status) {
    const sql = `UPDATE test_drives SET status = ? WHERE id = ?`;
    await dbRun(sql, [status, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM test_drives WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = TestDrive;