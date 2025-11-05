// js/cadastro.senha.js
import { auth } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { db } from "./firebaseConfig.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSenha");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmarSenha").value.trim();
    const userData = JSON.parse(localStorage.getItem("usuarioDados"));

    if (!userData) {
      alert("Volte e preencha seus dados pessoais primeiro.");
      window.location.href = "cadastro_pessoal.html";
      return;
    }

    if (senha !== confirmar) {
      msg.textContent = "As senhas não coincidem!";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Criando conta...";
    msg.style.color = "#2e7d32";

    try {
      // 🔹 Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, senha);
      const user = userCredential.user;

     // 🔹 Pega o tipo de usuário salvo anteriormente (vendedor/comprador)
      const tipoUsuario = localStorage.getItem("tipoUsuario") || "não informado";  

      // 🔹 Atualiza o nome no perfil do Firebase
      await updateProfile(user, { displayName: userData.nome });
      console.log("✅ Nome salvo no perfil Firebase:", userData.nome);

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: userData.nome,
        email: userData.email,
        cpf_cnpj: userData.cpf_cnpj || "",
        telefone: userData.telefone || "",
        endereco: userData.endereco || "",
        numero: userData.numero || "",
        cidade: userData.cidade || "",
        cep: userData.cep || "",
        uf: userData.uf || "",
        bairro: userData.bairro || "",
        complemento: userData.complemento || "",
        tipoUsuario: tipoUsuario,
        criadoEm: new Date().toISOString()
      });


      // 🔹 Guarda também no localStorage
      localStorage.setItem("usuarioNome", userData.nome);

      // 🔹 Envia e-mail de verificação
      await sendEmailVerification(user);
      console.log("📧 E-mail de verificação enviado para:", userData.email);

      // 🔹 Envia o código via EmailJS
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();
      await emailjs.send("service_gmail123", "template_n93v9ms", {
        to_email: userData.email,
        to_name: userData.nome,
        codigo: codigo,
      });

      // 🔹 Guarda dados temporários
      localStorage.setItem("cadastro_temp", JSON.stringify({
        ...userData,
        senha,
        codigo,
      }));

      msg.textContent = "Conta criada com sucesso! Verifique seu e-mail.";
      msg.style.color = "green";

      setTimeout(() => {
        window.location.href = "verificar.html";
      }, 2000);

    } catch (error) {
      console.error("❌ Erro ao criar conta:", error);
      msg.textContent = "Erro ao criar conta. Tente novamente.";
      msg.style.color = "red";
    }
  });
});
