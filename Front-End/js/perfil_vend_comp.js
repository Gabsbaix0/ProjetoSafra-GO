// js/perfil_vend_comp.js

import { db } from "./firebaseConfig.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const vendedorBtn = document.querySelector(".option.vendedor");
  const compradorBtn = document.querySelector(".option.comprador");

  async function selecionarTipo(tipo) {
    console.log("Selecionado:", tipo);
    localStorage.setItem("tipoUsuario", tipo);

    // 🔹 Verifica se o usuário atual é Google
    const usuarioGoogleRaw = localStorage.getItem("usuarioGoogle");
    const usuarioGoogle = usuarioGoogleRaw ? JSON.parse(usuarioGoogleRaw) : null;

    // 🔹 Atualiza o tipo no Firestore só se for login Google
    if (usuarioGoogle && usuarioGoogle.uid) {
      try {
        const userRef = doc(db, "usuarios", usuarioGoogle.uid);
        await updateDoc(userRef, { tipoUsuario: tipo });
        console.log("Tipo de usuário salvo no Firestore:", tipo);
      } catch (error) {
        console.error("Erro ao atualizar tipo de usuário:", error);
      }
    }

    // 🔹 Decide o redirecionamento corretamente
    setTimeout(() => {
      if (usuarioGoogle && usuarioGoogle.uid) {
        // ✅ Usuário do Google → cadastro_pessoal_google
        window.location.href = "cadastro_pessoal_google.html";
      } else {
        // ✅ Usuário comum (email/senha) → cadastro_pessoal
        window.location.href = "cadastro_pessoal.html";
      }
    }, 200);
  }

  vendedorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selecionarTipo("vendedor");
  });

  compradorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    selecionarTipo("comprador");
  });
});
