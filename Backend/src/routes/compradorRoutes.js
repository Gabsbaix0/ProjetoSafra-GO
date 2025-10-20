// src/routes/compradorRoutes.js
const express = require('express');
const router = express.Router();
const CompradorModel = require('../models/CompradorModel'); 

// Rota GET /api/compradores: BUSCAR TODOS
router.get('/', async (req, res) => {
    try {
        const compradores = await CompradorModel.buscarTodos();
        res.json(compradores);
    } catch (err) {
        console.error('Erro ao listar compradores:', err);
        res.status(500).json({ erro: 'Falha ao buscar compradores.' });
    }
});

// Rota GET /api/compradores/:id: BUSCAR POR ID
router.get('/:id', async (req, res) => {
    try {
        const comprador = await CompradorModel.buscarPorId(req.params.id);
        if (!comprador) {
            return res.status(404).json({ mensagem: 'Perfil de comprador não encontrado.' });
        }
        res.json(comprador);
    } catch (err) {
        console.error('Erro ao buscar comprador por ID:', err);
        res.status(500).json({ erro: 'Falha ao buscar comprador.' });
    }
});

// Rota POST /api/compradores: CRIAR NOVO PERFIL
// Requer que o usuário já exista na tabela 'Usuario'.
router.post('/', async (req, res) => {
    // Espera-se que o corpo contenha nome, endereco e o fk_usuario (ID do usuário recém-criado)
    try {
        const resultado = await CompradorModel.criar(req.body);
        res.status(201).json({ 
            id: req.body.fk_usuario, // Retorna o ID do usuário/comprador
            mensagem: 'Perfil de comprador criado com sucesso!',
        });
    } catch (err) {
        console.error('Erro ao criar perfil de comprador:', err);
        // Códigos 400 ou 409 são comuns aqui se o fk_usuario não existir (erro de FK) ou já tiver perfil.
        res.status(400).json({ erro: 'Falha no cadastro. Certifique-se de que o fk_usuario existe.' });
    }
});

// Rota PUT /api/compradores/:id: ATUALIZAR PERFIL
router.put('/:id', async (req, res) => {
    try {
        const resultado = await CompradorModel.atualizar(req.params.id, req.body);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Perfil de comprador não encontrado para atualização.' });
        }
        res.json({ mensagem: 'Perfil de comprador atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar comprador:', err);
        res.status(500).json({ erro: 'Falha ao atualizar comprador.' });
    }
});

// Rota DELETE /api/compradores/:id: DELETAR PERFIL
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await CompradorModel.deletar(req.params.id);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Perfil de comprador não encontrado para exclusão.' });
        }
        res.json({ mensagem: 'Perfil de comprador deletado com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar comprador:', err);
        res.status(500).json({ erro: 'Falha ao deletar comprador.' });
    }
});

module.exports = router;