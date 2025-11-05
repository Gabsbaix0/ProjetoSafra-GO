// js/redefinir-senha.js

// Importa a instância de autenticação configurada do Firebase (auth)
import { auth } from "./firebaseConfig.js";

// Importa a função do Firebase responsável por enviar o e-mail de redefinição de senha
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Aguarda o carregamento completo do documento antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
  // Obtém o e-mail salvo anteriormente no localStorage
  const email = localStorage.getItem("emailRedefinir");
  // Captura o elemento que exibirá mensagens na tela
  const msg = document.getElementById("msg");
  // Captura o botão que permite reenviar o link de redefinição
  const btnReenviar = document.getElementById("btnReenviar");
  // Captura o botão que leva o usuário de volta ao login
  const btnVoltar = document.getElementById("btnVoltar");

  // Verifica se há um e-mail salvo; caso não haja, o usuário acessou a página de forma incorreta
  if (!email) {
    msg.innerHTML = "❌ Nenhum e-mail encontrado. <br>Volte e solicite o link novamente.";
    msg.style.color = "red";
    btnReenviar.style.display = "none"; // Esconde o botão de reenviar
    return; // Interrompe a execução do script
  }

  // Exibe a mensagem inicial informando o envio do link para o e-mail
  msg.innerHTML = `Enviamos um link para <strong>${email}</strong>.<br>Verifique sua caixa de entrada.`;
  msg.style.color = "#2e7d32";

  // 🔁 Adiciona evento de clique ao botão "Reenviar link"
  btnReenviar.addEventListener("click", async () => {
    // Desativa o botão temporariamente e muda o texto para indicar que está reenviando
    btnReenviar.disabled = true;
    btnReenviar.textContent = "Reenviando...";

    try {
      // Reenvia o e-mail de redefinição de senha usando o Firebase
      await sendPasswordResetEmail(auth, email);

      // Mostra mensagem de sucesso
      msg.innerHTML = `Novo link enviado para <strong>${email}</strong>!`;
      msg.style.color = "green";

      // Inicia uma contagem regressiva de 60 segundos antes de permitir novo reenvio
      let tempoRestante = 60;
      const intervalo = setInterval(() => {
        tempoRestante--;
        btnReenviar.textContent = `Reenviar link (${tempoRestante}s)`;

        // Quando o tempo acabar, reativa o botão e reseta o texto
        if (tempoRestante <= 0) {
          clearInterval(intervalo);
          btnReenviar.disabled = false;
          btnReenviar.textContent = "Reenviar link";
        }
      }, 1000); // Atualiza a cada segundo

    } catch (error) {
      // Caso ocorra erro no reenvio, exibe a mensagem no console e na interface
      console.error("Erro ao reenviar link:", error);
      msg.textContent = "❌ Erro ao reenviar link. Tente novamente mais tarde.";
      msg.style.color = "red";

      // Reativa o botão e restaura o texto original
      btnReenviar.disabled = false;
      btnReenviar.textContent = "Reenviar link";
    }
  });

  // ⬅ Evento do botão "Voltar ao login"
  btnVoltar.addEventListener("click", () => {
    // Redireciona o usuário para a página de login
    window.location.href = "login.html";
  });

});
