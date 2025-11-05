// js/esqueci-senha.js

// Importa a instância de autenticação configurada do Firebase (auth)
import { auth } from "./firebaseConfig.js";

// Importa a função do Firebase que envia e-mails de redefinição de senha
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Aguarda o carregamento completo do documento antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  // Obtém o formulário de esqueci senha pelo ID
  const form = document.getElementById("formEsqueci");
  // Captura o campo de e-mail
  const emailInput = document.getElementById("email");
  // Captura o botão de envio
  const btnEnviar = document.getElementById("btnEnviar");

  // Adiciona um evento de envio (submit) ao formulário
  form.addEventListener("submit", async (e) => {
    // Impede o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // Pega o valor digitado no campo de e-mail e remove espaços extras
    const email = emailInput.value.trim();

    // Verifica se o campo de e-mail está vazio
    if (!email) {
      alert("Por favor, insira seu e-mail.");
      return; // Sai da função se o campo estiver vazio
    }

    // Altera o texto do botão para indicar que está enviando
    btnEnviar.textContent = "Enviando...";
    // Desativa o botão para evitar cliques repetidos
    btnEnviar.disabled = true;

    try {
      // Envia o e-mail de redefinição de senha pelo Firebase
      await sendPasswordResetEmail(auth, email);

      // Salva o e-mail no armazenamento local (para usar na próxima tela)
      localStorage.setItem("emailRedefinir", email);
      // Redireciona o usuário para a página de confirmação de envio
      window.location.href = "redefinir-senha.html";
    } catch (error) {
      // Exibe o erro no console para depuração
      console.error("Erro ao enviar e-mail:", error);

      // Define uma mensagem de erro genérica
      let mensagemErro = "Erro ao enviar link. ";
      // Verifica o tipo de erro retornado pelo Firebase
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

      // Mostra a mensagem de erro ao usuário
      alert(mensagemErro);
    }

    // Restaura o texto original do botão
    btnEnviar.textContent = "Enviar link de redefinição";
    // Reativa o botão para permitir novo envio
    btnEnviar.disabled = false;
  });
});
