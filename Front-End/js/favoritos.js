// /Front-End/js/produtos.js

const fk_usuario = 1; // usuário logado (pode vir do login)

async function carregarProdutos() {
    const res = await fetch(`/api/produtos/${fk_usuario}`);
    const produtos = await res.json();
    
    const container = document.getElementById('produtos');
    container.innerHTML = '';
    
    produtos.forEach(prod => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${prod.nome_produto}</strong> - R$ ${prod.preco} <br>
            ${prod.descricao} <br>
            <button data-id="${prod.id_produto}">
                ${prod.favorito ? '❤️ Remover Favorito' : '🤍 Favoritar'}
            </button>
            <hr>
        `;
        container.appendChild(div);

        const btn = div.querySelector('button');
        btn.addEventListener('click', () => toggleFavorito(prod.id_produto, btn));
    });
}

async function toggleFavorito(id_produto, btn) {
    if (btn.textContent.includes('Favoritar')) {
        // Adicionar
        const res = await fetch('/api/favoritos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fk_usuario, fk_produto: id_produto })
        });
        if (res.ok) btn.textContent = '❤️ Remover Favorito';
    } else {
        // Remover
        const res = await fetch('/api/favoritos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fk_usuario, fk_produto: id_produto })
        });
        if (res.ok) btn.textContent = '🤍 Favoritar';
    }
}

// Carrega produtos ao abrir a página
carregarProdutos();
