// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuarioModel');

// Importar o JWT
const jwt = require('jsonwebtoken'); 
const authenticateToken = require('../middleware/authMiddleware');
const JWT_SECRET = 'segredo_super_secreto_aqui';

const crypto = require('crypto'); // Módulo nativo do Node para gerar o token
const transporter = require('../config/emailConfig'); // Nosso "carteiro"

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

        // dados do token
        const payload = {
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            tipo_usuario: usuario.tipo_usuario
        };

        // Assinar o Token (criar o "passe")
        const token = jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '3h' } // Token expira em 3 horas
        );

        // Retornar dados do usuário (sem a senha)
        const { senha: _, ...usuarioSemSenha } = usuario;
        
        
        res.json({
            mensagem: 'Login realizado com sucesso!',
            token: token, 
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

//rotas para recuperação de senha 
// ROTA 1: PEDIDO DE REDEFINIÇÃO (O usuário esqueceu a senha)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await UsuarioModel.buscarPorEmail(email);

        // ATENÇÃO: Por segurança, NUNCA diga se o email foi encontrado.
        // Sempre retorne a mesma mensagem de sucesso.
        if (!usuario) {
            return res.json({ mensagem: 'Se este email estiver cadastrado, um link de redefinição será enviado.' });
        }

        // 1. Gerar um token aleatório
        const token = crypto.randomBytes(20).toString('hex');

        // 2. Definir o tempo de expiração (15 minutos a partir de agora)
        const dataExpiracao = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        // 3. Salvar o token e a expiração no banco de dados
        //    (Esta é a Função 1 que você adicionou no Model)
        await UsuarioModel.salvarTokenReset(usuario.id_usuario, token, dataExpiracao);

        // 4. Montar o link de redefinição
        //    (MUDE '127.0.0.1:5500' se o seu frontend rodar em outro lugar)
        const resetLink = `http://127.0.0.1:5500/redefinir-senha.html?token=${token}`;

        // 5. Configurar e enviar o email
        await transporter.sendMail({
            from: '"SafraGo" <nao-responda@safrago.com>', // O remetente
            to: email, // O destinatário (o email do usuário)
            subject: 'Redefinição de Senha - SafraGo', // Assunto
            html: `
                <p>Olá, ${usuario.nome}!</p>
                <p>Você solicitou uma redefinição de senha para sua conta no SafraGo.</p>
                <p>Por favor, clique no link abaixo para criar uma nova senha. Este link é válido por 15 minutos:</p>
                <p>
                    <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Redefinir Minha Senha
                    </a>
                </p>
                <p>Se você não solicitou isso, por favor, ignore este email.</p>
                <p>Atenciosamente,<br>Equipe SafraGo</p>
            `
        });

        res.json({ mensagem: 'Se este email estiver cadastrado, um link de redefinição será enviado.' });

    } catch (erro) {
        console.error('Erro no /forgot-password:', erro);
        // Não envie o erro detalhado ao usuário, apenas uma mensagem genérica.
        res.status(500).json({ mensagem: 'Ocorreu um erro no servidor. Tente novamente.' });
    }
});

module.exports = router;