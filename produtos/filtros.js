// Adicionar funcionalidade aos filtros
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
        });
        this.classList.add('active');
        
        // Aqui você pode adicionar a lógica de filtragem real
        console.log('Filtro selecionado:', this.textContent);
      });
    });
    
    // Adicionar funcionalidade de busca
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        console.log('Buscar por:', this.value);
        // Aqui você pode adicionar a lógica de busca
      }
    });
    
    // Adicionar funcionalidade aos botões de interesse
    const interestButtons = document.querySelectorAll('.btn-interesse');
    interestButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productName = this.closest('.product-card').querySelector('.product-header h3').textContent;
        alert(`Interesse registrado no produto: ${productName}`);
        // Aqui você pode adicionar a lógica para registrar o interesse
      });
    });
    
    // Simular dados de produtos (em uma aplicação real, viria de uma API)
    const products = [
      {
        name: 'Alface',
        stock: 100,
        options: [
          { type: 'Caixa 20kg', price: 'R$ 80,00', min: 10 },
          { type: 'Saca 50kg', price: 'R$ 150,00', min: 5 }
        ],
        producer: 'Fazenda São José - PR'
      },
      // Outros produtos...
    ];
    
    console.log('Dados dos produtos carregados:', products);
});