import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        iniciarPainel();
    }
});

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => signOut(auth));
}

function iniciarPainel() {
    const container = document.getElementById("lista-pedidos");
    const q = query(collection(db, "pedidos"), orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        container.innerHTML = "";
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center mt-5 text-muted"><h3>Sem pedidos na fila. Bom trabalho, pizzaiolo!</h3></div>';
            return;
        }

        snapshot.docs.forEach((documento) => {
            const pedido = documento.data();
            const id = documento.id;

            if (pedido.status !== "Entregue") {
                let classeCard = "card-pedido-pendente";
                let iconeStatus = '<i class="fas fa-clock text-warning icon-status"></i>';

                if (pedido.status === "No Forno") {
                    classeCard = "card-pedido-forno";
                    iconeStatus = '<i class="fas fa-fire text-danger icon-status"></i>';
                } else if (pedido.status === "Pronto") {
                    classeCard = "card-pedido-pronto";
                    iconeStatus = '<i class="fas fa-bell text-success icon-status"></i>';
                }

                const col = document.createElement("div");
                col.className = "col-xl-3 col-lg-4 col-md-6 mb-4";
                
                let acoesHtml = '';
                if (pedido.status === "Pendente") {
                    acoesHtml = `<button class="btn btn-primary btn-bella btn-assar"><i class="fas fa-fire me-1"></i>Assar</button>`;
                } else if (pedido.status === "No Forno") {
                    acoesHtml = `<button class="btn btn-success btn-bella btn-pronto"><i class="fas fa-bell me-1"></i>Marcar Pronto</button>`;
                } else if (pedido.status === "Pronto") {
                    acoesHtml = `<span class="badge badge-status bg-success text-white">AGUARDANDO GARÇOM</span>`;
                }

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
                            <div class="area-acoes">${acoesHtml}</div>
                            <button class="btn btn-link text-danger p-0 btn-deletar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;

                const btnAssar = col.querySelector('.btn-assar');
                if (btnAssar) {
                    btnAssar.addEventListener('click', () => alterarStatus(id, "No Forno"));
                }

                const btnPronto = col.querySelector('.btn-pronto');
                if (btnPronto) {
                    btnPronto.addEventListener('click', () => alterarStatus(id, "Pronto"));
                }

                const btnDeletar = col.querySelector('.btn-deletar');
                if (btnDeletar) {
                    btnDeletar.addEventListener('click', () => cancelarPedido(id));
                }

                container.appendChild(col);
            }
        });
    });
}

async function alterarStatus(id, novoStatus) {
    await updateDoc(doc(db, "pedidos", id), { status: novoStatus });
}

async function cancelarPedido(id) {
    if (confirm("Tem certeza que deseja CANCELAR este pedido?")) {
        await deleteDoc(doc(db, "pedidos", id));
    }
}