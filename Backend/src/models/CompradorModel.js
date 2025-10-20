// src/models/CompradorModel.js
const db = require('../config/db'); 

// 1. CREATE (Criar Perfil de Comprador)
async function criar(dadosComprador) {
    // Campos necessários: nome (do comprador), endereco e fk_usuario
    const { nome, endereco, fk_usuario } = dadosComprador;
    
    // Assumimos que o id_comprador será o mesmo que o fk_usuario
    const sql = `INSERT INTO comprador (id_comprador, nome, endereco, fk_usuario) 
                 VALUES (?, ?, ?, ?)`;
    
    // Executa a consulta, usando fk_usuario duas vezes (para id_comprador e fk_usuario)
    const [resultado] = await db.execute(sql, [fk_usuario, nome, endereco, fk_usuario]);
    return resultado; 
}

// 2. READ ALL (Buscar Todos os Compradores)
async function buscarTodos() {
    // Faz um JOIN para buscar dados do perfil do comprador junto com o email do usuário
    const sql = `
        SELECT 
            c.id_comprador, c.nome, c.endereco, 
            u.email AS email_usuario, u.telefone
        FROM comprador c
        JOIN usuario u ON c.fk_usuario = u.id_usuario
    `;
    
    const [compradores] = await db.query(sql);
    return compradores;
}

// 3. READ SINGLE (Buscar Comprador por ID)
// Usamos o id_comprador, que é o mesmo que o fk_usuario
async function buscarPorId(id) {
    const sql = 'SELECT * FROM comprador WHERE id_comprador = ?';
    const [compradores] = await db.query(sql, [id]);
    return compradores[0]; 
}

// 4. UPDATE (Atualizar Perfil do Comprador)
async function atualizar(id, dados) {
    const { nome, endereco } = dados; // Atualizamos apenas os campos específicos do comprador
    const sql = `UPDATE comprador SET nome = ?, endereco = ?
                 WHERE id_comprador = ?`;

    const [resultado] = await db.execute(sql, [nome, endereco, id]);
    return resultado;
}

// 5. DELETE (Deletar Perfil do Comprador)
// Deletar o perfil do comprador não deleta o registro na tabela Usuario
async function deletar(id) {
    const sql = 'DELETE FROM comprador WHERE id_comprador = ?';
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