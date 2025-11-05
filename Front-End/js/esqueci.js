// js/esqueci-senha.js
import { auth } from "./firebaseConfig.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEsqueci");
  const emailInput = document.getElementById("email");
  const btnEnviar = document.getElementById("btnEnviar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      alert("Por favor, insira seu e-mail.");
      return;
    }

    btnEnviar.textContent = "Enviando...";
    btnEnviar.disabled = true;

    try {
      // Envia o e-mail de redefinição
      await sendPasswordResetEmail(auth, email);

      // Salva o e-mail e vai direto pra tela de confirmação
      localStorage.setItem("emailRedefinir", email);
      window.location.href = "redefinir-senha.html";
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);

      let mensagemErro = "Erro ao enviar link. ";
      switch (error.code) {
        case "auth/user-not-found":
          mensagemErro += "E-mail não encontrado.";
          break;
        case "auth/invalid-email":
          mensagemErro += "E-mail inválido.";
          break;
        default:
          mensagemErro += "Tente novamente mais tarde.";
      }

      alert(mensagemErro);
    }

    btnEnviar.textContent = "Enviar link de redefinição";
    btnEnviar.disabled = false;
  });
});
