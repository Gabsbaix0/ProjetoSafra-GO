// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona elementos do HTML
    const resetForm = document.getElementById('resetForm');              // Formulário de redefinição
    const btnSalvar = document.getElementById('btnSalvar');              // Botão "Salvar Nova Senha"
    const novaSenhaInput = document.getElementById('novaSenha');         // Campo da nova senha
    const confirmarSenhaInput = document.getElementById('confirmarSenha'); // Campo para confirmar senha
    const messageEl = document.getElementById('message');                // Elemento de mensagens (erro/sucesso)
    const resetContainer = document.getElementById('resetContainer');    // Contêiner do formulário

    // Endereço da API backend (Node.js local)
    const API_URL = 'http://localhost:3000';

    // --- PASSO 1: Pegar o Token da URL ---
    // Exemplo de URL: http://localhost:3000/redefinir-senha.html?token=ABC123XYZ
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Captura o valor do parâmetro "token" na URL

    // Se não houver token, o formulário não deve ser exibido
    if (!token) {
        resetContainer.innerHTML = `
            <h1>Token inválido ou ausente.</h1> 
            <a href="esqueci-senha.html">Solicite um novo link</a>
        `;
        return; // Interrompe a execução
    }

    // --- PASSO 2: Enviar a nova senha ---
    // Evento que dispara ao enviar o formulário
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita o envio tradicional da página

        const novaSenha = novaSenhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        // --- Validação simples no front-end ---
        if (novaSenha !== confirmarSenha) {
            messageEl.textContent = 'As senhas não conferem.';
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            return;
        }

        if (novaSenha.length < 6) { // Regra mínima de segurança (pode ajustar)
            messageEl.textContent = 'A senha deve ter pelo menos 6 caracteres.';
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            return;
        }

        // --- Feedback visual enquanto processa ---
        btnSalvar.textContent = 'Salvando...';
        btnSalvar.disabled = true;
        messageEl.style.display = 'none';

        try {
            // Faz requisição POST para o backend (rota de redefinir senha)
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token, novaSenha: novaSenha })
            });

            // Recebe resposta da API em formato JSON
            const data = await response.json();

            // Se o status HTTP não for sucesso (200 OK)
            if (!response.ok) {
                // Ex: "Token expirado." ou "Token inválido."
                throw new Error(data.mensagem || 'Erro ao redefinir senha.');
            }

            // --- Sucesso ---
            // Substitui o formulário por uma mensagem de confirmação
            resetContainer.innerHTML = `
                <h2 style="color: green;">Senha atualizada com sucesso!</h2>
                <p>${data.mensagem}</p>
                <a href="tela1_login.html">Ir para o Login</a>
            `;

        } catch (error) {
            // Exibe mensagem de erro na tela
            messageEl.textContent = error.message;
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            
            // Reabilita botão para o usuário tentar novamente
            btnSalvar.textContent = 'Salvar Nova Senha';
            btnSalvar.disabled = false;
        }
    });
});

// ===============================
// Comentários extras para referência
// ===============================

// Abaixo estão hashes de exemplo (bcrypt) usados em testes:
// antiga: $2b$10$vtgDDf/SJh32LT6oIMnYX.DkQqxp9Vq6FtWVD2.6bD0FDoxFb.Mwa
// nova:   $2b$10$sYqarSeBaIm.PSvz2SSjKeQhcop3AEyl9mq9v1tjaQ3qaCE3Wb6eO
//
// Esses valores representam senhas criptografadas no banco, geradas via bcrypt.
// Cada vez que uma senha é redefinida, o backend substitui o hash antigo pelo novo.
