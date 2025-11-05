// js/perfil_vend_comp.js

// Importa a instância do Firestore configurada
import { db } from "./firebaseConfig.js";

// Importa funções específicas do Firestore para manipular documentos
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Aguarda o carregamento completo do conteúdo da página antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os botões de escolha do tipo de perfil (vendedor ou comprador)
  const vendedorBtn = document.querySelector(".option.vendedor");
  const compradorBtn = document.querySelector(".option.comprador");

  // Função que define o tipo de usuário e redireciona
  async function selecionarTipo(tipo) {
    console.log("Selecionado:", tipo); // Mostra no console o tipo selecionado (vendedor/comprador)

    // Armazena o tipo de usuário no localStorage para uso posterior
    localStorage.setItem("tipoUsuario", tipo);

    // 🔹 Verifica se o login atual foi feito via Google
    const usuarioGoogleRaw = localStorage.getItem("usuarioGoogle");
    const usuarioGoogle = usuarioGoogleRaw ? JSON.parse(usuarioGoogleRaw) : null;

    // 🔹 Se o usuário for do Google, atualiza o campo 'tipoUsuario' no Firestore
    if (usuarioGoogle && usuarioGoogle.uid) {
      try {
        // Cria uma referência ao documento do usuário no Firestore
        const userRef = doc(db, "usuarios", usuarioGoogle.uid);

        // Atualiza o campo 'tipoUsuario' com o valor escolhido
        await updateDoc(userRef, { tipoUsuario: tipo });

        console.log("Tipo de usuário salvo no Firestore:", tipo);
      } catch (error) {
        // Caso ocorra algum erro na atualização, mostra no console
        console.error("Erro ao atualizar tipo de usuário:", error);
      }
    }

    // 🔹 Decide o redirecionamento da próxima página
    setTimeout(() => {
      if (usuarioGoogle && usuarioGoogle.uid) {
        // ✅ Se o usuário for do Google → vai para página de cadastro Google
        window.location.href = "cadastro_pessoal_google.html";
      } else {
        // ✅ Se for um usuário comum (email/senha) → vai para cadastro padrão
        window.location.href = "cadastro_pessoal.html";
      }
    }, 200); // Aguarda 200ms antes de redirecionar
  }

  // Evento de clique no botão "Vendedor"
  vendedorBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Impede comportamento padrão do botão
    selecionarTipo("vendedor"); // Define tipo e redireciona
  });

  // Evento de clique no botão "Comprador"
  compradorBtn.addEventListener("click", (e) => {
    e.preventDefault(); // Impede comportamento padrão do botão
    selecionarTipo("comprador"); // Define tipo e redireciona
  });
});
