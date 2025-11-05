// js/cadastroGoogle.js

// Importa a função para inicializar o Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Importa funções do Firestore para manipular dados no banco (getFirestore, doc, setDoc, updateDoc)
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Importa o banco de dados Firestore configurado no arquivo firebaseConfig.js
import { db as importedDb } from "./firebaseConfig.js";

// Define o banco de dados Firestore a ser usado:
// - Usa o importado se já existir
// - Caso contrário, inicializa um novo app Firebase e cria um Firestore com as credenciais abaixo
const db = importedDb || getFirestore(initializeApp({
    apiKey: "AIzaSyDFHI6DTyhFeWVOvJiGKB98UvdQIfgUkRU",
    authDomain: "login-firebase-7aab7.firebaseapp.com",
    projectId: "login-firebase-7aab7",
    storageBucket: "login-firebase-7aab7.appspot.com",
    messagingSenderId: "340233869223",
    appId: "1:340233869223:web:c0ee6e07e5f0d6cb85b07b"
}));

// Aguarda o carregamento completo da página antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    // Captura o formulário de cadastro para usuários do Google
    const form = document.getElementById("formCadastroGoogle");

    // 🔹 Verifica se o login foi feito via conta Google
    const googleUser = JSON.parse(localStorage.getItem("usuarioGoogle"));

    if (!googleUser) {
        // Caso não tenha vindo do Google, segue fluxo normal
        console.log("Usuário comum — não pré-preencher campos automáticos.");
    } else {
        // 🔹 Se veio do Google, pré-preenche automaticamente nome e e-mail no formulário

        // Se houver nome, divide em nome e sobrenome e preenche nos campos correspondentes
        if (googleUser.nome && document.getElementById("nome") && document.getElementById("sobrenome")) {
            const nomeCompleto = googleUser.nome.split(" ");
            document.getElementById("nome").value = nomeCompleto[0] || "";
            document.getElementById("sobrenome").value = nomeCompleto.slice(1).join(" ") || "";
        }

        // Se houver e-mail, preenche no campo de e-mail
        if (googleUser.email && document.getElementById("email")) {
            document.getElementById("email").value = googleUser.email;
        }
    }

    // ============================================================
    // 🔹 Máscaras de CPF, Telefone e CEP (formatação automática)
    // ============================================================
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");

    // Máscara de CPF (XXX.XXX.XXX-XX)
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

    // Máscara de telefone ((XX) XXXXX-XXXX)
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

    // Máscara de CEP e busca automática no ViaCEP
    if (cepInput) {
        cepInput.addEventListener("input", async (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }

            // 🔹 Quando o CEP estiver completo (8 dígitos), busca o endereço na API ViaCEP
            if (value.replace(/\D/g, '').length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
                    const data = await response.json();

                    // Se o CEP for válido, preenche automaticamente os campos de endereço
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

    // ============================================================
    // 🔹 Envio do formulário (salva dados do usuário)
    // ============================================================
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Captura todos os campos preenchidos
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

        // Verifica se os campos obrigatórios estão preenchidos
        if (!nome || !cpf || !email) {
            alert("Preencha os campos obrigatórios: Nome, CPF e E-mail!");
            return;
        }

        // 🔹 Pega o tipo de usuário salvo (vendedor ou comprador)
        const tipoUsuario = localStorage.getItem("tipoUsuario") || "não informado";

        // Cria objeto com todos os dados do usuário
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
            tipoUsuario // Inclui o tipo no Firestore
        };

        // Salva os dados localmente no navegador
        localStorage.setItem("usuarioDados", JSON.stringify(userData));
        localStorage.setItem("cadastroCompleto", "true");

        // Verifica se o usuário atual veio do login com Google
        const usuarioGoogleRaw = localStorage.getItem("usuarioGoogle");
        const usuarioGoogle = usuarioGoogleRaw ? JSON.parse(usuarioGoogleRaw) : null;

        if (usuarioGoogle) {
            try {
                // 🔹 Atualiza o documento do usuário no Firestore com os novos dados
                const userRef = doc(db, "usuarios", usuarioGoogle.uid);
                await updateDoc(userRef, userData);
                console.log("✅ Dados do Google atualizados no Firestore!");

                // 🔹 Envia e-mail de boas-vindas usando EmailJS
                try {
                    // Inicializa o EmailJS com a Public Key configurada
                    emailjs.init("D00Vedsq-Hfp3cX17");

                    // Envia o e-mail com nome e e-mail do usuário
                    await emailjs.send("service_gmail123", "template_lq0jdhi", {
                        nome: usuarioGoogle.nome,
                        email: usuarioGoogle.email
                    });

                    console.log("📧 Email de boas-vindas enviado com sucesso!");
                } catch (emailError) {
                    console.error("❌ Erro ao enviar e-mail de boas-vindas:", emailError);
                }

                // 🔹 Redireciona o usuário para a tela de boas-vindas após finalizar tudo
                window.location.href = "welcome.html";
            } catch (err) {
                // Caso ocorra erro ao salvar no banco, mostra alerta
                console.error("Erro ao salvar no Firestore:", err);
                alert("❌ Erro ao salvar seus dados. Tente novamente.");
            }
        } else {
            // 🔹 Caso não seja usuário Google, redireciona para a etapa de criação de senha
            window.location.href = "cadastro_senha.html";
        }
    });
});
