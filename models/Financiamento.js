const { dbAll, dbGet, dbRun } = require("./database");

class Financiamento {
  static async criar(vendaId, valorTotal, parcelas, valorParcela, taxaJuros, banco) {
    const sql = `
      INSERT INTO financiamentos 
      (venda_id, valor_total, parcelas, valor_parcela, taxa_juros, banco) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await dbRun(sql, [
      vendaId,
      valorTotal,
      parcelas,
      valorParcela,
      taxaJuros,
      banco,
    ]);
    
    return await this.buscarPorId(result.id);
  }

  static async buscarTodos() {
    const sql = `
      SELECT 
        f.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM financiamentos f
      INNER JOIN vendas vd ON f.venda_id = vd.id
      INNER JOIN clientes c ON vd.cliente_id = c.id
      INNER JOIN veiculos v ON vd.veiculo_id = v.id
      ORDER BY f.created_at DESC
    `;
    return await dbAll(sql);
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        f.*,
        c.nome as cliente_nome,
        v.marca,
        v.modelo,
        v.ano
      FROM financiamentos f
      INNER JOIN vendas vd ON f.venda_id = vd.id
      INNER JOIN clientes c ON vd.cliente_id = c.id
      INNER JOIN veiculos v ON vd.veiculo_id = v.id
      WHERE f.id = ?
    `;
    return await dbGet(sql, [id]);
  }

  static async buscarPorVenda(vendaId) {
    const sql = `SELECT * FROM financiamentos WHERE venda_id = ?`;
    return await dbGet(sql, [vendaId]);
  }

  static async atualizar(id, valorTotal, parcelas, valorParcela, taxaJuros, banco) {
    const sql = `
      UPDATE financiamentos 
      SET valor_total = ?, parcelas = ?, valor_parcela = ?, taxa_juros = ?, banco = ?
      WHERE id = ?
    `;
    await dbRun(sql, [valorTotal, parcelas, valorParcela, taxaJuros, banco, id]);
  }

  static async remover(id) {
    const sql = `DELETE FROM financiamentos WHERE id = ?`;
    await dbRun(sql, [id]);
  }
}

module.exports = Financiamento;