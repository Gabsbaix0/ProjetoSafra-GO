// js/cadastro.js

// Espera o carregamento completo do conteúdo da página antes de executar o script
document.addEventListener("DOMContentLoaded", () => {

  // Obtém o formulário principal de cadastro pelo ID
  const form = document.getElementById("formCadastroPessoal");

  // 🔹 Captura os campos que terão máscaras aplicadas (formatação automática)
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const cepInput = document.getElementById("cep");

  // =====================================================
  // 🧩 MÁSCARA DE CPF (formata automaticamente enquanto digita)
  // =====================================================
  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      // Remove qualquer caractere que não seja número
      let value = e.target.value.replace(/\D/g, '');
      // Se o valor tiver até 11 dígitos (limite do CPF)
      if (value.length <= 11) {
        // Adiciona pontos e traço conforme o formato do CPF (XXX.XXX.XXX-XX)
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        // Atualiza o campo com o valor formatado
        e.target.value = value;
      }
    });
  }

  // =====================================================
  // 📞 MÁSCARA DE TELEFONE (formata para padrão brasileiro)
  // =====================================================
  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      // Remove tudo que não for número
      let value = e.target.value.replace(/\D/g, '');
      // Se tiver até 11 dígitos (DDD + número)
      if (value.length <= 11) {
        // Aplica máscara: (XX) XXXXX-XXXX
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  // =====================================================
  // 🏠 MÁSCARA DE CEP + BUSCA AUTOMÁTICA DE ENDEREÇO
  // =====================================================
  if (cepInput) {
    cepInput.addEventListener("input", async (e) => {
      // Remove caracteres não numéricos
      let value = e.target.value.replace(/\D/g, '');
      // Formata o CEP como XXXXX-XXX
      if (value.length <= 8) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }

      // 🔍 Quando o CEP tiver 8 dígitos, busca automaticamente o endereço na API ViaCEP
      if (value.replace(/\D/g, '').length === 8) {
        try {
          // Faz a requisição à API do ViaCEP
          const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
          const data = await response.json();

          // Se o CEP for válido (sem erro)
          if (!data.erro) {
            // Preenche automaticamente os campos de endereço
            document.getElementById("endereco").value = data.logradouro || '';
            document.getElementById("bairro").value = data.bairro || '';
            document.getElementById("cidade").value = data.localidade || '';
            document.getElementById("uf").value = data.uf || '';
          }
        } catch (error) {
          // Caso a API falhe ou o CEP seja inválido
          console.error("Erro ao buscar CEP:", error);
        }
      }
    });
  }
  // 🔚 Fim das máscaras

  // =====================================================
  // 🧾 ENVIO DO FORMULÁRIO (CADASTRO)
  // =====================================================
  form.addEventListener("submit", (e) => {
    // Evita o comportamento padrão do formulário (recarregar a página)
    e.preventDefault();

    // Captura os valores dos campos e remove espaços extras
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

    // 🔒 Verifica se os campos obrigatórios estão preenchidos
    if (!nome || !cpf || !email) {
      alert("Preencha os campos obrigatórios: Nome, CPF e E-mail!");
      return;
    }

    // Cria um objeto com todos os dados do usuário
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
      complemento
    };

    // 🧠 Armazena temporariamente os dados no navegador (localStorage)
    localStorage.setItem("usuarioDados", JSON.stringify(userData));

    // 👉 Redireciona para a próxima etapa do cadastro (definir senha)
    window.location.href = "cadastro_senha.html";
  });
});
