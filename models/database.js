const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Criar/Abrir banco de dados
const dbPath = path.join(__dirname, "concessionaria.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } else {
    console.log("✅ Conectado ao banco SQLite");
  }
});

// Inicializar tabelas
db.serialize(() => {
  // Tabela de Veículos
  db.run(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      disponivel INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Clientes
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Vendedores
  db.run(`
    CREATE TABLE IF NOT EXISTS vendedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      setor TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Vendas
  db.run(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      veiculo_id INTEGER NOT NULL,
      vendedor_id INTEGER NOT NULL,
      data DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
      FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE CASCADE
    )
  `);

  // Tabela de Financiamentos
  db.run(`
    CREATE TABLE IF NOT EXISTS financiamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL,
      valor_total REAL NOT NULL,
      parcelas INTEGER NOT NULL,
      valor_parcela REAL NOT NULL,
      taxa_juros REAL NOT NULL,
      banco TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
    )
  `);

  // Tabela de Manutenções
  db.run(`
    CREATE TABLE IF NOT EXISTS manutencoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      veiculo_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      valor REAL NOT NULL,
      status TEXT DEFAULT 'Agendada',
      data DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )
  `);

  // Tabela de Test Drives
  db.run(`
    CREATE TABLE IF NOT EXISTS test_drives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      veiculo_id INTEGER NOT NULL,
      vendedor_id INTEGER NOT NULL,
      data_agendamento DATETIME NOT NULL,
      observacoes TEXT,
      status TEXT DEFAULT 'Agendado',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
      FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE CASCADE
    )
  `);

  // Tabela de Seguros (1:1 com Vendas)
  db.run(`
    CREATE TABLE IF NOT EXISTS seguros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL UNIQUE,
      seguradora TEXT NOT NULL,
      apolice TEXT NOT NULL,
      valor_anual REAL NOT NULL,
      cobertura TEXT NOT NULL,
      data_inicio DATE NOT NULL,
      data_fim DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE
    )
  `);

  // Tabela de Acessórios
  db.run(`
    CREATE TABLE IF NOT EXISTS acessorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Veículos-Acessórios (N:N)
  db.run(`
    CREATE TABLE IF NOT EXISTS veiculos_acessorios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      veiculo_id INTEGER NOT NULL,
      acessorio_id INTEGER NOT NULL,
      data_instalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id) ON DELETE CASCADE,
      FOREIGN KEY (acessorio_id) REFERENCES acessorios(id) ON DELETE CASCADE,
      UNIQUE(veiculo_id, acessorio_id)
    )
  `);

  console.log("✅ Tabelas verificadas/criadas com sucesso");
});

// Funções auxiliares para promisificar operações do SQLite
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Função para fechar o banco
const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
  db,
  dbAll,
  dbGet,
  dbRun,
  close,
};