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

            if (!response.ok) {
                const texto = await response.text();  // vê o que veio (HTML de erro, etc)
                console.error('Resposta não ok:', texto);
                throw new Error('Erro na requisição');
}
            
            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido
                const { id_usuario, nome, tipo_usuario } = data.usuario;
                
                // Armazenar dados na sessão/localStorage
                localStorage.setItem('user_id', id_usuario);
                localStorage.setItem('user_name', nome);
                localStorage.setItem('user_type', tipo_usuario);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                // Redirecionar baseado no tipo de usuário
                if (tipo_usuario === 'P') {
                    window.location.href = 'tela7_perfil_vendedor.html'; 
                } else if (tipo_usuario === 'C') {
                    window.location.href = 'home2.html'; 
                } else {
                    console.warn('Tipo de usuário desconhecido:', tipo_usuario);
                    window.location.href = 'home2.html'; 
                }

            } else {
                errorMessage.textContent = data.erro || 'Ocorreu um erro no login. Tente novamente.';
                errorMessage.style.display = 'block';
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            errorMessage.textContent = 'Falha na comunicação com o servidor. Verifique a conexão.';
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