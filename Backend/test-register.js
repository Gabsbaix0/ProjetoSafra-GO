const fetch = require("node-fetch"); // precisa instalar se ainda não tiver: npm install node-fetch

async function testarCadastro() {
  try {
    const resposta = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: "Mariana Teste",
        email: "mari_teste" + Date.now() + "@email.com", // email único
        senha: "123456",
        telefone: "61 9999-0000",
        tipo_usuario: "C"
      }),
    });

    const dados = await resposta.json();
    console.log("Resposta do servidor:", dados);
  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
}

testarCadastro();
