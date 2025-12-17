const { dbAll, dbGet, dbRun } = require("./database");

class Seguro {
  static validarDatas(dataInicio, dataFim) {
    // Converter strings para objetos Date
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    // Verificar se as datas são válidas
    if (isNaN(inicio.getTime())) {
      throw new Error("Data de início inválida");
    }
    
    if (isNaN(fim.getTime())) {
      throw new Error("Data de término inválida");
    }
    
    // Comparar as datas (removendo a parte de horário para comparar apenas as datas)
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(0, 0, 0, 0);
    
    if (fim <= inicio) {
      throw new Error(
        `A data de término (${dataFim}) deve ser posterior à data de início (${dataInicio})`
      );
    }
  }

  static async criar(vendaId, seguradora, apolice, valorAnual, cobertura, dataInicio, dataFim) {
    // Validar datas antes de inserir
    this.validarDatas(dataInicio, dataFim);
    
    const sql = `
      INSERT INTO seguros 
      (venda_id, seguradora, apolice, valor_anual, cobertura, data_inicio, data_fim) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [
      vendaId,
      seguradora,
      apolice,
      valorAnual,
      cobertura,
      dataInicio,
      dataFim,
    ]);
    
    return await this.buscarPorId(result.id);
  }

  static async buscarTodos() {
    const sql = `
      SELECT 
        s.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM seguros s
      INNER JOIN vendas vd ON s.venda_id = vd.id
      INNER JOIN clientes c ON vd.cliente_id = c.id
      INNER JOIN veiculos v ON vd.veiculo_id = v.id
      ORDER BY s.created_at DESC
    `;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        s.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM seguros s
      INNER JOIN vendas vd ON s.venda_id = vd.id
      INNER JOIN clientes c ON vd.cliente_id = c.id
      INNER JOIN veiculos v ON vd.veiculo_id = v.id
      WHERE s.id = ?
    `;
    return await dbGet(sql, [id]);
  }

  static async buscarPorVenda(vendaId) {
    const sql = `SELECT * FROM seguros WHERE venda_id = ?`;
    return await dbGet(sql, [vendaId]);
  }

  static async atualizar(id, seguradora, apolice, valorAnual, cobertura, dataInicio, dataFim) {
    // Validar datas antes de atualizar
    this.validarDatas(dataInicio, dataFim);
    
    const sql = `
      UPDATE seguros 
      SET seguradora = ?, apolice = ?, valor_anual = ?, cobertura = ?, data_inicio = ?, data_fim = ?
      WHERE id = ?
    `;
    await dbRun(sql, [seguradora, apolice, valorAnual, cobertura, dataInicio, dataFim, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM seguros WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Seguro;