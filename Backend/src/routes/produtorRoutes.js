// src/routes/produtorRoutes.js
const express = require('express');
const router = express.Router();
const ProdutorModel = require('../models/ProdutorModel'); 

// Rota GET /api/produtores: BUSCAR TODOS
router.get('/', async (req, res) => {
    try {
        const produtores = await ProdutorModel.buscarTodos();
        res.json(produtores);
    } catch (err) {
        console.error('Erro ao listar produtores:', err);
        res.status(500).json({ erro: 'Falha ao buscar produtores.' });
    }
});

// Rota GET /api/produtores/:id: BUSCAR POR ID
router.get('/:id', async (req, res) => {
    try {
        const produtor = await ProdutorModel.buscarPorId(req.params.id);
        if (!produtor) {
            return res.status(404).json({ mensagem: 'Perfil de produtor não encontrado.' });
        }
        res.json(produtor);
    } catch (err) {
        console.error('Erro ao buscar produtor por ID:', err);
        res.status(500).json({ erro: 'Falha ao buscar produtor.' });
    }
});

// Rota POST /api/produtores: CRIAR NOVO PERFIL
// Requer que o usuário já exista na tabela 'Usuario'.
router.post('/', async (req, res) => {
    // Espera-se que o corpo contenha fk_usuario, nome_fazenda, endereco e descricao
    try {
        const resultado = await ProdutorModel.criar(req.body);
        res.status(201).json({ 
            id: req.body.fk_usuario, // Retorna o ID do usuário/produtor
            mensagem: 'Perfil de produtor criado com sucesso!',
        });
    } catch (err) {
        console.error('Erro ao criar perfil de produtor:', err);
        // Códigos 400 ou 409 são comuns aqui se o fk_usuario não existir (erro de FK) ou já tiver perfil.
        res.status(400).json({ erro: 'Falha no cadastro. Certifique-se de que o fk_usuario existe.' });
    }
});

// Rota PUT /api/produtores/:id: ATUALIZAR PERFIL
router.put('/:id', async (req, res) => {
    try {
        const resultado = await ProdutorModel.atualizar(req.params.id, req.body);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Perfil de produtor não encontrado para atualização.' });
        }
        res.json({ mensagem: 'Perfil de produtor atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar produtor:', err);
        res.status(500).json({ erro: 'Falha ao atualizar produtor.' });
    }
});

// Rota DELETE /api/produtores/:id: DELETAR PERFIL
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await ProdutorModel.deletar(req.params.id);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Perfil de produtor não encontrado para exclusão.' });
        }
        res.json({ mensagem: 'Perfil de produtor deletado com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar produtor:', err);
        res.status(500).json({ erro: 'Falha ao deletar produtor.' });
    }
});

module.exports = router;
