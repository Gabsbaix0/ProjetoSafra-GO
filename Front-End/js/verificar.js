// js/verificar.js

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  // Obtém o formulário de verificação e o elemento de mensagem
  const form = document.getElementById("formVerificacao");
  const msg = document.getElementById("mensagem");

  // Adiciona evento de envio ao formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página

    // Captura o código digitado pelo usuário
    const codigoDigitado = document.getElementById("codigo").value.trim();

    // Recupera o cadastro temporário salvo no localStorage
    const cadastroTemp = JSON.parse(localStorage.getItem("cadastro_temp"));

    // Extrai o código que foi originalmente gerado e salvo
    const { codigo } = cadastroTemp || {};

    // Caso não exista um cadastro em andamento
    if (!cadastroTemp) {
      msg.textContent = "Erro: Nenhum cadastro em andamento.";
      msg.style.color = "red";
      msg.classList.add("mensagem-animada"); // Classe CSS para animação (caso exista)
      msg.style.display = "block";
      return;
    }

    // Verifica se o código digitado é diferente do salvo
    if (codigoDigitado !== codigo) {
      // ❌ Código incorreto → exibe mensagem de erro
      msg.textContent = "Código incorreto!!";
      msg.style.color = "#ff3333";
      msg.classList.add("mensagem-animada");
      msg.style.display = "block";
      return;
    }

    // ✅ Código correto → exibe mensagem de sucesso
    msg.textContent = "Verificação confirmada!!";
    msg.style.color = "#33cc66";
    msg.classList.add("mensagem-animada");
    msg.style.display = "block";

    // Aguarda 2 segundos antes de redirecionar
    // (permite que o usuário veja a mensagem na tela)
    setTimeout(() => {
      // Remove o cadastro temporário do armazenamento local
      localStorage.removeItem("cadastro_temp");

      // Redireciona o usuário para a página de login
      window.location.href = "login.html";
    }, 2000);
  });
});
