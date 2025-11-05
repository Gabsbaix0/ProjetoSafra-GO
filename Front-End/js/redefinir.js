// js/redefinir-senha.js
import { auth } from "./firebaseConfig.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const email = localStorage.getItem("emailRedefinir");
  const msg = document.getElementById("msg");
  const btnReenviar = document.getElementById("btnReenviar");
  const btnVoltar = document.getElementById("btnVoltar");

  // Se não houver e-mail salvo, o usuário chegou aqui indevidamente
  if (!email) {
    msg.innerHTML = "❌ Nenhum e-mail encontrado. <br>Volte e solicite o link novamente.";
    msg.style.color = "red";
    btnReenviar.style.display = "none";
    return;
  }

  // Mensagem inicial
  msg.innerHTML = `Enviamos um link para <strong>${email}</strong>.<br>Verifique sua caixa de entrada.`;
  msg.style.color = "#2e7d32";

  // 🔁 Função para reenviar link
  btnReenviar.addEventListener("click", async () => {
    btnReenviar.disabled = true;
    btnReenviar.textContent = "Reenviando...";

    try {
      await sendPasswordResetEmail(auth, email);
      msg.innerHTML = `Novo link enviado para <strong>${email}</strong>!`;
      msg.style.color = "green";

      // Inicia contagem regressiva de 60s
      let tempoRestante = 60;
      const intervalo = setInterval(() => {
        tempoRestante--;
        btnReenviar.textContent = `Reenviar link (${tempoRestante}s)`;

        if (tempoRestante <= 0) {
          clearInterval(intervalo);
          btnReenviar.disabled = false;
          btnReenviar.textContent = "Reenviar link";
        }
      }, 1000);

    } catch (error) {
      console.error("Erro ao reenviar link:", error);
      msg.textContent = "❌ Erro ao reenviar link. Tente novamente mais tarde.";
      msg.style.color = "red";
      btnReenviar.disabled = false;
      btnReenviar.textContent = "Reenviar link";
    }
  });

  // ⬅ Voltar ao login
    btnVoltar.addEventListener("click", () => {
    window.location.href = "login.html";
    });

});
