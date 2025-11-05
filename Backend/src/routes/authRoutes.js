// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UsuarioModel = require('../models/usuarioModel');
const authenticateToken = require('../middleware/authMiddleware');
const transporter = require('../config/emailConfig');

// 🔑 Segredo JWT (ideal colocar em .env)
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto_aqui';

// ====================================================
// 🔹 CADASTRO
// ====================================================
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, telefone, tipo_usuario } = req.body;

    if (!nome || !email || !senha || !telefone || !tipo_usuario) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }

    // Verifica se o email já está cadastrado
    const existente = await UsuarioModel.buscarPorEmail(email);
    if (existente) {
      return res.status(400).json({ mensagem: 'Email já cadastrado.' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar o usuário
    const resultado = await UsuarioModel.criar({
      nome,
      email,
      senha: senhaHash,
      telefone,
      tipo_usuario,
    });

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    res.status(500).json({ mensagem: 'Erro no servidor durante cadastro.' });
  }
});

// ====================================================
// 🔹 LOGIN
// ====================================================
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
    }

    const usuario = await UsuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
    }

    // Criar token JWT
    const payload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });

    // Retornar usuário sem senha
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: usuarioSemSenha,
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ mensagem: 'Erro no servidor durante login.' });
  }
});

// ====================================================
// 🔹 VERIFICAR SESSÃO
// ====================================================
router.post('/verify-session', async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ mensagem: 'ID do usuário é obrigatório.' });
    }

    const usuario = await UsuarioModel.buscarPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json({ usuario: usuarioSemSenha });
  } catch (erro) {
    console.error('Erro na verificação de sessão:', erro);
    res.status(500).json({ mensagem: 'Erro no servidor.' });
  }
});

// ====================================================
// 🔹 RECUPERAÇÃO DE SENHA
// ====================================================

// ROTA 1: Solicitar redefinição
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await UsuarioModel.buscarPorEmail(email);

    // Segurança: resposta genérica
    if (!usuario) {
      return res.json({
        mensagem: 'Se este email estiver cadastrado, um link de redefinição será enviado.',
      });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const dataExpiracao = new Date(Date.now() + 15 * 60 * 1000);

    await UsuarioModel.salvarTokenReset(usuario.id_usuario, token, dataExpiracao);

    const resetLink = `http://127.0.0.1:5500/Front-End/front/redefinir-senha.html?token=${token}`;

    console.log('🔗 Link de redefinição:', resetLink);

    await transporter.sendMail({
      from: '"SafraGo" <nao-responda@safrago.com>',
      to: email,
      subject: 'Redefinição de Senha - SafraGo',
      html: `
        <p>Olá, ${usuario.nome}!</p>
        <p>Você solicitou uma redefinição de senha para sua conta no SafraGo.</p>
        <p>Clique no link abaixo para criar uma nova senha (válido por 15 minutos):</p>
        <p><a href="${resetLink}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Redefinir Minha Senha</a></p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
        <p>Atenciosamente,<br>Equipe SafraGo</p>
      `,
    });

    res.json({
      mensagem: 'Se este email estiver cadastrado, um link de redefinição será enviado.',
    });
  } catch (erro) {
    console.error('Erro no /forgot-password:', erro);
    res.status(500).json({ mensagem: 'Erro no servidor. Tente novamente.' });
  }
});

// ROTA 2: Salvar nova senha
router.post('/reset-password', async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ mensagem: 'Token e nova senha são obrigatórios.' });
    }

    const usuario = await UsuarioModel.buscarPorTokenReset(token);

    if (!usuario) {
      return res.status(400).json({ mensagem: 'Token inválido. Solicite um novo link.' });
    }

    if (usuario.reset_password_expires < new Date()) {
      return res.status(400).json({ mensagem: 'Token expirado. Solicite um novo link.' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await UsuarioModel.atualizarSenha(usuario.id_usuario, senhaHash);

    res.json({ mensagem: 'Senha atualizada com sucesso! Você já pode fazer login.' });
  } catch (erro) {
    console.error('Erro no /reset-password:', erro);
    res.status(500).json({ mensagem: 'Erro no servidor. Tente novamente.' });
  }
});

module.exports = router;
