// Front-End/js/firebaseConfig.js

// Importa as funções principais do SDK do Firebase
// - initializeApp: inicializa o app Firebase com as configurações fornecidas
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Importa funções de autenticação do Firebase
// - getAuth: obtém a instância de autenticação
// - GoogleAuthProvider: permite login com conta Google
// - signInWithPopup: abre o popup do Google para autenticação
import { getAuth, GoogleAuthProvider, signInWithPopup  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Importa o Firestore (banco de dados em nuvem do Firebase)
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ======================================================
// 🔹 Configuração do Firebase
// Esses dados identificam o projeto no console do Firebase
// ======================================================
const firebaseConfig = {
  apiKey: "AIzaSyDFHI6DTyhFeWVOvJiGKB98UvdQIfgUkRU",     // Chave de acesso à API do Firebase
  authDomain: "safraagoo.firebaseapp.com",               // Domínio de autenticação
  projectId: "safraagoo",                                // ID do projeto Firebase
  storageBucket: "safraagoo.firebasestorage.app",        // URL do armazenamento (Storage)
  messagingSenderId: "908982428349",                     // ID do serviço de mensagens
  appId: "1:908982428349:web:8ed044b0c37669f23d4dd4",    // Identificador único da aplicação
  measurementId: "G-F5KR6F0PHG"                          // ID para integração com Google Analytics
};

// ======================================================
// 🔹 Inicializa os serviços do Firebase
// ======================================================

// Inicializa o app principal com as configurações acima
const app = initializeApp(firebaseConfig);

// Obtém a instância de autenticação do Firebase
const auth = getAuth(app);

// Obtém a instância do Firestore (banco de dados em nuvem)
const db = getFirestore(app);

// Cria o provedor de autenticação do Google (usado para login via Google)
const provider = new GoogleAuthProvider();

// ======================================================
// 🔹 Exporta os objetos para uso em outros arquivos JS
// ======================================================
// Isso permite importar e usar Firebase Auth, Firestore e login Google em todo o projeto
export { auth, db, provider, signInWithPopup };
