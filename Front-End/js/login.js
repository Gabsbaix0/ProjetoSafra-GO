// login.js
// ==========================================
// 🔹 Login com Firebase (email/senha e Google)
// 🔹 Recuperar senha com Firebase (pode manter para uso rápido)
// ==========================================

// Importa instâncias configuradas do Firebase
import { auth, provider, db } from "./firebaseConfig.js";

// Importa funções de autenticação do Firebase:
// - signInWithEmailAndPassword → login com e-mail e senha
// - sendPasswordResetEmail → envia e-mail de redefinição de senha
// - signInWithPopup → login com popup do Google
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Importa funções do Firestore (banco de dados do Firebase):
// - doc → referência a um documento específico
// - getDoc → obtém dados de um documento
// - setDoc → cria ou atualiza um documento
// - serverTimestamp → gera a data/hora do servidor (para marcação de criação)
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Aguarda o carregamento completo da página antes de executar
document.addEventListener("DOMContentLoaded", () => {
  // Captura os elementos do formulário e botões
  const form = document.getElementById("formLogin");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const msg = document.getElementById("msg");
  const esqueceuSenha = document.querySelector(".forgot-password");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  // ==============================
  // 🔹 LOGIN COM FIREBASE (Email/Senha)
  // ==============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o comportamento padrão (recarregar a página)

    // Obtém valores digitados nos campos
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    // Verifica se todos os campos foram preenchidos
    if (!email || !senha) {
      msg.textContent = "Preencha todos os campos.";
      msg.style.color = "red";
      return;
    }

    // Exibe mensagem de carregamento
    msg.textContent = "Entrando...";
    msg.style.color = "gray";

    try {
      // Tenta autenticar o usuário com e-mail e senha no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Guarda informações básicas do usuário localmente
      localStorage.setItem("usuarioLogado", JSON.stringify({
        uid: user.uid,
        email: user.email,
      }));

      // Mensagem de sucesso visual
      msg.textContent = "Login realizado com sucesso!";
      msg.style.color = "green";

      // Redireciona para a página principal após breve atraso
      setTimeout(() => (window.location.href = "home.html"), 1500);
    } catch (error) {
      // Se ocorrer um erro, mostra mensagem específica
      console.error("Erro no login:", error);
      let mensagemErro = "❌ ";

      // Identifica o tipo de erro retornado pelo Firebase
      switch (error.code) {
        case "auth/user-not-found":
          mensagemErro += "Usuário não encontrado.";
          break;
        case "auth/wrong-password":
          mensagemErro += "Senha incorreta.";
          break;
        case "auth/invalid-email":
          mensagemErro += "Email inválido.";
          break;
        default:
          mensagemErro += "Erro ao fazer login.";
      }

      // Exibe mensagem de erro na tela
      msg.textContent = mensagemErro;
      msg.style.color = "red";
    }
  });

  // ==============================
  // 🔹 LOGIN COM GOOGLE
  // ==============================
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      try {
        // Força o popup a sempre perguntar qual conta Google usar
        provider.setCustomParameters({ prompt: "select_account" });

        // Abre popup do Google e autentica o usuário
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Cria um objeto com os dados do usuário obtidos do Google
        const userData = {
          uid: user.uid,
          nome: user.displayName || "",
          email: user.email || "",
          foto: user.photoURL || "",
          tipoUsuario: null,
          criadoEm: serverTimestamp(), // Armazena data/hora de criação
        };

        // Referência ao documento do usuário no Firestore
        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);

        // Se o usuário já existir no Firestore
        if (docSnap.exists()) {
          // Guarda dados no localStorage e vai direto pra home
          localStorage.setItem("usuarioGoogle", JSON.stringify(userData));
          window.location.href = "home.html";
        } else {
          // Caso seja a primeira vez do login com Google → salva no Firestore
          await setDoc(userRef, userData);
          localStorage.setItem("usuarioGoogle", JSON.stringify(userData));

          // Redireciona o usuário para completar o perfil
          window.location.href = "perfil.html";
        }
      } catch (error) {
        // Captura erros de login com o Google
        console.error("Erro no login com Google:", error);
        alert("Erro ao fazer login com o Google. Tente novamente.");
      }
    });
  }

  // ==============================
  // 🔹 ESQUECEU SENHA (Firebase)
  // ==============================
  if (esqueceuSenha) {
    esqueceuSenha.addEventListener("click", async (e) => {
      e.preventDefault(); // Impede recarregamento da página
      // Pede o e-mail do usuário via prompt
      const email = prompt("Digite seu email para redefinir a senha:");
      if (!email) return;

      try {
        // Envia e-mail de redefinição de senha via Firebase
        await sendPasswordResetEmail(auth, email);
        alert("📧 Email de redefinição de senha enviado!");
      } catch (error) {
        // Se ocorrer erro, mostra mensagem de erro padrão
        alert("❌ Erro: " + error.message);
      }
    });
  }
});
