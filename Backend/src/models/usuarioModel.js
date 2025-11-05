// src/models/UsuarioModel.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * =====================================================
 *  🔹 CRUD BÁSICO DE USUÁRIOS
 * =====================================================
 */

// Criar novo usuário
async function criar(dadosUsuario) {
  const { nome, email, senha, telefone, tipo_usuario } = dadosUsuario;

  const sql = `
    INSERT INTO Usuario (nome, email, senha, telefone, tipo_usuario, data_cadastro)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  const [resultado] = await db.execute(sql, [
    nome,
    email,
    senha,
    telefone,
    tipo_usuario,
  ]);
  return resultado;
}

// Buscar todos os usuários
async function buscarTodos() {
  const sql = `
    SELECT id_usuario, nome, email, telefone, tipo_usuario, data_cadastro
    FROM Usuario
  `;
  const [usuarios] = await db.query(sql);
  return usuarios;
}

// Buscar um usuário por ID
async function buscarPorId(id) {
  const sql = `
    SELECT id_usuario, nome, email, telefone, tipo_usuario, data_cadastro
    FROM Usuario
    WHERE id_usuario = ?
  `;
  const [usuarios] = await db.query(sql, [id]);
  return usuarios[0];
}

// Atualizar usuário
async function atualizar(id, dadosUsuario) {
  const { nome, email, senha, telefone, tipo_usuario } = dadosUsuario;

  let sql, params;

  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    sql = `
      UPDATE Usuario
      SET nome = ?, email = ?, senha = ?, telefone = ?, tipo_usuario = ?
      WHERE id_usuario = ?
    `;
    params = [nome, email, senhaHash, telefone, tipo_usuario, id];
  } else {
    sql = `
      UPDATE Usuario
      SET nome = ?, email = ?, telefone = ?, tipo_usuario = ?
      WHERE id_usuario = ?
    `;
    params = [nome, email, telefone, tipo_usuario, id];
  }

  const [resultado] = await db.execute(sql, params);
  return resultado;
}

// Deletar usuário
async function deletar(id) {
  const sql = 'DELETE FROM Usuario WHERE id_usuario = ?';
  const [resultado] = await db.execute(sql, [id]);
  return resultado;
}

// Buscar por e-mail (para login)
async function buscarPorEmail(email) {
  const sql = 'SELECT * FROM Usuario WHERE email = ?';
  const [usuarios] = await db.query(sql, [email]);
  return usuarios[0];
}

/**
 * =====================================================
 *  🔹 FUNÇÕES DE RECUPERAÇÃO DE SENHA
 * =====================================================
 */

// 1️⃣ Salvar token e data de expiração
async function salvarTokenReset(idUsuario, token, dataExpiracao) {
  try {
    const sql = `
      UPDATE Usuario
      SET reset_password_token = ?, reset_password_expires = ?
      WHERE id_usuario = ?
    `;
    await db.query(sql, [token, dataExpiracao, idUsuario]);
  } catch (erro) {
    console.error('Erro ao salvar token de reset:', erro);
    throw erro;
  }
}

// 2️⃣ Buscar usuário pelo token de reset
async function buscarPorTokenReset(token) {
  try {
    const sql = 'SELECT * FROM Usuario WHERE reset_password_token = ?';
    const [rows] = await db.query(sql, [token]);
    return rows[0];
  } catch (erro) {
    console.error('Erro ao buscar por token de reset:', erro);
    throw erro;
  }
}

// 3️⃣ Atualizar senha e limpar token
async function atualizarSenha(idUsuario, novaSenhaHash) {
  try {
    const sql = `
      UPDATE Usuario
      SET senha = ?, reset_password_token = NULL, reset_password_expires = NULL
      WHERE id_usuario = ?
    `;
    await db.query(sql, [novaSenhaHash, idUsuario]);
  } catch (erro) {
    console.error('Erro ao atualizar senha:', erro);
    throw erro;
  }
}

module.exports = {
  criar,
  buscarTodos,
  buscarPorId,
  atualizar,
  deletar,
  buscarPorEmail,
  salvarTokenReset,
  buscarPorTokenReset,
  atualizarSenha,
};
