// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Captura os elementos do formulário de recuperação de senha
    const forgotForm = document.getElementById('forgotForm'); // Formulário principal
    const btnEnviar = document.getElementById('btnEnviar');   // Botão de envio
    const emailInput = document.getElementById('email');      // Campo de e-mail
    const messageEl = document.getElementById('message');     // Elemento para exibir mensagens de retorno

    // Define a URL base da API (servidor backend que processa o pedido de redefinição de senha)
    const API_URL = 'http://localhost:3000'; 

    // Adiciona o evento de envio (submit) ao formulário
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio tradicional do formulário (recarregar a página)
        
        const email = emailInput.value; // Obtém o valor do campo de e-mail
        if (!email) return; // Se o campo estiver vazio, interrompe a execução

        // 🔹 Feedback visual para o usuário enquanto o e-mail é enviado
        btnEnviar.textContent = 'Enviando...'; // Altera o texto do botão
        btnEnviar.disabled = true;             // Desabilita o botão para evitar múltiplos cliques
        messageEl.style.display = 'none';      // Esconde mensagens anteriores

        try {
            // Faz uma requisição HTTP POST para o endpoint /api/auth/forgot-password
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST', // Método de envio
                headers: { 'Content-Type': 'application/json' }, // Indica envio de JSON
                body: JSON.stringify({ email }) // Corpo da requisição com o e-mail do usuário
            });

            // Aguarda e converte a resposta do servidor para JSON
            const data = await response.json();

            // Se a resposta do backend não for "ok" (status 200), lança um erro
            if (!response.ok) {
                // Mesmo em caso de erro, o backend retorna uma mensagem genérica
                // para não expor se o e-mail realmente existe no sistema.
                // Caso seja erro 500, o texto de erro será "Erro no servidor".
                throw new Error(data.mensagem || 'Erro ao enviar.');
            }

            // 🔹 Caso a requisição tenha sido bem-sucedida
            messageEl.textContent = data.mensagem; // Exibe a mensagem de sucesso vinda do backend
            messageEl.style.color = 'green';       // Define cor verde (sucesso)
            messageEl.style.display = 'block';     // Mostra a mensagem na tela
            emailInput.disabled = true;            // Desabilita o campo de e-mail após o envio
            btnEnviar.disabled = true;             // Desabilita o botão de envio

        } catch (error) {
            // 🔹 Caso ocorra algum erro (falha de conexão ou erro interno)
            messageEl.textContent = error.message; // Exibe o erro para o usuário
            messageEl.style.color = 'red';         // Cor vermelha (erro)
            messageEl.style.display = 'block';     // Mostra a mensagem de erro
            
            // Reabilita o botão para o usuário tentar novamente
            btnEnviar.textContent = 'Enviar Link'; 
            btnEnviar.disabled = false;
        }
    });
});
