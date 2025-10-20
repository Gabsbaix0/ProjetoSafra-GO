// src/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const ProdutoModel = require('../models/ProdutoModel'); // Importa o Model

// Rota GET /api/produtos: BUSCAR TODOS
router.get('/', async (req, res) => {
    try {
        const produtos = await ProdutoModel.buscarTodos();
        res.json(produtos);
    } catch (err) {
        console.error('Erro ao listar produtos:', err);
        res.status(500).json({ erro: 'Falha ao buscar produtos.' });
    }
});

// Rota GET /api/produtos/:id: BUSCAR POR ID
router.get('/:id', async (req, res) => {
    try {
        const produto = await ProdutoModel.buscarPorId(req.params.id);
        if (!produto) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        res.json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto por ID:', err);
        res.status(500).json({ erro: 'Falha ao buscar produto.' });
    }
});

// Rota POST /api/produtos: CRIAR NOVO
router.post('/', async (req, res) => {
    // Assume que o Front-end envia nome_produto, preco, descricao, e fk_usuario
    try {
        const resultado = await ProdutoModel.criar(req.body);
        res.status(201).json({ 
            id: resultado.insertId, 
            mensagem: 'Produto cadastrado com sucesso!',
        });
    } catch (err) {
        console.error('Erro ao criar produto:', err);
        res.status(400).json({ erro: 'Falha no cadastro. Verifique os dados.' });
    }
});

// Rota PUT /api/produtos/:id: ATUALIZAR
router.put('/:id', async (req, res) => {
    try {
        const resultado = await ProdutoModel.atualizar(req.params.id, req.body);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Produto não encontrado para atualização.' });
        }
        res.json({ mensagem: 'Produto atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ erro: 'Falha ao atualizar produto.' });
    }
});

// Rota DELETE /api/produtos/:id: DELETAR
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await ProdutoModel.deletar(req.params.id);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Produto não encontrado para exclusão.' });
        }
        res.json({ mensagem: 'Produto deletado com sucesso!' });
    } catch (err) {
        console.error('Erro ao deletar produto:', err);
        res.status(500).json({ erro: 'Falha ao deletar produto.' });
    }
});

module.exports = router;
