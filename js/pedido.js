import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const modalElement = document.getElementById('modalConfirmacao');
const modal = new bootstrap.Modal(modalElement);

document.querySelectorAll('.btn-adicionar').forEach(button => {
    button.addEventListener('click', async () => {
        const nome = button.getAttribute('data-nome');
        const preco = parseFloat(button.getAttribute('data-preco'));
        
        try {
            await addDoc(collection(db, "pedidos"), {
                mesa: "Mesa 07",
                item: nome,
                valor: preco,
                status: "Pendente",
                hora: new Date().toLocaleTimeString(),
                timestamp: serverTimestamp()
            });

            modal.show();
            setTimeout(() => modal.hide(), 2500);
        } catch (error) {
            alert("Erro ao enviar o pedido: " + error.message);
        }
    });
});