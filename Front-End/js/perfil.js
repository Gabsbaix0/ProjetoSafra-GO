// js/perfil.js

// Importa autenticação (auth) e banco de dados (db) configurados no Firebase
import { auth, db } from "../js/firebaseConfig.js";

// Importa funções relacionadas à autenticação (login, logout, atualizar perfil e senha, excluir conta)
import {
  onAuthStateChanged,   // Observa mudanças no estado de login
  signOut,              // Faz logout
  updateProfile,        // Atualiza nome e dados básicos do usuário
  updatePassword,       // Atualiza senha
  deleteUser            // Exclui usuário do Authentication
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Importa funções do Firestore para acessar e modificar documentos
import {
  doc,        // Cria referência a um documento
  getDoc,     // Lê dados de um documento
  setDoc,     // Cria ou atualiza documento
  deleteDoc   // Exclui documento
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ======== ELEMENTOS DO DOM (HTML) ======== //
const form = document.querySelector(".profile-form");   // Formulário de edição do perfil
const nomeInput = document.getElementById("nome");      // Campo nome
const emailInput = document.getElementById("email");    // Campo email (não editável)
const cpfInput = document.getElementById("cpf_cnpj");   // Campo CPF/CNPJ
const telefoneInput = document.getElementById("telefone"); // Campo telefone
const enderecoInput = document.getElementById("endereco"); // Campo endereço
const numeroInput = document.getElementById("numero");  // Campo número
const cidadeInput = document.getElementById("cidade");  // Campo cidade
const cepInput = document.getElementById("cep");        // Campo CEP
const senhaInput = document.getElementById("senha");    // Campo senha (opcional)
const btnSair = document.querySelector(".btn-logout");  // Botão de sair
const profileName = document.querySelector(".profile-name"); // Nome exibido no topo do perfil

// ======== VERIFICA LOGIN E CARREGA DADOS ======== //
onAuthStateChanged(auth, async (user) => {
  // Se não houver usuário logado → redireciona para login
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Preenche o email e nome do usuário logado
  emailInput.value = user.email;
  profileName.textContent = user.displayName || "Usuário";

  // Cria referência ao documento do usuário no Firestore
  const userRef = doc(db, "usuarios", user.uid);
  const docSnap = await getDoc(userRef); // Busca dados no banco

  // Se o documento existir → preenche os campos com os dados do Firestore
  if (docSnap.exists()) {
    const dados = docSnap.data();
    nomeInput.value = dados.nome || "";
    cpfInput.value = dados.cpf_cnpj || "";
    telefoneInput.value = dados.telefone || "";
    enderecoInput.value = dados.endereco || "";
    numeroInput.value = dados.numero || "";
    cidadeInput.value = dados.cidade || "";
    cepInput.value = dados.cep || "";
    profileName.textContent = dados.nome || "Usuário";
  } else {
    // Se o documento não existir → cria um novo com nome e email
    await setDoc(userRef, {
      nome: user.displayName || "",
      email: user.email
    });
  }

  // ======== SALVAR ALTERAÇÕES ======== //
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede recarregar a página

    // Coleta os dados atualizados dos campos
    const dadosAtualizados = {
      nome: nomeInput.value.trim(),
      cpf_cnpj: cpfInput.value.trim(),
      telefone: telefoneInput.value.trim(),
      endereco: enderecoInput.value.trim(),
      numero: numeroInput.value.trim(),
      cidade: cidadeInput.value.trim(),
      cep: cepInput.value.trim(),
      email: user.email // email não pode ser alterado
    };

    try {
      // Atualiza os dados no Firestore
      await setDoc(userRef, dadosAtualizados, { merge: true });

      // Atualiza também o nome no Firebase Auth
      await updateProfile(user, { displayName: dadosAtualizados.nome });

      // Se o campo de senha foi preenchido → atualiza a senha
      if (senhaInput.value.trim()) {
        await updatePassword(user, senhaInput.value.trim());
        alert("Senha atualizada com sucesso!");
      }

      // Atualiza o nome exibido na tela
      profileName.textContent = dadosAtualizados.nome || "Usuário";
      alert("✅ Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("❌ Erro ao salvar dados. Tente novamente.");
    }
  });

  // ======== LOGOUT ======== //
  btnSair.addEventListener("click", async () => {
    try {
      await signOut(auth);        // Sai da conta no Firebase
      localStorage.clear();       // 🧹 Limpa dados salvos no navegador
      window.location.href = "login.html"; // Redireciona para login
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("❌ Erro ao sair. Tente novamente.");
    }
  });
});

// ======== EXCLUIR CONTA ======== //
const btnExcluirConta = document.querySelector(".btn-delete-account");

btnExcluirConta.addEventListener("click", async () => {
  // Confirma com o usuário antes de prosseguir
  const confirmar = confirm("⚠️ Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita!");
  if (!confirmar) return;

  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Nenhum usuário logado no momento.");
      return;
    }

    // 1️⃣ Exclui o documento do Firestore (dados pessoais)
    await deleteDoc(doc(db, "usuarios", user.uid));

    // 2️⃣ Exclui o usuário do Authentication (login)
    await deleteUser(user);

    // 3️⃣ Limpa o localStorage
    localStorage.clear();

    // 4️⃣ Mostra mensagem e redireciona
    alert("Conta excluída com sucesso! Esperamos te ver novamente ❤️");
    window.location.href = "login.html";

  } catch (error) {
    console.error("Erro ao excluir conta:", error);

    // Caso o Firebase exija login recente para excluir
    if (error.code === "auth/requires-recent-login") {
      alert("⚠️ Por segurança, faça login novamente para excluir sua conta.");
      await signOut(auth);
      window.location.href = "login.html";
    } else {
      alert("❌ Ocorreu um erro ao tentar excluir sua conta. Tente novamente mais tarde.");
    }
  }
});
