document.addEventListener('DOMContentLoaded', function () {
    configurarCadastro();
    configurarBuscaCEP();
});

function configurarCadastro() {
    const btnAvancar = document.querySelector('.arrow-button');

    if (btnAvancar) {
        btnAvancar.addEventListener('click', validarEAvancar);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            validarEAvancar();
        }
    });
}

function validarEAvancar() {
    limparErros();

    const dados = {
        nome: document.getElementById('nome')?.value.trim(),
        sobrenome: document.getElementById('sobrenome')?.value.trim(),
        cpf: document.getElementById('cpf')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        telefone: document.getElementById('telefone')?.value.trim(),
        tipo_usuario: getTipoUsuarioFromURL()
    };

    let erro = false;

    if (!dados.nome) {
        mostrarErro('nome', 'Nome é obrigatório.');
        erro = true;
    } else if (dados.nome.length < 2) {
        mostrarErro('nome', 'Nome deve ter pelo menos 2 caracteres.');
        erro = true;
    }

    if (!dados.sobrenome) {
        mostrarErro('sobrenome', 'Sobrenome é obrigatório.');
        erro = true;
    }

    if (!dados.email) {
        mostrarErro('email', 'E-mail é obrigatório.');
        erro = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
        mostrarErro('email', 'E-mail inválido.');
        erro = true;
    }

    const cpfNumeros = dados.cpf.replace(/\D/g, '');
    if (!dados.cpf) {
        mostrarErro('cpf', 'CPF é obrigatório.');
        erro = true;
    } else if (cpfNumeros.length !== 11) {
        mostrarErro('cpf', 'CPF deve conter 11 dígitos numéricos.');
        erro = true;
    }

    const telefoneNumeros = dados.telefone.replace(/\D/g, '');
    if (!dados.telefone) {
        mostrarErro('telefone', 'Telefone é obrigatório.');
        erro = true;
    } else if (telefoneNumeros.length < 10) {
        mostrarErro('telefone', 'Telefone deve conter ao menos 10 dígitos.');
        erro = true;
    }

    if (erro) return;

    salvarDadosTemporarios(dados);
    window.location.href = 'tela4_cadastro_senha.html';
}

function salvarDadosTemporarios(dados) {
    const dadosCompletos = {
        ...dados,
        cep: document.getElementById('cep')?.value || '',
        endereco: document.getElementById('endereco')?.value || '',
        numero: document.getElementById('numero')?.value || '',
        bairro: document.getElementById('bairro')?.value || '',
        cidade: document.getElementById('cidade')?.value || '',
        uf: document.getElementById('uf')?.value || '',
        complemento: document.getElementById('complemento')?.value || ''
    };

    localStorage.setItem('dadosCadastroTemporarios', JSON.stringify(dadosCompletos));
}

function getTipoUsuarioFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    return tipo === 'produtor' ? 'P' : 'C';
}

function configurarBuscaCEP() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCEP);
    }
}

async function buscarCEP() {
    limparErros();

    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const endereco = await response.json();

            if (!endereco.erro) {
                document.getElementById('endereco').value = endereco.logradouro || '';
                document.getElementById('bairro').value = endereco.bairro || '';
                document.getElementById('cidade').value = endereco.localidade || '';
                document.getElementById('uf').value = endereco.uf || '';
            } else {
                mostrarErro('cep', 'CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            mostrarErro('cep', 'Erro ao buscar o CEP. Verifique sua conexão.');
        }
    }
}

function mostrarErro(idCampo, mensagem) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;

    const erroId = idCampo + '-erro';
    let erroSpan = document.getElementById(erroId);

    if (!erroSpan) {
        erroSpan = document.createElement('span');
        erroSpan.id = erroId;
        erroSpan.className = 'mensagem-erro';
        campo.parentNode.insertBefore(erroSpan, campo.nextSibling);
    }

    erroSpan.textContent = mensagem;
    campo.classList.add('campo-invalido');
}

function limparErros() {
    document.querySelectorAll('.mensagem-erro').forEach(el => el.remove());
    document.querySelectorAll('.campo-invalido').forEach(el => el.classList.remove('campo-invalido'));
}
