// src/models/MensagemModel.js
const db = require('../config/db'); 

// 1. CREATE (Enviar Nova Mensagem)
async function criar(dadosMensagem) {
    // Campos necessários: conteudo e fk_usuario (o remetente)
    const { conteudo, fk_usuario } = dadosMensagem;
    
    // SQL para inserir a mensagem com o conteúdo e o remetente
    const sql = `INSERT INTO mensagem (conteudo, data_envio, fk_usuario) 
                 VALUES (?, NOW(), ?)`;
    
    const [resultado] = await db.execute(sql, [conteudo, fk_usuario]);
    return resultado; 
}

// 2. READ ALL (Buscar Todas as Mensagens)
// Listar todas as mensagens (como um feed geral ou histórico completo)
async function buscarTodos() {
    // Retorna o conteúdo, data e o nome/email do remetente (JOIN com Usuario)
    const sql = `
        SELECT 
            m.id_mensagem, m.conteudo, m.data_envio, 
            m.fk_usuario, u.nome AS nome_remetente, u.email
        FROM mensagem m
        JOIN usuario u ON m.fk_usuario = u.id_usuario
        ORDER BY m.data_envio DESC
    `;
    
    const [mensagens] = await db.query(sql);
    return mensagens;
}

// 3. READ MESSAGES BY USER ID (Buscar Mensagens Enviadas por um Usuário)
async function buscarPorUsuario(fk_usuario) {
    const sql = `
        SELECT id_mensagem, conteudo, data_envio, fk_usuario
        FROM mensagem 
        WHERE fk_usuario = ?
        ORDER BY data_envio DESC
    `;
    const [mensagens] = await db.query(sql, [fk_usuario]);
    return mensagens; 
}

// 4. DELETE (Deletar Mensagem por ID)
async function deletar(id) {
    const sql = 'DELETE FROM mensagem WHERE id_mensagem = ?';
    const [resultado] = await db.execute(sql, [id]);
    return resultado;
}

module.exports = {
    criar,
    buscarTodos,
    buscarPorUsuario,
    // Não implementamos o 'atualizar' aqui, pois mensagens raramente são editadas.
    deletar,
};
