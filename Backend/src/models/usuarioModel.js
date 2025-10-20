// src/models/UsuarioModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Função CREATE (Criação de Usuário)
async function criar(dadosUsuario) {
    const { nome, email, senha, telefone, tipo_usuario } = dadosUsuario;


    const sql = `INSERT INTO Usuario (nome, email, senha, telefone, tipo_usuario, data_cadastro) 
                 VALUES (?, ?, ?, ?, ?, NOW())`;
    const [resultado] = await db.execute(sql, [nome, email, senha, telefone, tipo_usuario]);
    return resultado;
}

// Função READ ALL (Buscar Todos)
async function buscarTodos() {
    const sql = 'SELECT id_usuario, nome, email, telefone, tipo_usuario, data_cadastro FROM Usuario';
    const [usuarios] = await db.query(sql);
    return usuarios;
}

// Função READ SINGLE (Buscar por ID)
async function buscarPorId(id) {
    const sql = 'SELECT id_usuario, nome, email, telefone, tipo_usuario, data_cadastro FROM Usuario WHERE id_usuario = ?';
    const [usuarios] = await db.query(sql, [id]);
    return usuarios[0];
}

// Função UPDATE (Atualizar)
async function atualizar(id, dadosUsuario) {
    const { nome, email, senha, telefone, tipo_usuario } = dadosUsuario;

    let sql, params;

    if (senha) {
        // Se senha foi enviada → gera hash novo
        const senhaHash = await bcrypt.hash(senha, 10);
        sql = `UPDATE Usuario SET nome = ?, email = ?, senha = ?, telefone = ?, tipo_usuario = ? WHERE id_usuario = ?`;
        params = [nome, email, senhaHash, telefone, tipo_usuario, id];
    } else {
        // Se senha não foi enviada → não mexe nela
        sql = `UPDATE Usuario SET nome = ?, email = ?, telefone = ?, tipo_usuario = ? WHERE id_usuario = ?`;
        params = [nome, email, telefone, tipo_usuario, id];
    }

    const [resultado] = await db.execute(sql, params);
    return resultado;
}

// Função DELETE (Deletar)
async function deletar(id) {
    const sql = 'DELETE FROM Usuario WHERE id_usuario = ?';
    const [resultado] = await db.execute(sql, [id]);
    return resultado;
}

// Função para buscar o usuário por email (para login)
async function buscarPorEmail(email) {
    const sql = 'SELECT * FROM Usuario WHERE email = ?';
    const [usuarios] = await db.query(sql, [email]);
    return usuarios[0]; // retorna objeto com senha hash incluída
}

module.exports = {
    criar,
    buscarTodos,
    buscarPorId,
    atualizar,
    deletar,
    buscarPorEmail, // usar no authRoutes
};
