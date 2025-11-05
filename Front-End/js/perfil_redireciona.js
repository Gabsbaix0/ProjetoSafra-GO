// Importa a autenticação (auth) e o banco Firestore (db) da configuração Firebase
import { auth, db } from "../js/firebaseConfig.js";

// Importa funções específicas do Firestore para acessar documentos
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Obtém o botão de perfil no HTML (ex: <button id="btnPerfil">Perfil</button>)
const btnPerfil = document.getElementById("btnPerfil");

// Verifica se o botão existe na página antes de adicionar o evento
if (btnPerfil) {
  // Adiciona evento de clique ao botão de perfil
  btnPerfil.addEventListener("click", async (e) => {
    e.preventDefault(); // Evita comportamento padrão do botão (como enviar formulário)

    // Obtém o usuário atualmente logado no Firebase Auth
    const user = auth.currentUser;

    // 🔸 Caso o usuário não esteja autenticado → redireciona para a página de login
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      // Cria uma referência ao documento do usuário dentro da coleção "usuarios"
      const userRef = doc(db, "usuarios", user.uid);

      // Busca os dados do usuário no Firestore
      const userSnap = await getDoc(userRef);

      // Se o documento do usuário existir no banco
      if (userSnap.exists()) {
        // 🔹 Obtém o campo "tipoUsuario" (ex: comprador / vendedor)
        // e normaliza o texto para letras minúsculas e sem espaços extras
        const tipoUsuario = (userSnap.data().tipoUsuario || "").toLowerCase().trim();

        console.log("Tipo de usuário:", tipoUsuario); // 👈 Mostra no console o tipo obtido

        // Redireciona o usuário para a página correta de acordo com o tipo
        if (tipoUsuario === "comprador") {
          window.location.href = "perfil_pessoal.html"; // Página de comprador
        } else if (tipoUsuario === "vendedor") {
          window.location.href = "perfil_vendedor.html"; // Página de vendedor
        } else {
          // Se o tipo não estiver definido ou for inválido, mostra aviso e redireciona para perfil padrão
          console.warn("Tipo de usuário desconhecido:", tipoUsuario);
          window.location.href = "perfil_pessoal.html";
        }
      } else {
        // Caso o documento do usuário não exista no Firestore
        console.error("Usuário não encontrado no Firestore!");
        window.location.href = "perfil_pessoal.html";
      }
    } catch (error) {
      // Em caso de erro na leitura do banco, mostra no console e redireciona
      console.error("Erro ao buscar tipo de usuário:", error);
      window.location.href = "perfil_pessoal.html";
    }
  });
}
