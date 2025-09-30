    // Função para rolar para o final do chat
    function scrollToBottom() {
      const chatContainer = document.querySelector('.chat-container');
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Rolar para o final quando a página carregar
    window.addEventListener('load', scrollToBottom);
    
    // Enviar mensagem ao clicar no botão
    document.querySelector('.send-btn').addEventListener('click', function() {
      const input = document.querySelector('.chat-input input');
      const message = input.value.trim();
      
      if (message) {
        // Criar nova mensagem (apenas para demonstração)
        const chatContainer = document.querySelector('.chat-container');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        newMessage.innerHTML = `
          <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        `;
        
        chatContainer.appendChild(newMessage);
        input.value = '';
        scrollToBottom();
      }
    });
    
    // Enviar mensagem ao pressionar Enter
    document.querySelector('.chat-input input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.querySelector('.send-btn').click();
      }
    });
