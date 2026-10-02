import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMjNqz6QonXoLqSXz7EjF45ifNGkwXCOI",
  authDomain: "bella-massa-prova.firebaseapp.com",
  projectId: "bella-massa-prova",
  storageBucket: "bella-massa-prova.firebasestorage.app",
  messagingSenderId: "916379413365",
  appId: "1:916379413365:web:6783071b7a763963b5413c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);