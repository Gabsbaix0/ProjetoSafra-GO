// src/models/ProdutoModel.js
const db = require('../config/db'); 

// 1. CREATE (Inserir Novo Produto)
async function criar(dadosProduto) {
    // Usando os campos da sua tabela 'produto'
    const { nome_produto, preco, descricao, fk_usuario } = dadosProduto;
    
    // fk_usuario é o ID do Produtor que está cadastrando o produto
    const sql = `INSERT INTO produto (nome_produto, preco, descricao, data_publicacao, fk_usuario) 
                 VALUES (?, ?, ?, NOW(), ?)`;
    
    // Executa a consulta
    const [resultado] = await db.execute(sql, [nome_produto, preco, descricao, fk_usuario]);
    return resultado; 
}

// 2. READ ALL (Buscar Todos os Produtos)
async function buscarTodos() {
    // Retornamos também o nome do usuário/produtor que publicou o produto (JOIN com a tabela Usuario)
    const sql = `
        SELECT 
            p.id_produto, p.nome_produto, p.preco, p.descricao, 
            p.data_publicacao, p.fk_usuario, u.nome AS nome_produtor
        FROM produto p
        JOIN usuario u ON p.fk_usuario = u.id_usuario
        ORDER BY p.data_publicacao DESC
    `;
    
    const [produtos] = await db.query(sql);
    return produtos;
}

// 3. READ SINGLE (Buscar Produto por ID)
async function buscarPorId(id) {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?';
    const [produtos] = await db.query(sql, [id]);
    return produtos[0]; 
}

// 4. UPDATE (Atualizar Produto)
async function atualizar(id, dados) {
    const { nome_produto, preco, descricao } = dados;
    const sql = `UPDATE produto SET nome_produto = ?, preco = ?, descricao = ?
                 WHERE id_produto = ?`;

    const [resultado] = await db.execute(sql, [nome_produto, preco, descricao, id]);
    return resultado;
}

// 5. DELETE (Deletar Produto)
async function deletar(id) {
    const sql = 'DELETE FROM produto WHERE id_produto = ?';
    const [resultado] = await db.execute(sql, [id]);
    return resultado;
}

module.exports = {
    criar,
    buscarTodos,
    buscarPorId,
    atualizar,
    deletar,
};
