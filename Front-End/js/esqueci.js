document.addEventListener('DOMContentLoaded', () => {

    const forgotForm = document.getElementById('forgotForm');
    const btnEnviar = document.getElementById('btnEnviar');
    const emailInput = document.getElementById('email');
    const messageEl = document.getElementById('message');

    // O mesmo URL do seu backend
    const API_URL = 'http://localhost:3000'; 

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio tradicional do formulário
        
        const email = emailInput.value;
        if (!email) return;

        // Feedback visual
        btnEnviar.textContent = 'Enviando...';
        btnEnviar.disabled = true;
        messageEl.style.display = 'none';

        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                // Mesmo que dê erro no backend, mostramos a msg de sucesso
                // por segurança (como programamos no backend).
                // Mas, se for um erro 500, o 'data.mensagem' será 'Erro no servidor'
                throw new Error(data.mensagem || 'Erro ao enviar.');
            }

            // Sucesso!
            messageEl.textContent = data.mensagem; // "Se este email estiver cadastrado..."
            messageEl.style.color = 'green';
            messageEl.style.display = 'block';
            emailInput.disabled = true; // Desabilita o campo
            btnEnviar.disabled = true; // Desabilita o botão

        } catch (error) {
            messageEl.textContent = error.message;
            messageEl.style.color = 'red';
            messageEl.style.display = 'block';
            
            // Reabilita em caso de erro para o usuário tentar de novo
            btnEnviar.textContent = 'Enviar Link';
            btnEnviar.disabled = false;
        }
    });
});