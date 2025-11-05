// js/home-auth.js

// Importa a instância de autenticação configurada no Firebase
import { auth } from "../js/firebaseConfig.js";

// Importa funções do módulo de autenticação do Firebase:
// - onAuthStateChanged: observa mudanças no estado de login (entrar/sair)
// - signOut: realiza o logout do usuário
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ========= AUTENTICAÇÃO ========= //

// Mensagem no console apenas para confirmar que o script foi carregado corretamente
console.log("✅ home-auth.js carregado. Aguardando autenticação...");

// Monitora se o usuário está autenticado ou não
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se houver um usuário logado, exibe no console o e-mail do mesmo
    console.log("✅ Usuário autenticado:", user.email);
    // Aqui a página é carregada normalmente (não faz nada especial)
  } else {
    // Se não houver usuário autenticado, redireciona para a página de login
    console.log("❌ Nenhum usuário autenticado. Redirecionando para login...");
    window.location.href = "login.html";
  }
});

// ========= MENU LATERAL ========= //

// Captura os elementos do menu lateral na interface
const menuIcon = document.querySelector(".fa-bars"); // Ícone de "menu hambúrguer" ☰
const sideMenu = document.getElementById("sideMenu"); // Painel lateral (menu)
const closeMenu = document.getElementById("closeMenu"); // Botão para fechar o menu
const logoutBtn = document.getElementById("logoutBtn"); // Botão de logout

// Garante que todos os elementos do menu existem antes de aplicar os eventos
if (menuIcon && sideMenu && closeMenu && logoutBtn) {

  // Abre o menu lateral quando o ícone de menu é clicado
  menuIcon.addEventListener("click", () => {
    sideMenu.classList.add("open"); // Adiciona a classe CSS "open" que exibe o menu
  });

  // Fecha o menu lateral quando o botão "X" é clicado
  closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open"); // Remove a classe "open", escondendo o menu
  });

  // Realiza o logout do usuário no Firebase quando o botão de sair é clicado
  logoutBtn.addEventListener("click", async () => {
    try {
      // Executa o logout usando a função signOut() do Firebase
      await signOut(auth);

      // Após sair, redireciona o usuário para a tela de login
      window.location.href = "login.html";
    } catch (error) {
      // Caso ocorra algum erro no processo de logout, exibe no console
      console.error("Erro ao sair:", error);
    }
  });

} else {
  // Caso algum dos elementos do menu não seja encontrado no HTML
  console.warn("⚠️ Elementos do menu não foram encontrados. Verifique se o ícone e o menu estão na mesma página.");
}
