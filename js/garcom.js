import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, onSnapshot, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        iniciarPainelGarcom();
    }
});

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => signOut(auth));
}

function iniciarPainelGarcom() {
    const container = document.getElementById("lista-prontos");
    const q = query(collection(db, "pedidos"), where("status", "==", "Pronto"));

    onSnapshot(q, (snapshot) => {
        container.innerHTML = "";
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center mt-5 text-muted"><h3>Tudo entregue. Ótimo atendimento!</h3></div>';
            return;
        }

        snapshot.docs.forEach((documento) => {
            const pedido = documento.data();
            const id = documento.id;

            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4 mb-4";
            col.innerHTML = `
                <div class="card card-bella card-pedido-pronto bg-white p-3">
                    <div class="d-flex align-items-center alert alert-success p-3 rounded-3 mb-3">
                        <i class="fas fa-bell text-success icon-status fa-beat-fade me-3"></i>
                        <div>
                            <h2 class="alert-heading m-0 text-success">${pedido.mesa}</h2>
                            <p class="m-0 text-dark">Retirar no Balcão!</p>
                        </div>
                    </div>
                    <div class="card-body p-0 mb-3">
                        <h4 class="card-title text-dark">${pedido.item}</h4>
                    </div>
                    <div class="card-footer bg-transparent p-0 pt-3 border-top d-grid">
                        <button class="btn btn-success btn-bella btn-entregue">
                            <i class="fas fa-check me-2"></i>Confirmar Entrega
                        </button>
                    </div>
                </div>
            `;

            col.querySelector('.btn-entregue').addEventListener('click', () => marcarEntregue(id));
            container.appendChild(col);
        });
    });
}

async function marcarEntregue(id) {
    await updateDoc(doc(db, "pedidos", id), { status: "Entregue" });
}