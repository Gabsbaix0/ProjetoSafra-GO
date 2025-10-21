// login.js - Funcionalidades específicas de login
const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const errorMessage = document.getElementById('errorMessage');

    // Verifica se os elementos necessários existem na página
    if (!loginBtn || !emailInput || !senhaInput || !errorMessage) {
        console.error('Elementos de login não encontrados no DOM.');
        return;
    }

    // Em: login.js
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const senha = senhaInput.value;

    errorMessage.style.display = 'none';
    loginBtn.textContent = 'Entrando...';
    loginBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        // 1. Lê o JSON da resposta (seja sucesso ou erro)
        const data = await response.json();

        // 2. Verifica se a resposta NÃO foi OK
        if (!response.ok) {
            // 3. Lança um erro com a MENSAGEM REAL do servidor
            throw new Error(data.mensagem || 'Erro desconhecido do servidor');
        }

        // 4. Salva o TOKEN 
        localStorage.setItem('token', data.token); 
        // Salva os dados do usuário
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        const { id_usuario, nome, tipo_usuario } = data.usuario;
        localStorage.setItem('user_id', id_usuario);
        localStorage.setItem('user_name', nome);
        localStorage.setItem('user_type', tipo_usuario);
        
        // 5. Redireciona 
        if (tipo_usuario === 'P') {
            window.location.href = 'tela7_perfil_vendedor.html'; 
        } else if (tipo_usuario === 'C') {
            window.location.href = 'home2.html'; 
        } else {
            console.warn('Tipo de usuário desconhecido:', tipo_usuario);
            window.location.href = 'home2.html'; 
        }

    } catch (error) {
        // 6. O CATCH agora recebe a mensagem de erro correta
        console.error('Erro de login:', error.message);
        // 7. Exibe a MENSAGEM na tela (ex: "Email ou senha inválidos.")
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        loginBtn.textContent = 'Entrar';
        loginBtn.disabled = false;
    }
});

    // Enter para fazer login
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginBtn.click();
        }
    });
});