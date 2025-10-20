// src/routes/favoritoRoutes.js
const express = require('express');
const router = express.Router();
const FavoritoModel = require('../models/FavoritoModel'); 

// Rota GET /api/favoritos/usuario/:fk_usuario: BUSCAR TODOS OS FAVORITOS DE UM USUÁRIO
router.get('/usuario/:fk_usuario', async (req, res) => {
    try {
        const favoritos = await FavoritoModel.buscarPorUsuario(req.params.fk_usuario);
        res.json(favoritos);
    } catch (err) {
        console.error('Erro ao listar favoritos:', err);
        res.status(500).json({ erro: 'Falha ao buscar lista de favoritos.' });
    }
});

// Rota POST /api/favoritos: ADICIONAR NOVO FAVORITO
router.post('/', async (req, res) => {
    // Espera-se: { "fk_usuario": 1, "fk_produto": 5 }
    try {
        // Opcional: Verificar se já é favorito antes de inserir
        const existe = await FavoritoModel.verificar(req.body.fk_usuario, req.body.fk_produto);
        if (existe) {
            return res.status(409).json({ mensagem: 'Este produto já está na sua lista de favoritos.' });
        }
        
        const resultado = await FavoritoModel.adicionar(req.body);
        res.status(201).json({ 
            id: resultado.insertId, 
            mensagem: 'Produto adicionado aos favoritos com sucesso!',
        });
    } catch (err) {
        console.error('Erro ao adicionar favorito:', err);
        // Erro 400 ou 404 se fk_usuario ou fk_produto não existirem (erro de FK)
        res.status(400).json({ erro: 'Falha ao adicionar favorito. Verifique os IDs de usuário e produto.' });
    }
});

// Rota DELETE /api/favoritos/:id_favorito: REMOVER PELO ID DA TABELA FAVORITO
router.delete('/:id_favorito', async (req, res) => {
    try {
        const resultado = await FavoritoModel.remover(req.params.id_favorito);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Favorito não encontrado para remoção.' });
        }
        res.json({ mensagem: 'Favorito removido com sucesso!' });
    } catch (err) {
        console.error('Erro ao remover favorito:', err);
        res.status(500).json({ erro: 'Falha ao remover favorito.' });
    }
});

// Rota DELETE /api/favoritos: REMOVER PELOS IDs DE USUÁRIO E PRODUTO
// Útil para quando o front-end só tem o ID do produto e do usuário logado
router.delete('/', async (req, res) => {
    // Espera-se que os IDs venham no corpo (body) ou como query params
    const { fk_usuario, fk_produto } = req.body; // ou req.query
    
    if (!fk_usuario || !fk_produto) {
        return res.status(400).json({ erro: 'IDs de usuário e produto são obrigatórios para esta remoção.' });
    }

    try {
        const resultado = await FavoritoModel.removerPorUsuarioEProduto(fk_usuario, fk_produto);
        if (resultado.affectedRows === 0) {
             return res.status(404).json({ mensagem: 'Relacionamento de favorito não encontrado.' });
        }
        res.json({ mensagem: 'Favorito removido por usuário e produto com sucesso!' });
    } catch (err) {
        console.error('Erro ao remover favorito por IDs:', err);
        res.status(500).json({ erro: 'Falha ao remover favorito por IDs.' });
    }
});

module.exports = router;
