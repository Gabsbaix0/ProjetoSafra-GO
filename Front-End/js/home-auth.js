// js/home-auth.js
import { auth } from "../js/firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// ========= AUTENTICAÇÃO ========= //
console.log("✅ home-auth.js carregado. Aguardando autenticação...");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Usuário autenticado:", user.email);
    // Aqui a página carrega normalmente
  } else {
    console.log("❌ Nenhum usuário autenticado. Redirecionando para login...");
    window.location.href = "login.html";
  }
});

// ========= MENU LATERAL ========= //

// Seletores
const menuIcon = document.querySelector(".fa-bars"); // ícone ☰
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");
const logoutBtn = document.getElementById("logoutBtn");

// Garante que os elementos existem antes de usar
if (menuIcon && sideMenu && closeMenu && logoutBtn) {
  // Abrir o menu
  menuIcon.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });

  // Fechar o menu
  closeMenu.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });

  // Logout Firebase
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
} else {
  console.warn("⚠️ Elementos do menu não foram encontrados. Verifique se o ícone e o menu estão na mesma página.");
}
