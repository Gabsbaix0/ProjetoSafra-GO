// filtros.js — Catálogo Dinâmico SafraGo 🌾 com redirecionamento

document.addEventListener("DOMContentLoaded", () => {
  // ====== LISTA DE PRODUTOS ======
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
    {
      nome: "Arroz Integral",
      categoria: "graos",
      imagem: "../imagens/arroz.jpg",
      estoque: 1000,
      opcoes: [{ tipo: "Saca 50kg", preco: "R$ 180,00", min: 10 }],
      produtor: "Cooperativa Rio Branco - MT",
      link: "../produtos/grãos/arroz.html"
    },
    {
      nome: "Batata Inglesa",
      categoria: "legumes",
      imagem: "../imagens/batatas.png",
      estoque: 450,
      opcoes: [
        { tipo: "Caixa 20kg", preco: "R$ 80,00", min: 10 },
        { tipo: "Saca 50kg", preco: "R$ 150,00", min: 5 }
      ],
      produtor: "Fazenda São José - PR",
      link: "../produtos/hortaliças/batata.html"
    },
    {
      nome: "Banana",
      categoria: "frutas",
      imagem: "../imagens/bananas.png",
      estoque: 300,
      opcoes: [{ tipo: "Caixa 20kg", preco: "R$ 120,00", min: 5 }],
      produtor: "Fazenda São João - BA",
      link: "../produtos/frutas/banana.html"
    },
    {
      nome: "Brócolis Ninja",
      categoria: "verduras",
      imagem: "../imagens/brocolis.png",
      estoque: 450,
      opcoes: [
        { tipo: "Caixa 20kg", preco: "R$ 80,00", min: 10 },
        { tipo: "Saca 50kg", preco: "R$ 150,00", min: 5 }
      ],
      produtor: "Fazenda São José - PR",
      link: "../produtos/hortaliças/brocolis.html"
    },
    {
      nome: "Cenoura",
      categoria: "legumes",
      imagem: "../imagens/cenouras.png",
      estoque: 320,
      opcoes: [{ tipo: "Caixa 20kg", preco: "R$ 75,00", min: 8 }],
      produtor: "Fazenda Hortifruti - SP",
      link: "../produtos/hortaliças/cenouras.html"
    },
    {
      nome: "Cebola Roxa",
      categoria: "legumes",
      imagem: "../imagens/cebolas.png",
      estoque: 280,
      opcoes: [{ tipo: "Saca 30kg", preco: "R$ 120,00", min: 6 }],
      produtor: "Fazenda Vale Verde - MG",
      link: "../produtos/hortaliças/cebolas.html"
    },
    {
      nome: "Feijão",
      categoria: "graos",
      imagem: "../imagens/feijão.png",
      estoque: 700,
      opcoes: [{ tipo: "Saca 60kg", preco: "R$ 250,00", min: 8 }],
      produtor: "Fazenda Boa Esperança - GO",
      link: "../produtos/grãos/feijao.html"
    },
    {
      nome: "Laranja",
      categoria: "frutas",
      imagem: "../imagens/laranjas.png",
      estoque: 500,
      opcoes: [{ tipo: "Caixa 20kg", preco: "R$ 90,00", min: 8 }],
      produtor: "Fazenda Citrus - SP",
      link: "../produtos/frutas/laranja.html"
    },
    {
      nome: "Lentilha",
      categoria: "graos",
      imagem: "../imagens/lentilha.jpg",
      estoque: 300,
      opcoes: [{ tipo: "Saca 25kg", preco: "R$ 200,00", min: 6 }],
      produtor: "AgroVale - RS",
      link: "../produtos/grãos/lentilha.html"
    },
    {
      nome: "Maçã Gala",
      categoria: "frutas",
      imagem: "../imagens/maca.png",
      estoque: 200,
      opcoes: [{ tipo: "Caixa 18kg", preco: "R$ 140,00", min: 5 }],
      produtor: "Cooperativa Vale do Sul - RS",
      link: "../produtos/frutas/maca.html"
    },
    {
      nome: "Manga",
      categoria: "frutas",
      imagem: "../imagens/manga.png",
      estoque: 250,
      opcoes: [{ tipo: "Caixa 22kg", preco: "R$ 110,00", min: 6 }],
      produtor: "Fazenda Frutos Tropicais - PE",
      link: "../produtos/frutas/manga.html"
    },
    {
      nome: "Milho",
      categoria: "graos",
      imagem: "../imagens/milho - Copia.png",
      estoque: 2000,
      opcoes: [{ tipo: "Saca 60kg", preco: "R$ 90,00", min: 20 }],
      produtor: "Fazenda Campo Verde - PR",
      link: "../produtos/grãos/milho.html"
    },
    {
      nome: "Morango",
      categoria: "frutas",
      imagem: "../imagens/morangos.png",
      estoque: 150,
      opcoes: [{ tipo: "Caixa 5kg", preco: "R$ 80,00", min: 10 }],
      produtor: "Sítio Colinas - MG",
      link: "../produtos/frutas/morango.html"
    },
    {
      nome: "Soja",
      categoria: "graos",
      imagem: "../imagens/soja.jpg",
      estoque: 2500,
      opcoes: [{ tipo: "Saca 60kg", preco: "R$ 160,00", min: 15 }],
      produtor: "Cooperativa AgroSul - MS",
      link: "../produtos/grãos/soja.html"
    },
    {
      nome: "Tomate Italiano",
      categoria: "legumes",
      imagem: "../imagens/tomates.png",
      estoque: 180,
      opcoes: [{ tipo: "Caixa 15kg", preco: "R$ 95,00", min: 12 }],
      produtor: "Fazenda Sol Nascente - RJ",
      link: "../produtos/hortaliças/tomate.html"
    },
    {
      nome: "Trigo",
      categoria: "graos",
      imagem: "../imagens/trigo.jpg",
      estoque: 1200,
      opcoes: [{ tipo: "Saca 50kg", preco: "R$ 140,00", min: 12 }],
      produtor: "Cooperativa Vale do Trigo - RS",
      link: "../produtos/grãos/trigo.html"
    },
    {
      nome: "Uva",
      categoria: "frutas",
      imagem: "../imagens/uvas.png",
      estoque: 400,
      opcoes: [{ tipo: "Caixa 10kg", preco: "R$ 70,00", min: 15 }],
      produtor: "Vinícola Vale Verde - RS",
      link: "../produtos/frutas/uva.html"
    }
  ];

  // ====== ELEMENTOS ======
  const lista = document.getElementById("productList");
  const filtroBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");

  // ====== CRIA HTML DO PRODUTO ======
  function criarProduto(produto) {
    const opcoesHTML = produto.opcoes.map(o => `
      <div class="packaging-option">
        <div class="packaging-info">
          <div class="packaging-type">${o.tipo}</div>
          <div class="packaging-price">${o.preco}</div>
        </div>
        <div class="min-order">Min: ${o.min}</div>
      </div>
    `).join("");

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
  function renderizarProdutos(listaFiltrada) {
    lista.innerHTML =
      listaFiltrada.length > 0
        ? listaFiltrada.map(criarProduto).join("")
        : `<div class="empty-state">
             <i class="fas fa-leaf"></i>
             <p>Nenhum produto encontrado.</p>
           </div>`;

    // Adiciona redirecionamento aos cards
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const link = card.getAttribute("data-link");
        if (link) window.location.href = link;
      });
    });
  }

  // ====== FILTROS ======
  filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filtroBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const categoria = btn.dataset.category;
      renderizarProdutos(
        categoria === "todos"
          ? produtos
          : produtos.filter(p => p.categoria === categoria)
      );
    });
  });

  // ====== BUSCA ======
  searchInput.addEventListener("input", e => {
    const termo = e.target.value.toLowerCase();
    const resultado = produtos.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );
    renderizarProdutos(resultado);
  });

  // ====== INICIAL ======
  renderizarProdutos(produtos);
});
