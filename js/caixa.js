import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        iniciarCaixa();
    }
});

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => signOut(auth));
}

function iniciarCaixa() {
    const containerConsumo = document.getElementById("resumo-consumo");
    const containerFechamento = document.getElementById("painel-fechamento");
    const q = query(collection(db, "pedidos"), orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        containerConsumo.innerHTML = "";
        containerFechamento.innerHTML = "";

        if (snapshot.empty) {
            containerConsumo.innerHTML = '<div class="alert alert-light text-center">Nenhum pedido ativo no momento.</div>';
            return;
        }

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

        snapshot.docs.forEach((documento) => {
            const pedido = documento.data();
            totalGeral += pedido.valor || 0;
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

        containerFechamento.innerHTML = `
            <div class="card card-bella p-4 bg-primary text-white sticky-top" style="top: 20px;">
                <h3 class="card-title text-center text-secondary">Fechamento</h3>
                <hr class="border-secondary">
                <div class="d-flex justify-content-between align-items-center my-4">
                    <span>Total a Pagar:</span>
                    <span class="display-5 text-secondary">R$ ${totalGeral.toFixed(2)}</span>
                </div>
                <div class="d-grid gap-3">
                    <button id="btn-encerrar" class="btn btn-secondary btn-lg btn-bella text-primary">
                        <i class="fas fa-money-check-dollar me-2"></i>RECEBER E ENCERRAR
                    </button>
                </div>
            </div>
        `;

        const btnEncerrar = document.getElementById('btn-encerrar');
        if (btnEncerrar) {
            btnEncerrar.addEventListener('click', () => encerrarComanda(snapshot.docs));
        }
    });
}

async function encerrarComanda(docs) {
    if (confirm("Confirmar o recebimento do valor e encerrar a comanda da Mesa 07?")) {
        try {
            const promessas = docs.map((documento) => deleteDoc(doc(db, "pedidos", documento.id)));
            await Promise.all(promessas);
            alert("Conta encerrada com sucesso! Grazie!");
        } catch (error) {
            alert("Erro ao encerrar a conta: " + error.message);
        }
    }
}