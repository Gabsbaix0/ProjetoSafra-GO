// src/models/ProdutorModel.js
const db = require('../config/db'); 

// 1. CREATE (Criar Perfil de Produtor)
async function criar(dadosProdutor) {
    // Campos necessários: fk_usuario, nome_fazenda, endereco, descricao
    const { fk_usuario, nome_fazenda, endereco, descricao } = dadosProdutor;
    
    // O fk_usuario é a chave primária (PK) da tabela produtor no seu schema
    const sql = `INSERT INTO produtor (fk_usuario, nome_fazenda, endereco, descricao) 
                 VALUES (?, ?, ?, ?)`;
    
    // Executa a consulta
    const [resultado] = await db.execute(sql, [fk_usuario, nome_fazenda, endereco, descricao]);
    return resultado; 
}

// 2. READ ALL (Buscar Todos os Produtores)
async function buscarTodos() {
    // Faz um JOIN para buscar dados do perfil do produtor junto com o email do usuário
    const sql = `
        SELECT 
            p.fk_usuario, p.nome_fazenda, p.endereco, p.descricao, 
            u.email AS email_usuario, u.telefone
        FROM produtor p
        JOIN usuario u ON p.fk_usuario = u.id_usuario
    `;
    
    const [produtores] = await db.query(sql);
    return produtores;
}

// 3. READ SINGLE (Buscar Produtor por ID)
// Usamos o fk_usuario, que é a PK da tabela Produtor
async function buscarPorId(id) {
    const sql = 'SELECT * FROM produtor WHERE fk_usuario = ?';
    const [produtores] = await db.query(sql, [id]);
    return produtores[0]; 
}

// 4. UPDATE (Atualizar Perfil do Produtor)
async function atualizar(id, dados) {
    const { nome_fazenda, endereco, descricao } = dados; 
    const sql = `UPDATE produtor SET nome_fazenda = ?, endereco = ?, descricao = ?
                 WHERE fk_usuario = ?`;

    const [resultado] = await db.execute(sql, [nome_fazenda, endereco, descricao, id]);
    return resultado;
}

// 5. DELETE (Deletar Perfil do Produtor)
// Deletar o perfil do produtor não deleta o registro na tabela Usuario
async function deletar(id) {
    const sql = 'DELETE FROM produtor WHERE fk_usuario = ?';
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
