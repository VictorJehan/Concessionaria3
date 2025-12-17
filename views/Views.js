// views/VeiculoView.js
class VeiculoView {
  static renderLista(veiculos) {
    if (!veiculos || veiculos.length === 0) {
      return "<li><div class='small'>Nenhum veículo cadastrado</div></li>";
    }

    return veiculos
      .map(
        (v) => `
        <li>
          <div>${v.marca} ${v.modelo} <span class="small">(${v.ano})</span></div>
          ${v.disponivel === 0 ? '<div class="tag">Vendido</div>' : ""}
        </li>
      `
      )
      .join("");
  }

  static renderDisponiveis(veiculos) {
    const disponiveis = veiculos.filter((v) => v.disponivel === 1);
    if (disponiveis.length === 0) {
      return "<li><div class='small'>Nenhum veículo disponível</div></li>";
    }

    return disponiveis
      .map(
        (v) => `
        <li>
          <div>${v.marca} ${v.modelo} <span class="small">(${v.ano})</span></div>
        </li>
      `
      )
      .join("");
  }

  static renderVendidos(veiculos) {
    const vendidos = veiculos.filter((v) => v.disponivel === 0);
    if (vendidos.length === 0) {
      return "<li><div class='small'>Nenhum veículo vendido</div></li>";
    }

    return vendidos
      .map(
        (v) => `
        <li>
          <div>${v.marca} ${v.modelo} <span class="small">(${v.ano})</span></div>
          <div class="tag">Vendido</div>
        </li>
      `
      )
      .join("");
  }

  static renderSelectOptions(veiculos) {
    const disponiveis = veiculos.filter((v) => v.disponivel === 1);
    if (disponiveis.length === 0) {
      return '<option value="">-- Nenhum veículo disponível --</option>';
    }

    return disponiveis
      .map(
        (v) =>
          `<option value="${v.id}">${v.marca} ${v.modelo} (${v.ano})</option>`
      )
      .join("");
  }
}

// ========================================
// views/ClienteView.js
// ========================================
class ClienteView {
  static renderLista(clientes, vendas) {
    if (!clientes || clientes.length === 0) {
      return "<li><div class='small'>Nenhum cliente cadastrado</div></li>";
    }

    return clientes
      .map((c) => {
        const venda = vendas.find((v) => v.cliente.id == c.id);
        return `
        <li>
          <div>
            <strong>${c.nome}</strong>
            <div class="small">${c.email}</div>
          </div>
          <div>
            ${
              venda
                ? `<span class="tag">Carro: ${venda.veiculo.marca} ${venda.veiculo.modelo}</span>`
                : '<span class="small">Sem carro</span>'
            }
          </div>
        </li>
      `;
      })
      .join("");
  }

  static renderSelectOptions(clientes, vendas) {
    const clientesDisponiveis = clientes.filter(
      (c) => !vendas.find((v) => v.cliente.id == c.id)
    );

    if (clientesDisponiveis.length === 0) {
      return '<option value="">-- Nenhum cliente disponível --</option>';
    }

    return clientesDisponiveis
      .map((c) => `<option value="${c.id}">${c.nome}</option>`)
      .join("");
  }

  static renderSelectAll(clientes) {
    if (!clientes || clientes.length === 0) {
      return '<option value="">-- Nenhum cliente --</option>';
    }

    return clientes
      .map((c) => `<option value="${c.id}">${c.nome}</option>`)
      .join("");
  }
}

// ========================================
// views/VendedorView.js
// ========================================
class VendedorView {
  static renderLista(vendedores, vendas) {
    if (!vendedores || vendedores.length === 0) {
      return "<li><div class='small'>Nenhum vendedor cadastrado</div></li>";
    }

    return vendedores
      .map((v) => {
        const count = vendas.filter((x) => x.vendedor.id == v.id).length;
        return `
        <li>
          <div>
            <strong>${v.nome}</strong>
            <div class="small">${v.setor}</div>
          </div>
          <div class="tag">Vendas: ${count}</div>
        </li>
      `;
      })
      .join("");
  }

  static renderSelectOptions(vendedores) {
    if (!vendedores || vendedores.length === 0) {
      return '<option value="">-- Nenhum vendedor disponível --</option>';
    }

    return vendedores
      .map((v) => `<option value="${v.id}">${v.nome}</option>`)
      .join("");
  }
}

// ========================================
// views/VendaView.js
// ========================================
class VendaView {
  static renderLista(vendas) {
    if (!vendas || vendas.length === 0) {
      return "<li><div class='small'>Nenhuma venda registrada</div></li>";
    }

    return vendas
      .map((v) => {
        const dataFormatada = new Date(v.data).toLocaleString("pt-BR");
        return `
        <li>
          <div>
            <strong>${v.cliente.nome}</strong>
            <div class="small">${v.cliente.email}</div>
            <div class="small">Vendedor: ${v.vendedor.nome} — ${dataFormatada}</div>
          </div>
          <div>
            <div class="small">${v.veiculo.marca} ${v.veiculo.modelo}</div>
            <button onclick="devolverVenda(${v.id})" class="btn-devolver">Devolver</button>
          </div>
        </li>
      `;
      })
      .join("");
  }

  static renderSelectOptions(vendas) {
    if (!vendas || vendas.length === 0) {
      return '<option value="">-- Nenhuma venda disponível --</option>';
    }

    return vendas
      .map(
        (v) =>
          `<option value="${v.id}">${v.cliente.nome} - ${v.veiculo.marca} ${v.veiculo.modelo}</option>`
      )
      .join("");
  }
}

// ========================================
// views/FinanciamentoView.js
// ========================================
class FinanciamentoView {
  static renderLista(financiamentos) {
    if (!financiamentos || financiamentos.length === 0) {
      return "<li><div class='small'>Nenhum financiamento cadastrado</div></li>";
    }

    return financiamentos
      .map(
        (f) => `
        <li>
          <div>
            <strong>${f.cliente_nome}</strong>
            <div class="small">${f.marca} ${f.modelo} — ${f.banco}</div>
            <div class="small">${f.parcelas}x R$ ${parseFloat(
          f.valor_parcela
        ).toFixed(2)} (${f.taxa_juros}% juros)</div>
          </div>
          <div>
            <div class="tag">R$ ${parseFloat(f.valor_total).toFixed(2)}</div>
            <button onclick="removerFinanciamento(${
              f.id
            })" class="btn-devolver">Remover</button>
          </div>
        </li>
      `
      )
      .join("");
  }
}

// ========================================
// views/ManutencaoView.js
// ========================================
class ManutencaoView {
  static renderLista(manutencoes) {
    if (!manutencoes || manutencoes.length === 0) {
      return "<li><div class='small'>Nenhuma manutenção cadastrada</div></li>";
    }

    return manutencoes
      .map((m) => {
        const dataFormatada = new Date(m.data).toLocaleDateString("pt-BR");
        const statusClass = m.status === "Concluída" ? "tag" : "badge";

        return `
        <li>
          <div>
            <strong>${m.cliente_nome}</strong>
            <div class="small">${m.marca} ${m.modelo} (${m.ano})</div>
            <div class="small">${m.tipo} — ${m.descricao} — ${dataFormatada}</div>
          </div>
          <div>
            <div class="small">R$ ${parseFloat(m.valor).toFixed(2)}</div>
            <div class="${statusClass}">${m.status}</div>
            ${
              m.status !== "Concluída"
                ? `<button onclick="concluirManutencao(${m.id})" class="btn-devolver">Concluir</button>`
                : ""
            }
            <button onclick="removerManutencao(${
              m.id
            })" class="btn-devolver">Remover</button>
          </div>
        </li>
      `;
      })
      .join("");
  }
}

// ========================================
// views/TestDriveView.js
// ========================================
class TestDriveView {
  static renderLista(testDrives) {
    if (!testDrives || testDrives.length === 0) {
      return "<li><div class='small'>Nenhum test drive agendado</div></li>";
    }

    return testDrives
      .map((t) => {
        const dataFormatada = new Date(t.data_agendamento).toLocaleString(
          "pt-BR"
        );
        const statusClass =
          t.status === "Realizado"
            ? "tag"
            : t.status === "Cancelado"
            ? "badge"
            : "small";

        return `
        <li>
          <div>
            <strong>${t.cliente_nome}</strong>
            <div class="small">${t.cliente_email}</div>
            <div class="small">${t.marca} ${t.modelo} — Vendedor: ${t.vendedor_nome}</div>
            <div class="small">${dataFormatada}</div>
            ${
              t.observacoes
                ? `<div class="small">Obs: ${t.observacoes}</div>`
                : ""
            }
          </div>
          <div>
            <div class="${statusClass}">${t.status}</div>
            ${
              t.status === "Agendado"
                ? `<button onclick="realizarTestDrive(${t.id})" class="btn-devolver">Realizar</button>
                   <button onclick="cancelarTestDrive(${t.id})" class="btn-devolver">Cancelar</button>`
                : ""
            }
            <button onclick="removerTestDrive(${
              t.id
            })" class="btn-devolver">Remover</button>
          </div>
        </li>
      `;
      })
      .join("");
  }
}

// ========================================
// views/SeguroView.js
// ========================================
class SeguroView {
  static renderLista(seguros) {
    if (!seguros || seguros.length === 0) {
      return "<li><div class='small'>Nenhum seguro cadastrado</div></li>";
    }

    return seguros
      .map((s) => {
        const dataInicio = new Date(s.data_inicio).toLocaleDateString("pt-BR");
        const dataFim = new Date(s.data_fim).toLocaleDateString("pt-BR");

        return `
        <li>
          <div>
            <strong>${s.cliente_nome}</strong>
            <div class="small">${s.marca} ${s.modelo} (${s.ano})</div>
            <div class="small">${s.seguradora} — Apólice: ${s.apolice}</div>
            <div class="small">Cobertura: ${s.cobertura} — ${dataInicio} a ${dataFim}</div>
          </div>
          <div>
            <div class="tag">R$ ${parseFloat(s.valor_anual).toFixed(
              2
            )}/ano</div>
            <button onclick="removerSeguro(${
              s.id
            })" class="btn-devolver">Remover</button>
          </div>
        </li>
      `;
      })
      .join("");
  }
}

// ========================================
// views/AcessorioView.js
// ========================================
class AcessorioView {
  static renderLista(acessorios) {
    if (!acessorios || acessorios.length === 0) {
      return "<li><div class='small'>Nenhum acessório cadastrado</div></li>";
    }

    return acessorios
      .map(
        (a) => `
        <li>
          <div>
            <strong>${a.nome}</strong>
            <div class="small">${a.descricao}</div>
          </div>
          <div>
            <div class="tag">R$ ${parseFloat(a.preco).toFixed(2)}</div>
            <button onclick="removerAcessorio(${
              a.id
            })" class="btn-devolver">Remover</button>
          </div>
        </li>
      `
      )
      .join("");
  }

  static renderSelectOptions(acessorios) {
    if (!acessorios || acessorios.length === 0) {
      return '<option value="">-- Nenhum acessório --</option>';
    }

    return acessorios
      .map(
        (a) =>
          `<option value="${a.id}">${a.nome} - R$ ${parseFloat(a.preco).toFixed(
            2
          )}</option>`
      )
      .join("");
  }
}

// ========================================
// views/VeiculoAcessorioView.js
// ========================================
class VeiculoAcessorioView {
  static async renderLista(veiculos, apiCallback) {
    if (!veiculos || veiculos.length === 0) {
      return "<li><div class='small'>Nenhum veículo cadastrado</div></li>";
    }

    let html = "";
    let temAcessorios = false;

    for (const veiculo of veiculos) {
      const acessorios = await apiCallback(`/veiculos/${veiculo.id}/acessorios`);

      if (acessorios && acessorios.length > 0) {
        temAcessorios = true;
        const acessoriosList = acessorios
          .map(
            (a) =>
              `<span class="badge">${a.nome} — R$ ${parseFloat(a.preco).toFixed(
                2
              )}</span>`
          )
          .join(" ");

        html += `
          <li>
            <div>
              <strong>${veiculo.marca} ${veiculo.modelo}</strong>
              <div class="small">${veiculo.ano}</div>
              <div class="small" style="margin-top: 8px;">${acessoriosList}</div>
            </div>
          </li>
        `;
      }
    }

    return temAcessorios
      ? html
      : "<li><div class='small'>Nenhum veículo com acessórios</div></li>";
  }

  static renderSelectVeiculos(veiculos) {
    if (!veiculos || veiculos.length === 0) {
      return '<option value="">-- Nenhum veículo --</option>';
    }

    return veiculos
      .map(
        (v) =>
          `<option value="${v.id}">${v.marca} ${v.modelo} (${v.ano})</option>`
      )
      .join("");
  }
}

// ========================================
// Exportar todas as views
// ========================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    VeiculoView,
    ClienteView,
    VendedorView,
    VendaView,
    FinanciamentoView,
    ManutencaoView,
    TestDriveView,
    SeguroView,
    AcessorioView,
    VeiculoAcessorioView,
  };
}