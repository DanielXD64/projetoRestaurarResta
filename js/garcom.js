// Substitua o conteúdo de js/garcom.js por este:

function verificarPratosProntos() {
    const container = document.getElementById("lista-prontos");
    const pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    
    container.innerHTML = "";
    
    let temProntos = false;

    pedidos.forEach((pedido, index) => {
        if (pedido.status === "Pronto") {
            temProntos = true;
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4 mb-4";
            col.innerHTML = `
                <div class="card card-bella card-pedido-pronto bg-white p-3">
                    <div class="d-flex align-items-center alert alert-success p-3 rounded-3 mb-3">
                        <i class="fas fa-bell-ring text-success icon-status fa-beat-fade"></i>
                        <div>
                            <h2 class="alert-heading m-0 text-success">${pedido.mesa}</h2>
                            <p class="m-0 text-dark">Retirar no Balcão!</p>
                        </div>
                    </div>
                    <div class="card-body p-0 mb-3">
                        <h4 class="card-title text-dark">${pedido.item}</h4>
                    </div>
                    <div class="card-footer bg-transparent p-0 pt-3 border-top d-grid">
                        <button class="btn btn-success btn-bella" onclick="marcarEntregue(${index})">
                            <i class="fas fa-check me-2"></i>Confirmar Entrega
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        }
    });

    if (!temProntos) {
        container.innerHTML = '<div class="col-12 text-center mt-5 text-muted"><h3>Tudo entregue. Ótimo atendimento!</h3></div>';
    }
}

function marcarEntregue(index) {
    let pedidos = JSON.parse(localStorage.getItem("pedidosBellaMassa")) || [];
    pedidos[index].status = "Entregue";
    localStorage.setItem("pedidosBellaMassa", JSON.stringify(pedidos));
    verificarPratosProntos();
}

setInterval(verificarPratosProntos, 3000);
verificarPratosProntos();