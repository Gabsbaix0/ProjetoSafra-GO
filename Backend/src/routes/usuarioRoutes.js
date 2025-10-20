// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioModel = require('../models/usuarioModel'); // Importa o Model

// Rota GET /api/usuarios: BUSCAR TODOS
router.get('/', async (req, res) => {
    try {
        const usuarios = await usuarioModel.buscarTodos();
        res.json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Falha ao buscar usuários.' });
    }
});

// Rota GET /api/usuarios/:id: BUSCAR POR ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuarioModel.buscarPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Falha ao buscar usuário.' });
    }
});

// Rota POST /api/usuarios: CRIAR NOVO
router.post('/', async (req, res) => {
    try {
        const resultado = await usuarioModel.criar(req.body);
        res.status(201).json({ 
            id: resultado.insertId, 
            mensagem: 'Usuário criado com sucesso!', 
            dadosEnviados: req.body 
        });
    } catch (err) {
        console.error(err);
        // Em caso de erro do MySQL (ex: email duplicado), retorna 400
        res.status(400).json({ erro: 'Dados inválidos ou duplicados.' }); 
    }
});

// Rota PUT /api/usuarios/:id: ATUALIZAR
router.put('/:id', async (req, res) => {
    try {
        const resultado = await usuarioModel.atualizar(req.params.id, req.body);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Usuário não encontrado para atualização.' });
        }
        res.json({ mensagem: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Falha ao atualizar usuário.' });
    }
});

// Rota DELETE /api/usuarios/:id: DELETAR
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await usuarioModel.deletar(req.params.id);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Usuário não encontrado para exclusão.' });
        }
        res.json({ mensagem: 'Usuário deletado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Falha ao deletar usuário.' });
    }
});

module.exports = router;
