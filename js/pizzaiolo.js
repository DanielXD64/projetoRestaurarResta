// Substitua o conteúdo de js/pizzaiolo.js por este:

function carregarPedidosCozinha() {
    const container = document.getElementById("lista-pedidos");
    const pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    
    container.innerHTML = "";
    
    if (pedidos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center mt-5 text-muted"><h3>Sem pedidos na fila. Bom trabalho, pizzaiolo!</h3></div>';
        return;
    }

    pedidos.forEach((pedido, index) => {
        if (pedido.status !== "Entregue") {
            
            // Define classes de design baseadas no status
            let classeCard = "card-pedido-pendente";
            let iconeStatus = '<i class="fas fa-clock text-warning icon-status"></i>';
            let acoes = "";

            if (pedido.status === "Pendente") {
                acoes = `<button class="btn btn-primary btn-bella" onclick="alterarStatus(${index}, 'No Forno')"><i class="fas fa-fire me-1"></i>Assar</button>`;
            } else if (pedido.status === "No Forno") {
                classeCard = "card-pedido-forno";
                iconeStatus = '<i class="fas fa-fire text-danger icon-status"></i>';
                acoes = `<button class="btn btn-success btn-bella" onclick="alterarStatus(${index}, 'Pronto')"><i class="fas fa-bell me-1"></i>Marcar Pronto</button>`;
            } else if (pedido.status === "Pronto") {
                classeCard = "card-pedido-pronto";
                iconeStatus = '<i class="fas fa-bell text-success icon-status"></i>';
                acoes = `<span class="badge badge-status bg-success text-white">AGUARDANDO GARÇOM</span>`;
            }

            const col = document.createElement("div");
            col.className = "col-xl-3 col-lg-4 col-md-6 mb-4";
            col.innerHTML = `
                <div class="card card-bella h-100 p-3 bg-dark text-white ${classeCard}">
                    <div class="d-flex align-items-center mb-3">
                        ${iconeStatus}
                        <div>
                            <h2 class="m-0">${pedido.mesa}</h2>
                            <small class="text-muted">Pedido às: ${pedido.hora}</small>
                        </div>
                    </div>
                    <div class="card-body p-0 mb-3">
                        <h4 class="card-title">${pedido.item}</h4>
                    </div>
                    <div class="card-footer bg-transparent p-0 d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                        ${acoes}
                        <button class="btn btn-link text-danger p-0" onclick="cancelarPedido(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        }
    });
}

function alterarStatus(index, novoStatus) {
    let pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    pedidos[index].status = novoStatus;
    localStorage.setItem("pedidosBellaMassa", JSON.stringify(pedidos));
    carregarPedidosCozinha();
}

function cancelarPedido(index) {
    if(confirm("Tem certeza que deseja CANCELAR este pedido?")) {
        let pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
        pedidos.splice(index, 1);
        localStorage.setItem("pedidosBellaMassa", JSON.stringify(pedidos));
        carregarPedidosCozinha();
    }
}

setInterval(carregarPedidosCozinha, 3000); // Atualiza a cada 3 segundos
carregarPedidosCozinha();