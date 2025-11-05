// filtros.js - Funcionalidades para o catálogo de produtos - Nova Paleta

// Classe responsável por gerenciar o catálogo de produtos
class CatalogoManager {
    constructor() {
        // Lista de produtos (armazenados como objetos)
        this.products = [];
        // Filtro atual (por padrão mostra todos)
        this.currentFilter = 'all';
        // Termo de busca digitado pelo usuário
        this.searchTerm = '';
        // Inicializa o sistema assim que o objeto é criado
        this.init();
    }

    // Método principal de inicialização
    init() {
        this.cacheElements();         // Armazena referências aos elementos do DOM
        this.bindEvents();            // Associa eventos (cliques, scroll, busca)
        this.cacheProducts();         // Lê e salva dados dos produtos exibidos na página
        this.updateProductCount();    // Atualiza o contador de produtos visíveis
    }

    // Captura e armazena os elementos do DOM utilizados no catálogo
    cacheElements() {
        this.elements = {
            filterBtns: document.querySelectorAll('.filter-btn'),   // Botões de filtro de categoria
            searchInput: document.getElementById('searchInput'),    // Campo de busca
            productList: document.getElementById('productList'),    // Container dos produtos
            productCards: document.querySelectorAll('.product-card'),// Todos os cards de produto
            emptyState: document.getElementById('emptyState'),      // Mensagem de "nenhum produto encontrado"
            sortSelect: document.getElementById('sortSelect')       // Campo de ordenação (preço/nome)
        };
    }

    // Armazena dados estruturados dos produtos existentes no DOM
    cacheProducts() {
        this.products = Array.from(this.elements.productCards).map(card => ({
            element: card,
            name: card.querySelector('h3').textContent.toLowerCase(), // Nome do produto
            category: card.dataset.category,                           // Categoria (ex: frutas, legumes)
            producer: card.querySelector('.producer').textContent.toLowerCase(), // Nome do produtor
            price: this.extractPrice(card)                             // Preço convertido para número
        }));
    }

    // Extrai e converte o preço de um card em número (float)
    extractPrice(card) {
        const priceText = card.querySelector('.packaging-price')?.textContent || '';
        const priceMatch = priceText.match(/R\$\s*([\d.,]+)/);
        return priceMatch ? parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) : 0;
    }

    // Vincula todos os eventos de interação (cliques, busca, scroll etc.)
    bindEvents() {
        // Filtros de categoria
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Busca com debounce (aguarda 300ms antes de filtrar enquanto o usuário digita)
        this.elements.searchInput.addEventListener('input', 
            debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.applyFilters();
            }, 300)
        );

        // Ordenação por preço ou nome
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.sortProducts(e.target.value);
                }
            });
        }

        // Clique nos botões "Tenho Interesse"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-interesse')) {
                this.handleInteresseClick(e);
            }
        });

        // Rolagem da página → simula carregamento de mais produtos
        window.addEventListener('scroll', () => this.handleScroll());
    }

    // Trata o clique em um botão de filtro de categoria
    handleFilterClick(e) {
        const btn = e.currentTarget;
        const filter = btn.dataset.filter;

        // Atualiza o estado visual dos botões
        this.elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Define o filtro atual e aplica os filtros na lista de produtos
        this.currentFilter = filter;
        this.applyFilters();
    }

    // Aplica filtros de categoria + busca nos produtos
    applyFilters() {
        let visibleCount = 0;

        this.products.forEach(product => {
            // Verifica se o produto corresponde ao filtro selecionado
            const matchesFilter = this.currentFilter === 'all' || 
                                product.category === this.currentFilter ||
                                (this.currentFilter === 'ofertas' && this.isOferta(product));

            // Verifica se o termo de busca está presente no nome ou produtor
            const matchesSearch = !this.searchTerm || 
                                product.name.includes(this.searchTerm) ||
                                product.producer.includes(this.searchTerm);

            // Define se o produto deve ser exibido
            const shouldShow = matchesFilter && matchesSearch;

            // Mostra ou esconde o produto no DOM
            product.element.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                visibleCount++;
                this.animateProduct(product.element); // Adiciona animação suave
            }
        });

        // Mostra mensagem se nenhum produto foi encontrado
        this.toggleEmptyState(visibleCount === 0);

        // Atualiza o contador de produtos visíveis
        this.updateProductCount(visibleCount);
    }

    // Determina se o produto é uma oferta (preço abaixo de R$100)
    isOferta(product) {
        return product.price > 0 && product.price < 100;
    }

    // Aplica uma animação de entrada nos produtos filtrados
    animateProduct(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'fadeIn 0.6s ease forwards';
        }, 10);
    }

    // Mostra ou oculta o estado vazio ("nenhum produto encontrado")
    toggleEmptyState(show) {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = show ? 'block' : 'none';
            this.elements.productList.style.display = show ? 'none' : 'grid';
        }
    }

    // Atualiza o contador de produtos no banner principal
    updateProductCount(count) {
        const total = count || this.products.length;
        const banner = document.querySelector('.banner-text');
        if (banner) {
            banner.textContent = `Catálogo Completo (${total} produtos)`;
        }
    }

    // Ordena os produtos conforme o critério selecionado
    sortProducts(criteria) {
        const sortedProducts = [...this.products].sort((a, b) => {
            switch (criteria) {
                case 'price-asc':  // Menor preço primeiro
                    return a.price - b.price;
                case 'price-desc': // Maior preço primeiro
                    return b.price - a.price;
                case 'name':       // Ordem alfabética
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        // Reorganiza os produtos no DOM conforme a nova ordem
        const container = this.elements.productList;
        sortedProducts.forEach(product => {
            container.appendChild(product.element);
        });

        // Reaplica animação de entrada em sequência
        sortedProducts.forEach((product, index) => {
            setTimeout(() => {
                this.animateProduct(product.element);
            }, index * 50);
        });
    }

    // Trata o clique em "Tenho Interesse"
    handleInteresseClick(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        // Exibe um modal de confirmação elegante
        this.showInteresseModal(productName);
    }

    // Cria e exibe o modal de confirmação de interesse
    showInteresseModal(productName) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(64, 29, 4, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;

        // HTML interno do modal (mensagem e botão "Entendi")
        modal.innerHTML = `
            <div style="
                background: #F5FCF8;
                padding: 30px;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(64, 29, 4, 0.3);
                animation: slideUp 0.3s ease;
                border: 2px solid #2E7D32;
            ">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #2E7D32; margin-bottom: 15px;"></i>
                <h3 style="margin: 0 0 10px 0; color: #401D04;">Interesse Registrado!</h3>
                <p style="color: #666; margin-bottom: 20px;">Seu interesse em <strong>${productName}</strong> foi registrado com sucesso. Entraremos em contato em breve.</p>
                <button onclick="this.closest('[style]').remove()" style="
                    background: linear-gradient(135deg, #401D04, #2E7D32);
                    color: #F5FCF8;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(64, 29, 4, 0.3)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    Entendi
                </button>
            </div>
        `;

        // Adiciona o modal ao documento
        document.body.appendChild(modal);

        // Permite fechar o modal clicando fora da caixa
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Cria o estilo da animação se ainda não existir
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Detecta scroll próximo ao fim da página e simula carregamento de novos produtos
    handleScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= pageHeight - 500 && !this.loadingMore) {
            this.loadMoreProducts();
        }
    }

    // Simula o carregamento de mais produtos (exemplo visual)
    loadMoreProducts() {
        this.loadingMore = true;
        
        // Mostra um elemento de "carregando"
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mais produtos...';
        this.elements.productList.appendChild(loadingElement);
        
        // Após 1 segundo, remove o loading (simulação)
        setTimeout(() => {
            loadingElement.remove();
            console.log('Carregando mais produtos...');
            this.loadingMore = false;
        }, 1000);
    }
}

// Inicializa o catálogo assim que o DOM for carregado
document.addEventListener('DOMContentLoaded', function() {
    const catalogoManager = new CatalogoManager();
    // Torna o gerenciador acessível globalmente (para depuração, se necessário)
    window.catalogoManager = catalogoManager;
});

// ======================
// Funções utilitárias globais
// ======================

// Formata um número como moeda em Real (R$)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função debounce — evita execuções repetidas em eventos contínuos (como digitar ou rolar)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Adiciona estilo CSS para o ícone de loading, se ainda não existir
if (!document.querySelector('#loading-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
