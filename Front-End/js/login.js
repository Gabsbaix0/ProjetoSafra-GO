// ==========================================
// 🔹 Login com Firebase (email/senha e Google)
// 🔹 Redireciona para página de recuperação de senha (esqueci.html)
// ==========================================

import { auth, provider, db } from "./firebaseConfig.js";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const msg = document.getElementById("msg");
  const esqueceuSenha = document.querySelector(".forgot-password");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  // ==============================
  // 🔹 LOGIN COM E-MAIL E SENHA
  // ==============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!email || !senha) {
      msg.textContent = "Preencha todos os campos.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Entrando...";
    msg.style.color = "gray";

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
        })
      );

      msg.textContent = "Login realizado com sucesso!";
      msg.style.color = "green";

      setTimeout(() => (window.location.href = "home.html"), 1500);
    } catch (error) {
      console.error("Erro no login:", error);
      let mensagemErro = "❌ ";

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
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userData = {
          uid: user.uid,
          nome: user.displayName || "",
          email: user.email || "",
          foto: user.photoURL || "",
          tipoUsuario: null,
          criadoEm: serverTimestamp(),
        };

        const userRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          localStorage.setItem("usuarioGoogle", JSON.stringify(userData));
          window.location.href = "home.html";
        } else {
          await setDoc(userRef, userData);
          localStorage.setItem("usuarioGoogle", JSON.stringify(userData));
          window.location.href = "perfil.html";
        }
      } catch (error) {
        console.error("Erro no login com Google:", error);
        alert("Erro ao fazer login com o Google. Tente novamente.");
      }
    });
  }

  // ==============================
  // 🔹 ESQUECEU SENHA → IR PARA PÁGINA
  // ==============================
  if (esqueceuSenha) {
    esqueceuSenha.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "esqueci-senha.html"; // caminho para a página de redefinição
    });
  }
});
