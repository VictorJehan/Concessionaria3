const { dbAll, dbGet, dbRun } = require("./database");

class VeiculoAcessorio {
  static async instalar(veiculoId, acessorioId) {
    const sql = `
      INSERT INTO veiculos_acessorios (veiculo_id, acessorio_id) 
      VALUES (?, ?)
    `;
    const result = await dbRun(sql, [veiculoId, acessorioId]);
    return {
      id: result.id,
      veiculo_id: veiculoId,
      acessorio_id: acessorioId,
    };
  }

  static async buscarAcessoriosPorVeiculo(veiculoId) {
    const sql = `
      SELECT 
        a.*,
        va.data_instalacao
      FROM acessorios a
      INNER JOIN veiculos_acessorios va ON a.id = va.acessorio_id
      WHERE va.veiculo_id = ?
      ORDER BY va.data_instalacao DESC
    `;
    return await dbAll(sql, [veiculoId]);
  }

  static async buscarVeiculosPorAcessorio(acessorioId) {
    const sql = `
      SELECT 
        v.*,
        va.data_instalacao
      FROM veiculos v
      INNER JOIN veiculos_acessorios va ON v.id = va.veiculo_id
      WHERE va.acessorio_id = ?
      ORDER BY va.data_instalacao DESC
    `;
    return await dbAll(sql, [acessorioId]);
  }

  static async verificarInstalacao(veiculoId, acessorioId) {
    const sql = `
      SELECT * FROM veiculos_acessorios 
      WHERE veiculo_id = ? AND acessorio_id = ?
    `;
    return await dbGet(sql, [veiculoId, acessorioId]);
  }

  static async remover(veiculoId, acessorioId) {
    const sql = `
      DELETE FROM veiculos_acessorios 
      WHERE veiculo_id = ? AND acessorio_id = ?
    `;
    await dbRun(sql, [veiculoId, acessorioId]);
  }

  static async removerTodosPorVeiculo(veiculoId) {
    const sql = `DELETE FROM veiculos_acessorios WHERE veiculo_id = ?`;
    await dbRun(sql, [veiculoId]);
  }

  static async removerTodosPorAcessorio(acessorioId) {
    const sql = `DELETE FROM veiculos_acessorios WHERE acessorio_id = ?`;
    await dbRun(sql, [acessorioId]);
  }
}

module.exports = VeiculoAcessorio;