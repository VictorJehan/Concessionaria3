const BASE = "http://localhost:3000";

async function api(path, method = "GET", body = null) {
  try {
    const opts = { 
      method, 
      headers: { "Content-Type": "application/json" } 
    };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(BASE + path, opts);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ erro: res.statusText }));
      alert("Erro: " + (errorData.erro || res.statusText));
      throw new Error(errorData.erro || res.statusText);
    }
    
    return res.status === 204 ? null : res.json().catch(() => null);
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

// ========== VEÍCULOS ==========
async function cadastrarVeiculo() {
  try {
    const marca = v_marca.value.trim();
    const modelo = v_modelo.value.trim();
    const ano = v_ano.value.trim();
    
    if (!marca || !modelo || !ano) {
      alert("Preencha todos os campos do veículo!");
      return;
    }
    
    await api("/veiculos", "POST", { marca, modelo, ano });
    v_marca.value = v_modelo.value = v_ano.value = "";
    alert("Veículo cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar veículo:", error);
  }
}

async function listarVeiculos() {
  try {
    const veiculos = await api("/veiculos");
    listaVeiculos.innerHTML = "";
    listaVeiculosVendidos.innerHTML = "";
    
    if (veiculos.length === 0) {
      listaVeiculos.innerHTML = "<li><div class='small'>Nenhum veículo cadastrado</div></li>";
      return;
    }
    
    const disponiveis = veiculos.filter(v => v.disponivel === 1);
    const vendidos = veiculos.filter(v => v.disponivel === 0);
    
    if (disponiveis.length === 0) {
      listaVeiculos.innerHTML = "<li><div class='small'>Nenhum veículo disponível</div></li>";
    } else {
      disponiveis.forEach(v => {
        const li = document.createElement('li');
        li.innerHTML = `<div>${v.marca} ${v.modelo} <span class="small">(${v.ano})</span></div>`;
        listaVeiculos.appendChild(li);
      });
    }
    
    if (vendidos.length === 0) {
      listaVeiculosVendidos.innerHTML = "<li><div class='small'>Nenhum veículo vendido</div></li>";
    } else {
      vendidos.forEach(v => {
        const li = document.createElement('li');
        li.innerHTML = `<div>${v.marca} ${v.modelo} <span class="small">(${v.ano})</span></div><div class="tag">Vendido</div>`;
        listaVeiculosVendidos.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Erro ao listar veículos:", error);
  }
}

// ========== CLIENTES ==========
async function cadastrarCliente() {
  try {
    const nome = c_nome.value.trim();
    const email = c_email.value.trim();
    
    if (!nome || !email) {
      alert("Preencha todos os campos do cliente!");
      return;
    }
    
    await api("/clientes", "POST", { nome, email });
    c_nome.value = c_email.value = "";
    alert("Cliente cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
  }
}

async function listarClientes() {
  try {
    const clientes = await api("/clientes");
    const vendas = await api("/vendas");
    listaClientes.innerHTML = "";
    
    if (clientes.length === 0) {
      listaClientes.innerHTML = "<li><div class='small'>Nenhum cliente cadastrado</div></li>";
      return;
    }
    
    clientes.forEach(c => {
      const venda = vendas.find(v => v.cliente.id == c.id);
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${c.nome}</strong>
          <div class="small">${c.email}</div>
        </div>
        <div>
          ${venda 
            ? `<span class="tag">Carro: ${venda.veiculo.marca} ${venda.veiculo.modelo}</span>` 
            : '<span class="small">Sem carro</span>'
          }
        </div>`;
      listaClientes.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
  }
}

// ========== VENDEDORES ==========
async function cadastrarVendedor() {
  try {
    const nome = vd_nome.value.trim();
    const setor = vd_setor.value.trim();
    
    if (!nome || !setor) {
      alert("Preencha todos os campos do vendedor!");
      return;
    }
    
    await api("/vendedores", "POST", { nome, setor });
    vd_nome.value = vd_setor.value = "";
    alert("Vendedor cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar vendedor:", error);
  }
}

async function listarVendedores() {
  try {
    const vendedores = await api("/vendedores");
    const vendas = await api("/vendas");
    listaVendedores.innerHTML = "";
    
    if (vendedores.length === 0) {
      listaVendedores.innerHTML = "<li><div class='small'>Nenhum vendedor cadastrado</div></li>";
      return;
    }
    
    vendedores.forEach(v => {
      const count = vendas.filter(x => x.vendedor.id == v.id).length;
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${v.nome}</strong>
          <div class="small">${v.setor}</div>
        </div>
        <div class="tag">Vendas: ${count}</div>`;
      listaVendedores.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar vendedores:", error);
  }
}

// ========== VENDAS ==========
async function registrarVenda() {
  try {
    const clienteId = Number(sel_cliente.value);
    const veiculoId = Number(sel_veiculo.value);
    const vendedorId = Number(sel_vendedor.value);
    
    if (!clienteId || !veiculoId || !vendedorId) {
      alert("Selecione cliente, veículo e vendedor!");
      return;
    }
    
    await api("/vendas", "POST", { clienteId, veiculoId, vendedorId });
    alert("Venda registrada com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
  }
}

async function listarVendas() {
  try {
    const vendas = await api("/vendas");
    listaVendas.innerHTML = "";
    
    if (vendas.length === 0) {
      listaVendas.innerHTML = "<li><div class='small'>Nenhuma venda registrada</div></li>";
      return;
    }
    
    vendas.forEach(v => {
      const li = document.createElement('li');
      const dataFormatada = new Date(v.data).toLocaleString('pt-BR');
      li.innerHTML = `
        <div>
          <strong>${v.cliente.nome}</strong>
          <div class="small">${v.cliente.email}</div>
          <div class="small">Vendedor: ${v.vendedor.nome} – ${dataFormatada}</div>
        </div>
        <div>
          <div class="small">${v.veiculo.marca} ${v.veiculo.modelo}</div>
          <button onclick="devolverVenda(${v.id})" class="btn-devolver">Devolver</button>
        </div>`;
      listaVendas.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar vendas:", error);
  }
}

async function devolverVenda(id) {
  if (!confirm("Confirma devolver este veículo?")) return;
  try {
    await api("/vendas/" + id, "DELETE");
    alert("Venda devolvida com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao devolver venda:", error);
  }
}

// ========== FINANCIAMENTOS ==========
async function cadastrarFinanciamento() {
  try {
    const vendaId = Number(fin_venda.value);
    const valorTotal = parseFloat(fin_valor.value);
    const parcelas = Number(fin_parcelas.value);
    const taxaJuros = parseFloat(fin_taxa.value);
    const banco = fin_banco.value.trim();
    
    if (!vendaId || !valorTotal || !parcelas || !taxaJuros || !banco) {
      alert("Preencha todos os campos do financiamento!");
      return;
    }
    
    const valorParcela = (valorTotal * (1 + taxaJuros / 100)) / parcelas;
    
    await api("/financiamentos", "POST", { 
      vendaId, 
      valorTotal, 
      parcelas, 
      valorParcela: valorParcela.toFixed(2), 
      taxaJuros, 
      banco 
    });
    
    fin_venda.value = "";
    fin_valor.value = "";
    fin_parcelas.value = "";
    fin_taxa.value = "";
    fin_banco.value = "";
    
    alert("Financiamento cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar financiamento:", error);
  }
}

async function listarFinanciamentos() {
  try {
    const financiamentos = await api("/financiamentos");
    listaFinanciamentos.innerHTML = "";
    
    if (financiamentos.length === 0) {
      listaFinanciamentos.innerHTML = "<li><div class='small'>Nenhum financiamento cadastrado</div></li>";
      return;
    }
    
    financiamentos.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${f.cliente_nome}</strong>
          <div class="small">${f.marca} ${f.modelo} – ${f.banco}</div>
          <div class="small">${f.parcelas}x R$ ${parseFloat(f.valor_parcela).toFixed(2)} (${f.taxa_juros}% juros)</div>
        </div>
        <div>
          <div class="tag">R$ ${parseFloat(f.valor_total).toFixed(2)}</div>
          <button onclick="removerFinanciamento(${f.id})" class="btn-devolver">Remover</button>
        </div>`;
      listaFinanciamentos.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar financiamentos:", error);
  }
}

async function removerFinanciamento(id) {
  if (!confirm("Confirma remover este financiamento?")) return;
  try {
    await api("/financiamentos/" + id, "DELETE");
    alert("Financiamento removido com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao remover financiamento:", error);
  }
}

// ========== MANUTENÇÕES ==========
async function cadastrarManutencao() {
  try {
    const clienteId = Number(man_cliente.value);
    const veiculoId = Number(man_veiculo.value);
    const tipo = man_tipo.value;
    const descricao = man_descricao.value.trim();
    const valor = parseFloat(man_valor.value);
    
    if (!clienteId || !veiculoId || !tipo || !descricao || !valor) {
      alert("Preencha todos os campos da manutenção!");
      return;
    }
    
    await api("/manutencoes", "POST", { clienteId, veiculoId, tipo, descricao, valor });
    
    man_cliente.value = "";
    man_veiculo.value = "";
    man_tipo.value = "";
    man_descricao.value = "";
    man_valor.value = "";
    
    alert("Manutenção cadastrada com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar manutenção:", error);
  }
}

async function listarManutencoes() {
  try {
    const manutencoes = await api("/manutencoes");
    listaManutencoes.innerHTML = "";
    
    if (manutencoes.length === 0) {
      listaManutencoes.innerHTML = "<li><div class='small'>Nenhuma manutenção cadastrada</div></li>";
      return;
    }
    
    manutencoes.forEach(m => {
      const li = document.createElement('li');
      const dataFormatada = new Date(m.data).toLocaleDateString('pt-BR');
      const statusClass = m.status === 'Concluída' ? 'tag' : 'badge';
      
      li.innerHTML = `
        <div>
          <strong>${m.cliente_nome}</strong>
          <div class="small">${m.marca} ${m.modelo} (${m.ano})</div>
          <div class="small">${m.tipo} – ${m.descricao} – ${dataFormatada}</div>
        </div>
        <div>
          <div class="small">R$ ${parseFloat(m.valor).toFixed(2)}</div>
          <div class="${statusClass}">${m.status}</div>
          ${m.status !== 'Concluída' 
            ? `<button onclick="concluirManutencao(${m.id})" class="btn-devolver">Concluir</button>` 
            : ''}
          <button onclick="removerManutencao(${m.id})" class="btn-devolver">Remover</button>
        </div>`;
      listaManutencoes.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar manutenções:", error);
  }
}

async function concluirManutencao(id) {
  try {
    await api("/manutencoes/" + id, "PUT", { status: "Concluída" });
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao concluir manutenção:", error);
  }
}

async function removerManutencao(id) {
  if (!confirm("Confirma remover esta manutenção?")) return;
  try {
    await api("/manutencoes/" + id, "DELETE");
    alert("Manutenção removida com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao remover manutenção:", error);
  }
}

// ========== TEST DRIVES ==========
async function cadastrarTestDrive() {
  try {
    const clienteId = Number(td_cliente.value);
    const veiculoId = Number(td_veiculo.value);
    const vendedorId = Number(td_vendedor.value);
    const dataAgendamento = td_data.value;
    const observacoes = td_obs.value.trim();
    
    if (!clienteId || !veiculoId || !vendedorId || !dataAgendamento) {
      alert("Preencha cliente, veículo, vendedor e data!");
      return;
    }
    
    await api("/test-drives", "POST", { 
      clienteId, 
      veiculoId, 
      vendedorId, 
      dataAgendamento, 
      observacoes 
    });
    
    td_cliente.value = "";
    td_veiculo.value = "";
    td_vendedor.value = "";
    td_data.value = "";
    td_obs.value = "";
    
    alert("Test drive agendado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao agendar test drive:", error);
  }
}

async function listarTestDrives() {
  try {
    const testDrives = await api("/test-drives");
    listaTestDrives.innerHTML = "";
    
    if (testDrives.length === 0) {
      listaTestDrives.innerHTML = "<li><div class='small'>Nenhum test drive agendado</div></li>";
      return;
    }
    
    testDrives.forEach(t => {
      const li = document.createElement('li');
      const dataFormatada = new Date(t.data_agendamento).toLocaleString('pt-BR');
      const statusClass = t.status === 'Realizado' ? 'tag' : t.status === 'Cancelado' ? 'badge' : 'small';
      
      li.innerHTML = `
        <div>
          <strong>${t.cliente_nome}</strong>
          <div class="small">${t.email}</div>
          <div class="small">${t.marca} ${t.modelo} – Vendedor: ${t.vendedor_nome}</div>
          <div class="small">${dataFormatada}</div>
          ${t.observacoes ? `<div class="small">Obs: ${t.observacoes}</div>` : ''}
        </div>
        <div>
          <div class="${statusClass}">${t.status}</div>
          ${t.status === 'Agendado' 
            ? `<button onclick="realizarTestDrive(${t.id})" class="btn-devolver">Realizar</button>
               <button onclick="cancelarTestDrive(${t.id})" class="btn-devolver">Cancelar</button>` 
            : ''}
          <button onclick="removerTestDrive(${t.id})" class="btn-devolver">Remover</button>
        </div>`;
      listaTestDrives.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar test drives:", error);
  }
}

async function realizarTestDrive(id) {
  try {
    await api("/test-drives/" + id, "PUT", { status: "Realizado" });
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao realizar test drive:", error);
  }
}

async function cancelarTestDrive(id) {
  if (!confirm("Confirma cancelar este test drive?")) return;
  try {
    await api("/test-drives/" + id, "PUT", { status: "Cancelado" });
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cancelar test drive:", error);
  }
}

async function removerTestDrive(id) {
  if (!confirm("Confirma remover este test drive?")) return;
  try {
    await api("/test-drives/" + id, "DELETE");
    alert("Test drive removido com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao remover test drive:", error);
  }
}

// ========== SEGUROS (NOVO - Associação 1:1 com Vendas) ==========
async function cadastrarSeguro() {
  try {
    const vendaId = Number(seg_venda.value);
    const seguradora = seg_seguradora.value.trim();
    const apolice = seg_apolice.value.trim();
    const valorAnual = parseFloat(seg_valor.value);
    const cobertura = seg_cobertura.value;
    const dataInicio = seg_inicio.value;
    const dataFim = seg_fim.value;
    
    if (!vendaId || !seguradora || !apolice || !valorAnual || !cobertura || !dataInicio || !dataFim) {
      alert("Preencha todos os campos do seguro!");
      return;
    }
    
    await api("/seguros", "POST", { 
      vendaId, 
      seguradora, 
      apolice, 
      valorAnual, 
      cobertura, 
      dataInicio, 
      dataFim 
    });
    
    seg_venda.value = "";
    seg_seguradora.value = "";
    seg_apolice.value = "";
    seg_valor.value = "";
    seg_cobertura.value = "";
    seg_inicio.value = "";
    seg_fim.value = "";
    
    alert("Seguro cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar seguro:", error);
  }
}

async function listarSeguros() {
  try {
    const seguros = await api("/seguros");
    listaSeguros.innerHTML = "";
    
    if (seguros.length === 0) {
      listaSeguros.innerHTML = "<li><div class='small'>Nenhum seguro cadastrado</div></li>";
      return;
    }
    
    seguros.forEach(s => {
      const li = document.createElement('li');
      const dataInicio = new Date(s.data_inicio).toLocaleDateString('pt-BR');
      const dataFim = new Date(s.data_fim).toLocaleDateString('pt-BR');
      
      li.innerHTML = `
        <div>
          <strong>${s.cliente_nome}</strong>
          <div class="small">${s.marca} ${s.modelo} (${s.ano})</div>
          <div class="small">${s.seguradora} – Apólice: ${s.apolice}</div>
          <div class="small">Cobertura: ${s.cobertura} – ${dataInicio} a ${dataFim}</div>
        </div>
        <div>
          <div class="tag">R$ ${parseFloat(s.valor_anual).toFixed(2)}/ano</div>
          <button onclick="removerSeguro(${s.id})" class="btn-devolver">Remover</button>
        </div>`;
      listaSeguros.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar seguros:", error);
  }
}

async function removerSeguro(id) {
  if (!confirm("Confirma remover este seguro?")) return;
  try {
    await api("/seguros/" + id, "DELETE");
    alert("Seguro removido com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao remover seguro:", error);
  }
}

// ========== ACESSÓRIOS (NOVO) ==========
async function cadastrarAcessorio() {
  try {
    const nome = ac_nome.value.trim();
    const descricao = ac_descricao.value.trim();
    const preco = parseFloat(ac_preco.value);
    
    if (!nome || !descricao || !preco) {
      alert("Preencha todos os campos do acessório!");
      return;
    }
    
    await api("/acessorios", "POST", { nome, descricao, preco });
    
    ac_nome.value = "";
    ac_descricao.value = "";
    ac_preco.value = "";
    
    alert("Acessório cadastrado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao cadastrar acessório:", error);
  }
}

async function listarAcessorios() {
  try {
    const acessorios = await api("/acessorios");
    listaAcessorios.innerHTML = "";
    
    if (acessorios.length === 0) {
      listaAcessorios.innerHTML = "<li><div class='small'>Nenhum acessório cadastrado</div></li>";
      return;
    }
    
    acessorios.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <strong>${a.nome}</strong>
          <div class="small">${a.descricao}</div>
        </div>
        <div>
          <div class="tag">R$ ${parseFloat(a.preco).toFixed(2)}</div>
          <button onclick="removerAcessorio(${a.id})" class="btn-devolver">Remover</button>
        </div>`;
      listaAcessorios.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar acessórios:", error);
  }
}

async function removerAcessorio(id) {
  if (!confirm("Confirma remover este acessório?")) return;
  try {
    await api("/acessorios/" + id, "DELETE");
    alert("Acessório removido com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao remover acessório:", error);
  }
}

// ========== INSTALAÇÃO DE ACESSÓRIOS (Associação N:N) ==========
async function instalarAcessorio() {
  try {
    const veiculoId = Number(inst_veiculo.value);
    const acessorioId = Number(inst_acessorio.value);
    
    if (!veiculoId || !acessorioId) {
      alert("Selecione veículo e acessório!");
      return;
    }
    
    await api("/veiculos-acessorios", "POST", { veiculoId, acessorioId });
    
    inst_veiculo.value = "";
    inst_acessorio.value = "";
    
    alert("Acessório instalado com sucesso!");
    await atualizarTudo();
  } catch (error) {
    console.error("Erro ao instalar acessório:", error);
  }
}

async function listarVeiculosComAcessorios() {
  try {
    const veiculos = await api("/veiculos");
    listaVeiculosAcessorios.innerHTML = "";
    
    if (veiculos.length === 0) {
      listaVeiculosAcessorios.innerHTML = "<li><div class='small'>Nenhum veículo cadastrado</div></li>";
      return;
    }
    
    for (const veiculo of veiculos) {
      const acessorios = await api(`/veiculos/${veiculo.id}/acessorios`);
      
      if (acessorios.length > 0) {
        const li = document.createElement('li');
        const acessoriosList = acessorios.map(a => 
          `<span class="badge">${a.nome} – R$ ${parseFloat(a.preco).toFixed(2)}</span>`
        ).join(' ');
        
        li.innerHTML = `
          <div>
            <strong>${veiculo.marca} ${veiculo.modelo}</strong>
            <div class="small">${veiculo.ano}</div>
            <div class="small" style="margin-top: 8px;">${acessoriosList}</div>
          </div>`;
        listaVeiculosAcessorios.appendChild(li);
      }
    }
    
    if (listaVeiculosAcessorios.children.length === 0) {
      listaVeiculosAcessorios.innerHTML = "<li><div class='small'>Nenhum veículo com acessórios</div></li>";
    }
  } catch (error) {
    console.error("Erro ao listar veículos com acessórios:", error);
  }
}

// ========== ATUALIZAR SELETORES ==========
async function atualizarSeletores() {
  try {
    const clientes = await api("/clientes");
    const veiculos = await api("/veiculos");
    const vendedores = await api("/vendedores");
    const vendas = await api("/vendas");
    const acessorios = await api("/acessorios");
    
    // Clientes disponíveis (sem venda)
    const clientesDisponiveis = clientes.filter(c => 
      !vendas.find(v => v.cliente.id == c.id)
    );
    
    sel_cliente.innerHTML = clientesDisponiveis.length > 0
      ? clientesDisponiveis.map(c => `<option value="${c.id}">${c.nome}</option>`).join("")
      : '<option value="">-- Nenhum cliente disponível --</option>';
    
    // Veículos disponíveis
    const veiculosDisponiveis = veiculos.filter(v => v.disponivel === 1);
    sel_veiculo.innerHTML = veiculosDisponiveis.length > 0
      ? veiculosDisponiveis.map(v => `<option value="${v.id}">${v.marca} ${v.modelo}</option>`).join("")
      : '<option value="">-- Nenhum veículo disponível --</option>';
    
    // Vendedores
    sel_vendedor.innerHTML = vendedores.length > 0
      ? vendedores.map(v => `<option value="${v.id}">${v.nome}</option>`).join("")
      : '<option value="">-- Nenhum vendedor disponível --</option>';
    
    // Vendas (para financiamentos)
    fin_venda.innerHTML = vendas.length > 0
      ? vendas.map(v => `<option value="${v.id}">${v.cliente.nome} - ${v.veiculo.marca} ${v.veiculo.modelo}</option>`).join("")
      : '<option value="">-- Nenhuma venda disponível --</option>';
    
// Clientes (para manutenções)
    const clientesComVendas = clientes.filter(c => 
      vendas.find(v => v.cliente.id == c.id)
    );
    
    man_cliente.innerHTML = clientesComVendas.length > 0
      ? clientesComVendas.map(c => `<option value="${c.id}">${c.nome}</option>`).join("")
      : '<option value="">-- Nenhum cliente com venda --</option>';
    
    // Veículos vendidos (para manutenções)
    const veiculosVendidos = veiculos.filter(v => v.disponivel === 0);
    man_veiculo.innerHTML = veiculosVendidos.length > 0
      ? veiculosVendidos.map(v => `<option value="${v.id}">${v.marca} ${v.modelo} (${v.ano})</option>`).join("")
      : '<option value="">-- Nenhum veículo vendido --</option>';
    
    // Test Drives - Clientes
    td_cliente.innerHTML = clientes.length > 0
      ? clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join("")
      : '<option value="">-- Nenhum cliente --</option>';
    
    // Test Drives - Veículos disponíveis
    td_veiculo.innerHTML = veiculosDisponiveis.length > 0
      ? veiculosDisponiveis.map(v => `<option value="${v.id}">${v.marca} ${v.modelo}</option>`).join("")
      : '<option value="">-- Nenhum veículo disponível --</option>';
    
    // Test Drives - Vendedores
    td_vendedor.innerHTML = vendedores.length > 0
      ? vendedores.map(v => `<option value="${v.id}">${v.nome}</option>`).join("")
      : '<option value="">-- Nenhum vendedor --</option>';
    
    // Seguros - Vendas sem seguro
    const vendasSemSeguro = vendas.filter(v => {
      // Verificar se já existe seguro para esta venda
      return true; // Simplificado - o backend já valida UNIQUE
    });
    
    seg_venda.innerHTML = vendasSemSeguro.length > 0
      ? vendasSemSeguro.map(v => `<option value="${v.id}">${v.cliente.nome} - ${v.veiculo.marca} ${v.veiculo.modelo}</option>`).join("")
      : '<option value="">-- Nenhuma venda disponível --</option>';
    
    // Instalação de Acessórios - Veículos
    inst_veiculo.innerHTML = veiculos.length > 0
      ? veiculos.map(v => `<option value="${v.id}">${v.marca} ${v.modelo} (${v.ano})</option>`).join("")
      : '<option value="">-- Nenhum veículo --</option>';
    
    // Instalação de Acessórios - Acessórios
    inst_acessorio.innerHTML = acessorios.length > 0
      ? acessorios.map(a => `<option value="${a.id}">${a.nome} - R$ ${parseFloat(a.preco).toFixed(2)}</option>`).join("")
      : '<option value="">-- Nenhum acessório --</option>';
    
  } catch (error) {
    console.error("Erro ao atualizar seletores:", error);
  }
}

// ========== ATUALIZAR TUDO ==========
async function atualizarTudo() {
  try {
    await Promise.all([
      listarVeiculos(),
      listarClientes(),
      listarVendedores(),
      listarVendas(),
      listarFinanciamentos(),
      listarManutencoes(),
      listarTestDrives(),
      listarSeguros(),
      listarAcessorios(),
      listarVeiculosComAcessorios(),
      atualizarSeletores()
    ]);
  } catch (error) {
    console.error("Erro ao atualizar dados:", error);
  }
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
  // Veículos
  btnCadVeiculo.addEventListener('click', cadastrarVeiculo);
  
  // Clientes
  btnCadCliente.addEventListener('click', cadastrarCliente);
  
  // Vendedores
  btnCadVendedor.addEventListener('click', cadastrarVendedor);
  
  // Vendas
  btnRegistrarVenda.addEventListener('click', registrarVenda);
  
  // Financiamentos
  btnCadFinanciamento.addEventListener('click', cadastrarFinanciamento);
  
  // Manutenções
  btnCadManutencao.addEventListener('click', cadastrarManutencao);
  
  // Test Drives
  btnCadTestDrive.addEventListener('click', cadastrarTestDrive);
  
  // Seguros
  btnCadSeguro.addEventListener('click', cadastrarSeguro);
  
  // Acessórios
  btnCadAcessorio.addEventListener('click', cadastrarAcessorio);
  
  // Instalação de Acessórios
  btnInstalarAcessorio.addEventListener('click', instalarAcessorio);
  
  // Permitir Enter nos campos de input
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const button = input.closest('.form').querySelector('button');
        if (button) button.click();
      }
    });
  });
  
  // Carregar dados iniciais
  atualizarTudo();
  
  console.log('🚗 Sistema da Concessionária carregado com sucesso!');
});

// ========== FUNÇÕES GLOBAIS PARA OS BOTÕES ==========
window.devolverVenda = devolverVenda;
window.removerFinanciamento = removerFinanciamento;
window.concluirManutencao = concluirManutencao;
window.removerManutencao = removerManutencao;
window.realizarTestDrive = realizarTestDrive;
window.cancelarTestDrive = cancelarTestDrive;
window.removerTestDrive = removerTestDrive;
window.removerSeguro = removerSeguro;
window.removerAcessorio = removerAcessorio;