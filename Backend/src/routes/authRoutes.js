// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuarioModel');

// Cadastro
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, telefone, tipo_usuario } = req.body;

        if (!nome || !email || !senha || !telefone || !tipo_usuario) {
            return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
        }

        // Verifica se já existe usuário com esse email
        const existente = await UsuarioModel.buscarPorEmail(email);
        if (existente) {
            return res.status(400).json({ mensagem: 'Email já cadastrado.' });
        }

        // Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Inserir no banco
        const resultado = await UsuarioModel.criar({ 
            nome, 
            email, 
            senha: senhaHash, 
            telefone, 
            tipo_usuario 
        });

        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        res.status(500).json({ mensagem: 'Erro no servidor durante cadastro.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
        }

        // Buscar usuário pelo email
        const usuario = await UsuarioModel.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        // Retornar dados do usuário (sem a senha)
        const { senha: _, ...usuarioSemSenha } = usuario;
        
        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: usuarioSemSenha
        });

    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ mensagem: 'Erro no servidor durante login.' });
    }
});

// Verificar sessão (opcional - se quiser manter usuário logado)
router.post('/verify-session', async (req, res) => {
    try {
        const { usuarioId } = req.body;
        
        if (!usuarioId) {
            return res.status(400).json({ mensagem: 'ID do usuário é obrigatório.' });
        }

        // Buscar dados atualizados do usuário
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

module.exports = router;