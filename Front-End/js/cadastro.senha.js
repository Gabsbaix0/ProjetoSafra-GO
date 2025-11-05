// js/cadastro.senha.js 

// Importa o módulo de autenticação do Firebase configurado no arquivo firebaseConfig.js
import { auth } from "./firebaseConfig.js";

// Importa funções específicas de autenticação do Firebase:
// - createUserWithEmailAndPassword: cria um novo usuário com e-mail e senha
// - updateProfile: atualiza o perfil do usuário (ex: nome)
// - sendEmailVerification: envia e-mail de verificação de conta
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Importa o banco de dados Firestore configurado
import { db } from "./firebaseConfig.js";

// Importa funções do Firestore para salvar dados (setDoc e doc)
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Aguarda o carregamento completo da página antes de executar o script
document.addEventListener("DOMContentLoaded", () => {

  // Captura o formulário de senha e a área de mensagem de feedback
  const form = document.getElementById("formSenha");
  const msg = document.getElementById("msg");

  // Adiciona evento ao envio do formulário
  form.addEventListener("submit", async (e) => {
    // Impede o comportamento padrão (recarregar a página)
    e.preventDefault();

    // Obtém os valores das senhas digitadas e remove espaços extras
    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmarSenha").value.trim();

    // Recupera os dados pessoais salvos anteriormente no localStorage
    const userData = JSON.parse(localStorage.getItem("usuarioDados"));

    // Se não houver dados anteriores, o usuário precisa voltar e preencher o cadastro pessoal
    if (!userData) {
      alert("Volte e preencha seus dados pessoais primeiro.");
      window.location.href = "cadastro_pessoal.html";
      return;
    }

    // Verifica se as senhas digitadas são iguais
    if (senha !== confirmar) {
      msg.textContent = "As senhas não coincidem!";
      msg.style.color = "red";
      return;
    }

    // Exibe mensagem de progresso
    msg.textContent = "Criando conta...";
    msg.style.color = "#2e7d32";

    try {
      // 🔹 Cria o usuário no Firebase Authentication usando e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, senha);
      const user = userCredential.user; // Usuário recém-criado

      // 🔹 Recupera o tipo de usuário salvo antes (por exemplo, vendedor ou comprador)
      const tipoUsuario = localStorage.getItem("tipoUsuario") || "não informado";  

      // 🔹 Atualiza o perfil do usuário com o nome informado
      await updateProfile(user, { displayName: userData.nome });
      console.log("✅ Nome salvo no perfil Firebase:", userData.nome);

      // 🔹 Cria um documento no Firestore com os dados do usuário
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
        criadoEm: new Date().toISOString() // Armazena a data e hora da criação
      });

      // 🔹 Salva também o nome do usuário localmente
      localStorage.setItem("usuarioNome", userData.nome);

      // 🔹 Envia e-mail de verificação para o usuário
      await sendEmailVerification(user);
      console.log("📧 E-mail de verificação enviado para:", userData.email);

      // 🔹 Gera um código aleatório de 6 dígitos para verificação via EmailJS
      const codigo = Math.floor(100000 + Math.random() * 900000).toString();

      // 🔹 Envia o código para o e-mail do usuário usando o serviço EmailJS
      await emailjs.send("service_gmail123", "template_n93v9ms", {
        to_email: userData.email,
        to_name: userData.nome,
        codigo: codigo,
      });

      // 🔹 Guarda temporariamente os dados de cadastro e o código no localStorage
      localStorage.setItem("cadastro_temp", JSON.stringify({
        ...userData,
        senha,
        codigo,
      }));

      // Exibe mensagem de sucesso
      msg.textContent = "Conta criada com sucesso! Verifique seu e-mail.";
      msg.style.color = "green";

      // Redireciona o usuário para a página de verificação após 2 segundos
      setTimeout(() => {
        window.location.href = "verificar.html";
      }, 2000);

    } catch (error) {
      // Captura e exibe erros que possam ocorrer durante o processo
      console.error("❌ Erro ao criar conta:", error);
      msg.textContent = "Erro ao criar conta. Tente novamente.";
      msg.style.color = "red";
    }
  });
});
