const { dbAll, dbGet, dbRun } = require("./database");

class Venda {
  static async criar(clienteId, veiculoId, vendedorId) {
    const sql = `
      INSERT INTO vendas (cliente_id, veiculo_id, vendedor_id) 
      VALUES (?, ?, ?)
    `;
    const result = await dbRun(sql, [clienteId, veiculoId, vendedorId]);
    
    // Buscar a venda com os dados completos
    return await this.buscarPorId(result.id);
  }

  static async buscarTodos() {
    const sql = `
      SELECT 
        v.id,
        v.data,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        ve.id as veiculo_id,
        ve.marca as veiculo_marca,
        ve.modelo as veiculo_modelo,
        ve.ano as veiculo_ano,
        vd.id as vendedor_id,
        vd.nome as vendedor_nome,
        vd.setor as vendedor_setor
      FROM vendas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN veiculos ve ON v.veiculo_id = ve.id
      INNER JOIN vendedores vd ON v.vendedor_id = vd.id
      ORDER BY v.data DESC
    `;
    
    const rows = await dbAll(sql);
    
    return rows.map(row => ({
      id: row.id,
      data: row.data,
      cliente: {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email,
      },
      veiculo: {
        id: row.veiculo_id,
        marca: row.veiculo_marca,
        modelo: row.veiculo_modelo,
        ano: row.veiculo_ano,
      },
      vendedor: {
        id: row.vendedor_id,
        nome: row.vendedor_nome,
        setor: row.vendedor_setor,
      },
    }));
  }

  static async buscarPorId(id) {
    const sql = `
      SELECT 
        v.id,
        v.data,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email,
        ve.id as veiculo_id,
        ve.marca as veiculo_marca,
        ve.modelo as veiculo_modelo,
        ve.ano as veiculo_ano,
        vd.id as vendedor_id,
        vd.nome as vendedor_nome,
        vd.setor as vendedor_setor
      FROM vendas v
      INNER JOIN clientes c ON v.cliente_id = c.id
      INNER JOIN veiculos ve ON v.veiculo_id = ve.id
      INNER JOIN vendedores vd ON v.vendedor_id = vd.id
      WHERE v.id = ?
    `;
    
    const row = await dbGet(sql, [id]);
    
    if (!row) return null;
    
    return {
      id: row.id,
      data: row.data,
      cliente: {
        id: row.cliente_id,
        nome: row.cliente_nome,
        email: row.cliente_email,
      },
      veiculo: {
        id: row.veiculo_id,
        marca: row.veiculo_marca,
        modelo: row.veiculo_modelo,
        ano: row.veiculo_ano,
      },
      vendedor: {
        id: row.vendedor_id,
        nome: row.vendedor_nome,
        setor: row.vendedor_setor,
      },
    };
  }

  static async buscarPorCliente(clienteId) {
    const sql = `SELECT * FROM vendas WHERE cliente_id = ?`;
    return await dbAll(sql, [clienteId]);
  }

  static async buscarPorVeiculo(veiculoId) {
    const sql = `SELECT * FROM vendas WHERE veiculo_id = ?`;
    return await dbGet(sql, [veiculoId]);
  }

  static async remover(id) {
    // Buscar o veículo da venda antes de remover
    const sql = `SELECT veiculo_id FROM vendas WHERE id = ?`;
    const venda = await dbGet(sql, [id]);
    
    // Remover a venda
    await dbRun(`DELETE FROM vendas WHERE id = ?`, [id]);
    
    // Retornar o ID do veículo para marcar como disponível
    return venda ? venda.veiculo_id : null;
  }
}

module.exports = Venda;