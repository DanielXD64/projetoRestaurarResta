import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const formLogin = document.getElementById('form-login');
const alertErro = document.getElementById('alert-erro');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "pizzaiolo.html";
    } catch (error) {
        alertErro.classList.remove('d-none');
        alertErro.innerText = "Falha na autenticação: E-mail ou senha incorretos.";
    }
});