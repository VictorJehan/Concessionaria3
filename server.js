const express = require("express");
const cors = require("cors");
const path = require("path");

// Importar Models
const Veiculo = require("./models/Veiculo");
const Cliente = require("./models/Cliente");
const Vendedor = require("./models/Vendedor");
const Venda = require("./models/Venda");
const Financiamento = require("./models/Financiamento");
const Manutencao = require("./models/Manutencao");
const TestDrive = require("./models/TestDrive");
const Seguro = require("./models/Seguro");
const Acessorio = require("./models/Acessorio");
const VeiculoAcessorio = require("./models/VeiculoAcessorio");

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de tratamento de erros
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ========== VEÍCULOS ==========
app.post("/veiculos", asyncHandler(async (req, res) => {
  const { marca, modelo, ano } = req.body;
  const veiculo = await Veiculo.criar(marca, modelo, ano);
  res.status(201).json(veiculo);
}));

app.get("/veiculos", asyncHandler(async (req, res) => {
  const veiculos = await Veiculo.buscarTodos();
  res.json(veiculos);
}));

app.put("/veiculos/:id", asyncHandler(async (req, res) => {
  const { marca, modelo, ano, disponivel } = req.body;
  await Veiculo.atualizar(req.params.id, marca, modelo, ano, disponivel);
  res.json({ mensagem: "Veículo atualizado" });
}));

app.delete("/veiculos/:id", asyncHandler(async (req, res) => {
  await Veiculo.remover(req.params.id);
  res.json({ mensagem: "Veículo removido" });
}));

// ========== CLIENTES ==========
app.post("/clientes", asyncHandler(async (req, res) => {
  const { nome, email } = req.body;
  const cliente = await Cliente.criar(nome, email);
  res.status(201).json(cliente);
}));

app.get("/clientes", asyncHandler(async (req, res) => {
  const clientes = await Cliente.buscarTodos();
  res.json(clientes);
}));

app.delete("/clientes/:id", asyncHandler(async (req, res) => {
  await Cliente.remover(req.params.id);
  res.json({ mensagem: "Cliente removido" });
}));

// ========== VENDEDORES ==========
app.post("/vendedores", asyncHandler(async (req, res) => {
  const { nome, setor } = req.body;
  const vendedor = await Vendedor.criar(nome, setor);
  res.status(201).json(vendedor);
}));

app.get("/vendedores", asyncHandler(async (req, res) => {
  const vendedores = await Vendedor.buscarTodos();
  res.json(vendedores);
}));

app.delete("/vendedores/:id", asyncHandler(async (req, res) => {
  await Vendedor.remover(req.params.id);
  res.json({ mensagem: "Vendedor removido" });
}));

// ========== VENDAS ==========
app.post("/vendas", asyncHandler(async (req, res) => {
  const { clienteId, veiculoId, vendedorId } = req.body;
  
  // Marcar veículo como vendido
  await Veiculo.marcarComoVendido(veiculoId);
  
  // Criar venda
  const venda = await Venda.criar(clienteId, veiculoId, vendedorId);
  
  res.status(201).json(venda);
}));

app.get("/vendas", asyncHandler(async (req, res) => {
  const vendas = await Venda.buscarTodos();
  res.json(vendas);
}));

app.delete("/vendas/:id", asyncHandler(async (req, res) => {
  const veiculoId = await Venda.remover(req.params.id);
  
  if (veiculoId) {
    // Marcar veículo como disponível novamente
    await Veiculo.marcarComoDisponivel(veiculoId);
  }
  
  res.json({ mensagem: "Venda cancelada" });
}));

// ========== FINANCIAMENTOS ==========
app.post("/financiamentos", asyncHandler(async (req, res) => {
  const { vendaId, valorTotal, parcelas, valorParcela, taxaJuros, banco } = req.body;
  const financiamento = await Financiamento.criar(
    vendaId,
    valorTotal,
    parcelas,
    valorParcela,
    taxaJuros,
    banco
  );
  res.status(201).json(financiamento);
}));

app.get("/financiamentos", asyncHandler(async (req, res) => {
  const financiamentos = await Financiamento.buscarTodos();
  res.json(financiamentos);
}));

app.delete("/financiamentos/:id", asyncHandler(async (req, res) => {
  await Financiamento.remover(req.params.id);
  res.json({ mensagem: "Financiamento removido" });
}));

// ========== MANUTENÇÕES ==========
app.post("/manutencoes", asyncHandler(async (req, res) => {
  const { veiculoId, clienteId, tipo, descricao, valor } = req.body;
  const manutencao = await Manutencao.criar(
    veiculoId,
    clienteId,
    tipo,
    descricao,
    valor
  );
  res.status(201).json(manutencao);
}));

app.get("/manutencoes", asyncHandler(async (req, res) => {
  const manutencoes = await Manutencao.buscarTodos();
  res.json(manutencoes);
}));

app.put("/manutencoes/:id", asyncHandler(async (req, res) => {
  const { status } = req.body;
  await Manutencao.atualizarStatus(req.params.id, status);
  res.json({ mensagem: "Status atualizado" });
}));

app.delete("/manutencoes/:id", asyncHandler(async (req, res) => {
  await Manutencao.remover(req.params.id);
  res.json({ mensagem: "Manutenção removida" });
}));

// ========== TEST DRIVES ==========
app.post("/test-drives", asyncHandler(async (req, res) => {
  const { clienteId, veiculoId, vendedorId, dataAgendamento, observacoes } = req.body;
  const testDrive = await TestDrive.criar(
    clienteId,
    veiculoId,
    vendedorId,
    dataAgendamento,
    observacoes
  );
  res.status(201).json(testDrive);
}));

app.get("/test-drives", asyncHandler(async (req, res) => {
  const testDrives = await TestDrive.buscarTodos();
  res.json(testDrives);
}));

app.put("/test-drives/:id", asyncHandler(async (req, res) => {
  const { status } = req.body;
  await TestDrive.atualizarStatus(req.params.id, status);
  res.json({ mensagem: "Status atualizado" });
}));

app.delete("/test-drives/:id", asyncHandler(async (req, res) => {
  await TestDrive.remover(req.params.id);
  res.json({ mensagem: "Test drive removido" });
}));

// ========== SEGUROS (Associação 1:1 com Vendas) ==========
app.post("/seguros", asyncHandler(async (req, res) => {
  const { vendaId, seguradora, apolice, valorAnual, cobertura, dataInicio, dataFim } = req.body;
  const seguro = await Seguro.criar(
    vendaId,
    seguradora,
    apolice,
    valorAnual,
    cobertura,
    dataInicio,
    dataFim
  );
  res.status(201).json(seguro);
}));

app.get("/seguros", asyncHandler(async (req, res) => {
  const seguros = await Seguro.buscarTodos();
  res.json(seguros);
}));

app.put("/seguros/:id", asyncHandler(async (req, res) => {
  const { seguradora, apolice, valorAnual, cobertura, dataInicio, dataFim } = req.body;
  await Seguro.atualizar(
    req.params.id,
    seguradora,
    apolice,
    valorAnual,
    cobertura,
    dataInicio,
    dataFim
  );
  res.json({ mensagem: "Seguro atualizado" });
}));

app.delete("/seguros/:id", asyncHandler(async (req, res) => {
  await Seguro.remover(req.params.id);
  res.json({ mensagem: "Seguro removido" });
}));

// ========== ACESSÓRIOS ==========
app.post("/acessorios", asyncHandler(async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const acessorio = await Acessorio.criar(nome, descricao, preco);
  res.status(201).json(acessorio);
}));

app.get("/acessorios", asyncHandler(async (req, res) => {
  const acessorios = await Acessorio.buscarTodos();
  res.json(acessorios);
}));

app.put("/acessorios/:id", asyncHandler(async (req, res) => {
  const { nome, descricao, preco } = req.body;
  await Acessorio.atualizar(req.params.id, nome, descricao, preco);
  res.json({ mensagem: "Acessório atualizado" });
}));

app.delete("/acessorios/:id", asyncHandler(async (req, res) => {
  await Acessorio.remover(req.params.id);
  res.json({ mensagem: "Acessório removido" });
}));

// ========== VEÍCULOS-ACESSÓRIOS (Associação N:N) ==========
app.post("/veiculos-acessorios", asyncHandler(async (req, res) => {
  const { veiculoId, acessorioId } = req.body;
  const resultado = await VeiculoAcessorio.instalar(veiculoId, acessorioId);
  res.status(201).json(resultado);
}));

app.get("/veiculos/:id/acessorios", asyncHandler(async (req, res) => {
  const acessorios = await VeiculoAcessorio.buscarAcessoriosPorVeiculo(req.params.id);
  res.json(acessorios);
}));

app.get("/acessorios/:id/veiculos", asyncHandler(async (req, res) => {
  const veiculos = await VeiculoAcessorio.buscarVeiculosPorAcessorio(req.params.id);
  res.json(veiculos);
}));

app.delete("/veiculos-acessorios/:veiculoId/:acessorioId", asyncHandler(async (req, res) => {
  await VeiculoAcessorio.remover(req.params.veiculoId, req.params.acessorioId);
  res.json({ mensagem: "Acessório removido do veículo" });
}));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err);
  res.status(500).json({ erro: err.message || "Erro interno do servidor" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚗 Servidor da Concessionária Rodando!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 Banco: SQLite`);
  console.log(`🏗️  Arquitetura: MVC`);
  console.log(`========================================`);
});

process.on("SIGINT", () => {
  const db = require("./models/database");
  db.close()
    .then(() => {
      console.log("✅ Banco fechado com sucesso");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erro ao fechar banco:", err);
      process.exit(1);
    });
});