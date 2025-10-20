// filtros.js - Funcionalidades para o catálogo de produtos - Nova Paleta
class CatalogoManager {
    constructor() {
        this.products = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.cacheProducts();
        this.updateProductCount();
    }

    cacheElements() {
        this.elements = {
            filterBtns: document.querySelectorAll('.filter-btn'),
            searchInput: document.getElementById('searchInput'),
            productList: document.getElementById('productList'),
            productCards: document.querySelectorAll('.product-card'),
            emptyState: document.getElementById('emptyState'),
            sortSelect: document.getElementById('sortSelect')
        };
    }

    cacheProducts() {
        this.products = Array.from(this.elements.productCards).map(card => ({
            element: card,
            name: card.querySelector('h3').textContent.toLowerCase(),
            category: card.dataset.category,
            producer: card.querySelector('.producer').textContent.toLowerCase(),
            price: this.extractPrice(card)
        }));
    }

    extractPrice(card) {
        const priceText = card.querySelector('.packaging-price')?.textContent || '';
        const priceMatch = priceText.match(/R\$\s*([\d.,]+)/);
        return priceMatch ? parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) : 0;
    }

    bindEvents() {
        // Filtros
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Busca com debounce
        this.elements.searchInput.addEventListener('input', 
            debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.applyFilters();
            }, 300)
        );

        // Ordenação
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.sortProducts(e.target.value);
                }
            });
        }

        // Botões de interesse
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-interesse')) {
                this.handleInteresseClick(e);
            }
        });

        // Load mais produtos (simulação)
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleFilterClick(e) {
        const btn = e.currentTarget;
        const filter = btn.dataset.filter;

        // Atualizar botões ativos
        this.elements.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = filter;
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;

        this.products.forEach(product => {
            const matchesFilter = this.currentFilter === 'all' || 
                                product.category === this.currentFilter ||
                                (this.currentFilter === 'ofertas' && this.isOferta(product));

            const matchesSearch = !this.searchTerm || 
                                product.name.includes(this.searchTerm) ||
                                product.producer.includes(this.searchTerm);

            const shouldShow = matchesFilter && matchesSearch;

            product.element.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                visibleCount++;
                this.animateProduct(product.element);
            }
        });

        this.toggleEmptyState(visibleCount === 0);
        this.updateProductCount(visibleCount);
    }

    isOferta(product) {
        // Produtos com preço abaixo de 100 são considerados ofertas
        return product.price > 0 && product.price < 100;
    }

    animateProduct(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'fadeIn 0.6s ease forwards';
        }, 10);
    }

    toggleEmptyState(show) {
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = show ? 'block' : 'none';
            this.elements.productList.style.display = show ? 'none' : 'grid';
        }
    }

    updateProductCount(count) {
        const total = count || this.products.length;
        const banner = document.querySelector('.banner-text');
        if (banner) {
            banner.textContent = `Catálogo Completo (${total} produtos)`;
        }
    }

    sortProducts(criteria) {
        const sortedProducts = [...this.products].sort((a, b) => {
            switch (criteria) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        // Reordenar no DOM
        const container = this.elements.productList;
        sortedProducts.forEach(product => {
            container.appendChild(product.element);
        });

        // Reaplicar animação
        sortedProducts.forEach((product, index) => {
            setTimeout(() => {
                this.animateProduct(product.element);
            }, index * 50);
        });
    }

    handleInteresseClick(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        
        this.showInteresseModal(productName);
    }

    showInteresseModal(productName) {
        // Criar modal de confirmação
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

        document.body.appendChild(modal);

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Adicionar estilo de animação se não existir
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

    handleScroll() {
        // Simulação de carregamento de mais produtos
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        
        if (scrollPosition >= pageHeight - 500 && !this.loadingMore) {
            this.loadMoreProducts();
        }
    }

    loadMoreProducts() {
        // Simulação - na implementação real, aqui você faria uma requisição AJAX
        this.loadingMore = true;
        
        // Mostrar loading
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading';
        loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mais produtos...';
        this.elements.productList.appendChild(loadingElement);
        
        setTimeout(() => {
            loadingElement.remove();
            console.log('Carregando mais produtos...');
            this.loadingMore = false;
        }, 1000);
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    const catalogoManager = new CatalogoManager();
    
    // Expor para uso global se necessário
    window.catalogoManager = catalogoManager;
});

// Funções utilitárias globais
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

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

// Adicionar ícone de loading se não existir
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