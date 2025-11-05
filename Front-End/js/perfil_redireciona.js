import { auth, db } from "../js/firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const btnPerfil = document.getElementById("btnPerfil");

if (btnPerfil) {
  btnPerfil.addEventListener("click", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    // 🔸 Se não estiver logado → redireciona pro login
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // 🔹 Garante que o tipo vem limpo e em minúsculo
        const tipoUsuario = (userSnap.data().tipoUsuario || "").toLowerCase().trim();

        console.log("Tipo de usuário:", tipoUsuario); // 👈 Verifica no console o valor real

        if (tipoUsuario === "comprador") {
          window.location.href = "perfil_pessoal.html";
        } else if (tipoUsuario === "vendedor") {
          window.location.href = "perfil_vendedor.html";
        } else {
          console.warn("Tipo de usuário desconhecido:", tipoUsuario);
          window.location.href = "perfil_pessoal.html";
        }
      } else {
        console.error("Usuário não encontrado no Firestore!");
        window.location.href = "perfil_pessoal.html";
      }
    } catch (error) {
      console.error("Erro ao buscar tipo de usuário:", error);
      window.location.href = "perfil_pessoal.html";
    }
  });
}
