// cadastro.senha.js - Corrigido
document.addEventListener('DOMContentLoaded', function () {
    configurarCadastroSenha();
});

function configurarCadastroSenha() {
    const btnAvancar = document.querySelector('.arrow-button');

    if (btnAvancar) {
        btnAvancar.addEventListener('click', validarECompletarCadastro);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            validarECompletarCadastro();
        }
    });

    mostrarEmailUsuario();
}

function mostrarEmailUsuario() {
    const dados = JSON.parse(localStorage.getItem('dadosCadastroTemporarios'));
    const emailElement = document.getElementById('emailUsuario');

    if (emailElement && dados) {
        emailElement.textContent = dados.email;
    }
}

function validarECompletarCadastro() {
    limparErros();

    const senha = document.getElementById('senha').value.trim();
    const confirmarSenha = document.getElementById('confirmarSenha').value.trim();

    let erro = false;

    if (!senha) {
        mostrarErro('senha', 'Senha é obrigatória.');
        erro = true;
    } else if (senha.length < 6) {
        mostrarErro('senha', 'Senha deve ter pelo menos 6 caracteres.');
        erro = true;
    }

    if (!confirmarSenha) {
        mostrarErro('confirmarSenha', 'Confirme sua senha.');
        erro = true;
    } else if (senha && confirmarSenha !== senha) {
        mostrarErro('confirmarSenha', 'As senhas não coincidem.');
        erro = true;
    }

    if (erro) return;

    completarCadastro(senha);
}

async function completarCadastro(senha) {
    const btnAvancar = document.querySelector('.arrow-button');
    
    try {
        // ✅ Mostrar loading no botão
        btnAvancar.disabled = true;
        btnAvancar.innerHTML = '<div class="loading-spinner"></div>';

        const dadosTemp = JSON.parse(localStorage.getItem('dadosCadastroTemporarios'));

        if (!dadosTemp) {
            mostrarErroGeral('Dados não encontrados. Volte para a etapa anterior.');
            return;
        }

        const dadosCompletos = {
            nome: `${dadosTemp.nome} ${dadosTemp.sobrenome}`,
            email: dadosTemp.email,
            senha: senha,
            telefone: dadosTemp.telefone,
            tipo_usuario: dadosTemp.tipo_usuario
        };

        console.log('Enviando para cadastro:', dadosCompletos);

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosCompletos)
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ SUCESSO: Limpar dados e redirecionar para home
            localStorage.removeItem('dadosCadastroTemporarios');
            mostrarSucesso('Cadastro realizado com sucesso! Redirecionando...');
            
            // ✅ Redirecionar para home após 2 segundos
            setTimeout(() => {
                window.location.href = 'home2.html';
            }, 2000);
            
        } else {
            mostrarErroGeral(data.mensagem || 'Erro ao cadastrar.');
        }

    } catch (error) {
        console.error('Erro:', error);
        mostrarErroGeral('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
        // ✅ Restaurar botão
        btnAvancar.disabled = false;
        btnAvancar.innerHTML = '<img src="../imagens/arrow_right.png" alt="Próximo" class="arrow-icon">';
    }
}

// ✅ Nova função para mostrar sucesso
function mostrarSucesso(mensagem) {
    const sucessoDiv = document.getElementById('sucessoGeral') || criarElementoSucesso();
    sucessoDiv.textContent = mensagem;
    sucessoDiv.style.display = 'block';
    sucessoDiv.className = 'mensagem-sucesso';
}

function criarElementoSucesso() {
    const sucessoDiv = document.createElement('div');
    sucessoDiv.id = 'sucessoGeral';
    sucessoDiv.className = 'mensagem-sucesso';
    sucessoDiv.style.cssText = `
        background-color: #4CAF50;
        color: white;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 16px;
        text-align: center;
        display: none;
    `;
    
    const formCard = document.querySelector('.form-card');
    formCard.insertBefore(sucessoDiv, formCard.firstChild);
    return sucessoDiv;
}

// Utilitários de feedback visual (mantém os existentes)
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

function mostrarErroGeral(mensagem) {
    const erroGeral = document.getElementById('erroGeral');
    if (erroGeral) {
        erroGeral.textContent = mensagem;
        erroGeral.style.display = 'block';
    }
}

function limparErros() {
    document.querySelectorAll('.mensagem-erro').forEach(el => el.remove());
    document.querySelectorAll('.campo-invalido').forEach(el => el.classList.remove('campo-invalido'));
    const erroGeral = document.getElementById('erroGeral');
    if (erroGeral) erroGeral.style.display = 'none';
    
    const sucessoGeral = document.getElementById('sucessoGeral');
    if (sucessoGeral) sucessoGeral.style.display = 'none';
}

// ✅ Adicionar estilo do loading
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .mensagem-sucesso {
        background-color: #4CAF50 !important;
    }
`;
document.head.appendChild(style);