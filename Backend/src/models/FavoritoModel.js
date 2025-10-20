// src/models/FavoritoModel.js
const db = require('../config/db'); 

// 1. CREATE (Adicionar Produto aos Favoritos)
async function adicionar(dadosFavorito) {
    // Campos necessários: fk_usuario e fk_produto
    const { fk_usuario, fk_produto } = dadosFavorito;
    
    // SQL para inserir o relacionamento. A data_favorito é adicionada automaticamente.
    const sql = `INSERT INTO favorito (data_favorito, fk_usuario, fk_produto) 
                 VALUES (NOW(), ?, ?)`;
    
    // Usa EXECUTE para prevenir SQL Injection
    const [resultado] = await db.execute(sql, [fk_usuario, fk_produto]);
    return resultado; 
}

// 2. READ ALL (Buscar Todos os Favoritos de um Usuário)
async function buscarPorUsuario(fk_usuario) {
    // Faz um JOIN para buscar os detalhes do Produto que o Usuário favoritou
    const sql = `
        SELECT 
            f.id_favorito, f.data_favorito,
            p.id_produto, p.nome_produto, p.preco, p.descricao
        FROM favorito f
        JOIN produto p ON f.fk_produto = p.id_produto
        WHERE f.fk_usuario = ?
        ORDER BY f.data_favorito DESC
    `;
    
    const [favoritos] = await db.query(sql, [fk_usuario]);
    return favoritos;
}

// 3. READ SINGLE (Verificar se um produto é favorito por um usuário específico)
async function verificar(fk_usuario, fk_produto) {
    const sql = 'SELECT id_favorito FROM favorito WHERE fk_usuario = ? AND fk_produto = ?';
    const [favorito] = await db.query(sql, [fk_usuario, fk_produto]);
    return favorito[0]; 
}

// 4. DELETE (Remover Favorito)
// Pode ser deletado pelo ID do Favorito (id_favorito)
async function remover(id_favorito) {
    const sql = 'DELETE FROM favorito WHERE id_favorito = ?';
    const [resultado] = await db.execute(sql, [id_favorito]);
    return resultado;
}

// 5. DELETE by user and product IDs (Remover favorito usando IDs do usuário e produto)
async function removerPorUsuarioEProduto(fk_usuario, fk_produto) {
    const sql = 'DELETE FROM favorito WHERE fk_usuario = ? AND fk_produto = ?';
    const [resultado] = await db.execute(sql, [fk_usuario, fk_produto]);
    return resultado;
}

module.exports = {
    adicionar,
    buscarPorUsuario,
    verificar,
    remover,
    removerPorUsuarioEProduto,
};
