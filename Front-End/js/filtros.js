// filtros.js — Catálogo Dinâmico SafraGo 🌾 com redirecionamento

// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {

  // ====== LISTA DE PRODUTOS ======
  // Array com todos os produtos disponíveis no catálogo
  // Cada produto contém: nome, categoria, imagem, estoque, opções de venda, produtor e link de página
  const produtos = [
    {
      nome: "Alface Crespa",
      categoria: "verduras",
      imagem: "../imagens/alface.png",
      estoque: 100,
      opcoes: [
        { tipo: "Caixa 20kg", preco: "R$ 80,00", min: 10 },
        { tipo: "Saca 50kg", preco: "R$ 150,00", min: 5 }
      ],
      produtor: "Fazenda São José - PR",
      link: "hortaliças/alface.html"
    },
    // ... demais produtos omitidos (mesma estrutura)
  ];

  // ====== ELEMENTOS ======
  // Captura os principais elementos do HTML usados na página
  const lista = document.getElementById("productList");        // Contêiner onde os produtos serão exibidos
  const filtroBtns = document.querySelectorAll(".filter-btn"); // Botões de filtro por categoria
  const searchInput = document.getElementById("searchInput");  // Campo de busca (pesquisa por nome)

  // ====== CRIA HTML DO PRODUTO ======
  // Função que gera dinamicamente o HTML de um produto com base nos dados do array
  function criarProduto(produto) {
    // Monta o HTML das opções de embalagem (tipo, preço e quantidade mínima)
    const opcoesHTML = produto.opcoes.map(o => `
      <div class="packaging-option">
        <div class="packaging-info">
          <div class="packaging-type">${o.tipo}</div>
          <div class="packaging-price">${o.preco}</div>
        </div>
        <div class="min-order">Min: ${o.min}</div>
      </div>
    `).join(""); // Junta todas as opções em uma única string

    // Retorna o HTML completo do card do produto
    return `
      <div class="product-card" data-category="${produto.categoria}" data-link="${produto.link}">
        <div class="product-image">
          <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
        </div>
        <div class="product-header">
          <h3>${produto.nome}</h3>
          <div class="stock">Estoque: ${produto.estoque}</div>
        </div>
        <div class="product-details">
          ${opcoesHTML}
          <div class="producer">${produto.produtor}</div>
          <button class="btn-interesse">Tenho Interesse</button>
        </div>
      </div>
    `;
  }

  // ====== RENDERIZA PRODUTOS ======
  // Função que exibe os produtos filtrados ou todos, no container da página
  function renderizarProdutos(listaFiltrada) {
    // Se houver produtos, monta o HTML; senão, mostra uma mensagem de "nenhum encontrado"
    lista.innerHTML =
      listaFiltrada.length > 0
        ? listaFiltrada.map(criarProduto).join("") // Concatena todos os cards de produtos
        : `<div class="empty-state">
             <i class="fas fa-leaf"></i>
             <p>Nenhum produto encontrado.</p>
           </div>`;

    // Adiciona evento de clique para redirecionar o usuário à página do produto
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link"); // Pega o link do produto
        if (link) window.location.href = link;       // Redireciona para a página correspondente
      });
    });
  }

  // ====== FILTROS ======
  // Configura os botões de filtro para exibir apenas produtos de determinada categoria
  filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove o destaque "active" de todos os botões
      filtroBtns.forEach(b => b.classList.remove("active"));

      // Adiciona destaque ao botão clicado
      btn.classList.add("active");

      // Obtém a categoria do botão clicado
      const categoria = btn.dataset.category;

      // Renderiza os produtos filtrados conforme a categoria
      renderizarProdutos(
        categoria === "todos"
          ? produtos // Se for "todos", mostra todos os produtos
          : produtos.filter(p => p.categoria === categoria) // Caso contrário, filtra pela categoria
      );
    });
  });

  // ====== BUSCA ======
  // Permite filtrar produtos conforme o usuário digita no campo de busca
  searchInput.addEventListener("input", e => {
    const termo = e.target.value.toLowerCase(); // Converte o texto digitado para minúsculas
    const resultado = produtos.filter(p =>
      p.nome.toLowerCase().includes(termo) // Procura o termo dentro do nome do produto
    );
    renderizarProdutos(resultado); // Atualiza a exibição com o resultado filtrado
  });

  // ====== INICIAL ======
  // Renderiza todos os produtos quando a página é carregada
  renderizarProdutos(produtos);
});
