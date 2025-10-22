document.addEventListener('DOMContentLoaded', () => {
    
    const resetForm = document.getElementById('resetForm');
    const btnSalvar = document.getElementById('btnSalvar');
    const novaSenhaInput = document.getElementById('novaSenha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const messageEl = document.getElementById('message');
    const resetContainer = document.getElementById('resetContainer');

    const API_URL = 'http://localhost:3000';

    // --- PASSO 1: Pegar o Token da URL ---
    // Ex: http://.../redefinir-senha.html?token=ABC123XYZ
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Se não tiver token na URL, é inútil mostrar o formulário.
    if (!token) {
        resetContainer.innerHTML = '<h1>Token inválido ou ausente.</h1> <a href="esqueci-senha.html">Solicite um novo link</a>';
        return;
    }

    // --- PASSO 2: Enviar a nova senha ---
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaSenha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        // Validação simples no frontend
        if (novaSenha !== confirmarSenha) {
            messageEl.textContent = 'As senhas não conferem.';
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            return;
        }

        if (novaSenha.length < 6) { // Coloque sua regra (ex: 6 caracteres)
            messageEl.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            return;
        }

        // Feedback visual
        btnSalvar.textContent = 'Salvando...';
        btnSalvar.disabled = true;
        messageEl.style.display = 'none';

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, novaSenha: novaSenha })
            });

            const data = await response.json();

            if (!response.ok) {
                // Ex: "Token expirado." ou "Token inválido."
                throw new Error(data.mensagem || 'Erro ao redefinir senha.');
            }

            // Sucesso!
            resetContainer.innerHTML = `
                <h2 style="color: green;">Senha atualizada com sucesso!</h2>
                <p>${data.mensagem}</p>
                <a href="tela1_login.html">Ir para o Login</a>
            `;

        } catch (error) {
            messageEl.textContent = error.message;
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            
            // Reabilita para o usuário tentar de novo
            btnSalvar.textContent = 'Salvar Nova Senha';
            btnSalvar.disabled = false;
        }
    });
});

//troca de senhas
// antiga: $2b$10$vtgDDf/SJh32LT6oIMnYX.DkQqxp9Vq6FtWVD2.6bD0FDoxFb.Mwa
// nova: $2b$10$sYqarSeBaIm.PSvz2SSjKeQhcop3AEyl9mq9v1tjaQ3qaCE3Wb6eO