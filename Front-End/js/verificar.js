// js/verificar.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formVerificacao");
  const msg = document.getElementById("mensagem");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigoDigitado = document.getElementById("codigo").value.trim();
    const cadastroTemp = JSON.parse(localStorage.getItem("cadastro_temp"));
    const { codigo } = cadastroTemp || {};

    if (!cadastroTemp) {
      msg.textContent = "Erro: Nenhum cadastro em andamento.";
      msg.style.color = "red";
      msg.classList.add("mensagem-animada");
      msg.style.display = "block";
      return;
    }

    if (codigoDigitado !== codigo) {
      // ❌ Código incorreto
      msg.textContent = "Código incorreto!!";
      msg.style.color = "#ff3333";
      msg.classList.add("mensagem-animada");
      msg.style.display = "block";
      return;
    }

    // ✅ Código correto
    msg.textContent = "Verificação confirmada!!";
    msg.style.color = "#33cc66";
    msg.classList.add("mensagem-animada");
    msg.style.display = "block";

    // Garante que o navegador renderize a mensagem antes de redirecionar
    setTimeout(() => {
      localStorage.removeItem("cadastro_temp");
      window.location.href = "login.html";
    }, 2000);
  });
});
