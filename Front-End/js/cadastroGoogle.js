// js/cadastroGoogle.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db as importedDb } from "./firebaseConfig.js";

const db = importedDb || getFirestore(initializeApp({
    apiKey: "AIzaSyDFHI6DTyhFeWVOvJiGKB98UvdQIfgUkRU",
    authDomain: "login-firebase-7aab7.firebaseapp.com",
    projectId: "login-firebase-7aab7",
    storageBucket: "login-firebase-7aab7.appspot.com",
    messagingSenderId: "340233869223",
    appId: "1:340233869223:web:c0ee6e07e5f0d6cb85b07b"
}));


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastroGoogle");

    // 🔹 Confere se o login veio do Google
    const googleUser = JSON.parse(localStorage.getItem("usuarioGoogle"));
    if (!googleUser) {
        console.log("Usuário comum — não pré-preencher campos automáticos.");
    } else {
        // 🔹 Somente aqui entra o pré-preenchimento do nome e e-mail
        if (googleUser.nome && document.getElementById("nome") && document.getElementById("sobrenome")) {
            const nomeCompleto = googleUser.nome.split(" ");
            document.getElementById("nome").value = nomeCompleto[0] || "";
            document.getElementById("sobrenome").value = nomeCompleto.slice(1).join(" ") || "";
        }

        if (googleUser.email && document.getElementById("email")) {
            document.getElementById("email").value = googleUser.email;
        }
    }


    //  Adiciona máscaras aos campos
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");

    if (cpfInput) {
        cpfInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }

    if (cepInput) {
        cepInput.addEventListener("input", async (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }

            // 🔹 Buscar CEP automaticamente quando completo
            if (value.replace(/\D/g, '').length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
                    const data = await response.json();

                    if (!data.erro) {
                        document.getElementById("endereco").value = data.logradouro || '';
                        document.getElementById("bairro").value = data.bairro || '';
                        document.getElementById("cidade").value = data.localidade || '';
                        document.getElementById("uf").value = data.uf || '';
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        });
    }


    //  Envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const sobrenome = document.getElementById("sobrenome").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const cep = document.getElementById("cep").value.trim();
        const cidade = document.getElementById("cidade").value.trim();
        const uf = document.getElementById("uf").value.trim();
        const endereco = document.getElementById("endereco").value.trim();
        const numero = document.getElementById("numero").value.trim();
        const bairro = document.getElementById("bairro").value.trim();
        const complemento = document.getElementById("complemento").value.trim();

        if (!nome || !cpf || !email) {
            alert("Preencha os campos obrigatórios: Nome, CPF e E-mail!");
            return;
        }

        // 🔹 Pega o tipo de usuário salvo na escolha (vendedor ou comprador)
        const tipoUsuario = localStorage.getItem("tipoUsuario") || "não informado";

        const userData = {
            nome: `${nome} ${sobrenome}`.trim(),
            cpf_cnpj: cpf,
            email,
            telefone,
            cep,
            cidade,
            uf,
            endereco,
            numero,
            bairro,
            complemento,
            tipoUsuario // 🔹 Inclui o tipo no Firestore
        };

        localStorage.setItem("usuarioDados", JSON.stringify(userData));
        localStorage.setItem("cadastroCompleto", "true");

        // Verifica se o usuário veio do Google
        const usuarioGoogleRaw = localStorage.getItem("usuarioGoogle");
        const usuarioGoogle = usuarioGoogleRaw ? JSON.parse(usuarioGoogleRaw) : null;

        if (usuarioGoogle) {
            try {
                // 🔹 Atualiza o documento do Firestore com os dados completos
                const userRef = doc(db, "usuarios", usuarioGoogle.uid);
                await updateDoc(userRef, userData);
                console.log("✅ Dados do Google atualizados no Firestore!");

                // Envia e-mail de boas-vindas pelo EmailJS
                try {
                    // Inicializa o EmailJS (use sua Public Key do EmailJS)
                    emailjs.init("D00Vedsq-Hfp3cX17");

                    await emailjs.send("service_gmail123", "template_lq0jdhi", {
                        nome: usuarioGoogle.nome,
                        email: usuarioGoogle.email
                    });

                    console.log("📧 Email de boas-vindas enviado com sucesso!");
                } catch (emailError) {
                    console.error("❌ Erro ao enviar e-mail de boas-vindas:", emailError);
                }


                // 🔹 Redireciona depois de tudo concluído
                window.location.href = "welcome.html";
            } catch (err) {
                console.error("Erro ao salvar no Firestore:", err);
                alert("❌ Erro ao salvar seus dados. Tente novamente.");
            }
        } else {
            // 🔹 Usuário comum → continua para criar senha
            window.location.href = "cadastro_senha.html";
        }

    });
})
