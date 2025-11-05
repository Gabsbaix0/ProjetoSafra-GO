// /Front-End/js/produtos.js

// ID fixo de usuário logado (por enquanto está fixo como 1, mas futuramente virá do login real)
const fk_usuario = 1; 

// ========================================================
// 🔹 Função principal: carrega os produtos do usuário logado
// ========================================================
async function carregarProdutos() {
    // Faz uma requisição para o backend buscando os produtos do usuário específico
    const res = await fetch(`/api/produtos/${fk_usuario}`);
    
    // Converte a resposta da API para JSON
    const produtos = await res.json();
    
    // Seleciona o contêiner onde os produtos serão exibidos
    const container = document.getElementById('produtos');
    
    // Limpa o conteúdo atual do contêiner antes de adicionar novos itens
    container.innerHTML = '';
    
    // Percorre a lista de produtos retornados pela API
    produtos.forEach(prod => {
        // Cria uma nova <div> para cada produto
        const div = document.createElement('div');

        // Define o conteúdo HTML da <div> com as informações do produto
        div.innerHTML = `
            <strong>${prod.nome_produto}</strong> - R$ ${prod.preco} <br>
            ${prod.descricao} <br>
            <button data-id="${prod.id_produto}">
                ${prod.favorito ? '❤️ Remover Favorito' : '🤍 Favoritar'}
            </button>
            <hr>
        `;

        // Adiciona a <div> criada ao contêiner principal
        container.appendChild(div);

        // Captura o botão dentro dessa <div>
        const btn = div.querySelector('button');

        // Adiciona um evento de clique no botão, que chama a função toggleFavorito
        // Passa o ID do produto e o próprio botão como parâmetros
        btn.addEventListener('click', () => toggleFavorito(prod.id_produto, btn));
    });
}

// ========================================================
// 🔹 Função que alterna o status de favorito de um produto
// ========================================================
async function toggleFavorito(id_produto, btn) {
    // Verifica se o texto atual do botão contém a palavra "Favoritar"
    if (btn.textContent.includes('Favoritar')) {
        // 🔸 Se contém, significa que o produto ainda não é favorito → adiciona aos favoritos
        const res = await fetch('/api/favoritos', {
            method: 'POST', // Método POST para adicionar
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fk_usuario, fk_produto: id_produto }) // Envia IDs no corpo da requisição
        });

        // Se a operação for bem-sucedida (resposta OK), atualiza o texto do botão
        if (res.ok) btn.textContent = '❤️ Remover Favorito';
    } else {
        // 🔸 Caso contrário, o produto já é favorito → remove dos favoritos
        const res = await fetch('/api/favoritos', {
            method: 'DELETE', // Método DELETE para remover
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fk_usuario, fk_produto: id_produto }) // Envia IDs no corpo da requisição
        });

        // Se a operação for bem-sucedida, muda o texto do botão para "Favoritar"
        if (res.ok) btn.textContent = '🤍 Favoritar';
    }
}

// ========================================================
// 🔹 Ao carregar a página, executa a função carregarProdutos()
// ========================================================
carregarProdutos();
