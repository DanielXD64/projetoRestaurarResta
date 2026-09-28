// Substitua o conteúdo de js/caixa.js por este:

function atualizarCaixa() {
    const containerConsumo = document.getElementById("resumo-consumo");
    const containerFechamento = document.getElementById("painel-fechamento");
    const pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    
    containerConsumo.innerHTML = "";
    containerFechamento.innerHTML = "";
    
    if (pedidos.length === 0) {
        containerConsumo.innerHTML = '<div class="alert alert-light text-center">Nenhum pedido ativo no momento.</div>';
        return;
    }

    // Cria a Tabela do Bootstrap
    let totalGeral = 0;
    let htmlTabela = `
        <div class="card card-bella p-4">
            <h3 class="mb-4 text-primary">Consumo Detalhado (Mesa 07)</h3>
            <div class="table-responsive">
                <table class="table table-striped table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Horário</th>
                            <th>Item</th>
                            <th>Status</th>
                            <th class="text-end">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    pedidos.forEach((pedido) => {
        totalGeral += pedido.valor;
        let classeStatus = (pedido.status === 'Entregue') ? 'bg-success' : 'bg-warning';
        
        htmlTabela += `
            <tr>
                <td>${pedido.hora}</td>
                <td><strong>${pedido.item}</strong></td>
                <td><span class="badge ${classeStatus} badge-status">${pedido.status}</span></td>
                <td class="text-end text-success h5 m-0">R$ ${pedido.valor.toFixed(2)}</td>
            </tr>
        `;
    });

    htmlTabela += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    containerConsumo.innerHTML = htmlTabela;

    // Cria o Painel de Fechamento (Sidebar)
    containerFechamento.innerHTML = `
        <div class="card card-bella p-4 bg-primary text-white sticky-top" style="top: 20px;">
            <h3 class="card-title text-center text-secondary">Fechamento</h3>
            <hr class="border-secondary">
            <div class="d-flex justify-content-between align-items-center my-4">
                <span>Total a Pagar:</span>
                <span class="display-5 text-secondary">R$ ${totalGeral.toFixed(2)}</span>
            </div>
            <div class="d-grid gap-3">
                <button class="btn btn-secondary btn-lg btn-bella text-primary" onclick="EncerrarComanda()">
                    <i class="fas fa-money-check-dollar me-2"></i>RECEBER E ENCERRAR
                </button>
            </div>
        </div>
    `;
}

function EncerrarComanda() {
    if (confirm("Confirmar o recebimento do valor e encerrar a comanda da Mesa 07?")) {
        localStorage.removeItem("pedidosBellaMassa");
        atualizarCaixa();
        alert("Conta encerrada com sucesso! Grazie!");
    }
}

setInterval(atualizarCaixa, 3000);
atualizarCaixa();