// controllers/produtoController.js

const { Produtos } = require('../models');

exports.createProduto = async (req, res) => {
  try {
    // Validações manuais (opcional)
    if (!req.body.nome || !req.body.valorVenda || !req.body.valorCusto) {
      return res.status(400).json({ error: 'Nome, valor de venda e valor de custo são obrigatórios' });
    }

    const produto = await Produtos.create(req.body);
    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error); // Log do erro no backend
    res.status(400).json({ error: error.message || 'Erro ao criar o produto' });
  }
};


exports.getAllProdutos = async (req, res) => {
  try {
    const produtos = await Produtos.findAll();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProdutoById = async (req, res) => {
  try {
    const produto = await Produtos.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduto = async (req, res) => {
  try {
    // Validações manuais (opcional)
    if (!req.body.nome || !req.body.valorVenda || !req.body.valorCusto) {
      return res.status(400).json({ error: 'Nome, valor de venda e valor de custo são obrigatórios' });
    }

    const [updated] = await Produtos.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const updatedProduto = await Produtos.findByPk(req.params.id);
    res.status(200).json(updatedProduto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error); // Log do erro no backend
    res.status(400).json({ error: error.message || 'Erro ao atualizar o produto' });
  }
};


exports.deleteProduto = async (req, res) => {
  try {
    const deleted = await Produtos.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
