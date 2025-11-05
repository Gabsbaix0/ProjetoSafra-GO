// Função que faz o chat rolar automaticamente até o final
function scrollToBottom() {
  const chatContainer = document.querySelector('.chat-container'); // Seleciona o contêiner principal do chat
  chatContainer.scrollTop = chatContainer.scrollHeight; // Define a rolagem para o ponto mais baixo (final do chat)
}

// Assim que a página for completamente carregada, rola o chat até o final
window.addEventListener('load', scrollToBottom);

// Adiciona evento de clique no botão de envio da mensagem
document.querySelector('.send-btn').addEventListener('click', function() {
  const input = document.querySelector('.chat-input input'); // Campo de entrada de texto
  const message = input.value.trim(); // Captura o texto digitado, removendo espaços extras

  if (message) { // Se o campo não estiver vazio
    // Cria um novo elemento de mensagem (simulação de envio)
    const chatContainer = document.querySelector('.chat-container'); // Área onde as mensagens aparecem
    const newMessage = document.createElement('div'); // Cria uma nova div
    newMessage.className = 'message sent'; // Adiciona a classe CSS "sent" (mensagem enviada)

    // Monta o HTML interno da nova mensagem
    newMessage.innerHTML = `
      <div class="message-content">
        <p>${message}</p> <!-- Texto da mensagem -->
        <span class="message-time">
          ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span> <!-- Mostra a hora atual (HH:MM) -->
      </div>
    `;

    // Adiciona a nova mensagem ao chat
    chatContainer.appendChild(newMessage);

    // Limpa o campo de entrada após enviar
    input.value = '';

    // Rola automaticamente o chat para o final
    scrollToBottom();
  }
});

// Permite enviar a mensagem ao pressionar a tecla "Enter"
document.querySelector('.chat-input input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    // Simula o clique no botão de envio
    document.querySelector('.send-btn').click();
  }
});
