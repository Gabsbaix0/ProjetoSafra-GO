// src/routes/mensagemRoutes.js
const express = require('express');
const router = express.Router();
const MensagemModel = require('../models/MensagemModel'); 

// Rota GET /api/mensagens: BUSCAR TODAS AS MENSAGENS (Feed/Histórico Global)
router.get('/', async (req, res) => {
    try {
        const mensagens = await MensagemModel.buscarTodos();
        res.json(mensagens);
    } catch (err) {
        console.error('Erro ao listar todas as mensagens:', err);
        res.status(500).json({ erro: 'Falha ao buscar mensagens.' });
    }
});

// Rota GET /api/mensagens/usuario/:fk_usuario: BUSCAR MENSAGENS ENVIADAS POR UM USUÁRIO
router.get('/usuario/:fk_usuario', async (req, res) => {
    try {
        const mensagens = await MensagemModel.buscarPorUsuario(req.params.fk_usuario);
        res.json(mensagens);
    } catch (err) {
        console.error('Erro ao buscar mensagens do usuário:', err);
        res.status(500).json({ erro: 'Falha ao buscar mensagens do usuário.' });
    }
});


// Rota POST /api/mensagens: ENVIAR NOVA MENSAGEM
router.post('/', async (req, res) => {
    // Espera-se que o corpo contenha conteudo e fk_usuario
    try {
        const resultado = await MensagemModel.criar(req.body);
        res.status(201).json({ 
            id: resultado.insertId, 
            mensagem: 'Mensagem enviada com sucesso!',
        });
    } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        res.status(400).json({ erro: 'Falha ao enviar mensagem. Certifique-se de que o fk_usuario existe.' });
    }
});

// Rota DELETE /api/mensagens/:id: DELETAR MENSAGEM
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await MensagemModel.deletar(req.params.id);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
        }
        res.json({ mensagem: 'Mensagem deletada com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar mensagem:', err);
        res.status(500).json({ erro: 'Falha ao deletar mensagem.' });
    }
});

module.exports = router;