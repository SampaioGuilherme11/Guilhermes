const { ProdutosPdv } = require('../models');

// Criar nova entrada de produto no PDV
exports.createProdutoPdv = async (req, res) => {
  try {
    const { pdvId, produtoId, quantidade, preco } = req.body;

    // Validações
    if (!pdvId || !produtoId || quantidade === undefined || preco === undefined) {
      return res.status(400).json({ error: 'pdvId, produtoId, quantidade e preco são obrigatórios' });
    }

    const produtoPdv = await ProdutosPdv.create({
      pdvId,
      produtoId,
      quantidade,
      preco,
    });

    res.status(201).json(produtoPdv);
  } catch (error) {
    console.error('Erro ao criar produto no PDV:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os produtos de um PDV específico
exports.getProdutosPdvByPdvId = async (req, res) => {
  try {
    const { pdvId } = req.params;

    const produtos = await ProdutosPdv.findAll({
      where: { pdvId },
      include: [{
        model: 'Produtos', // Certifique-se de que o nome do modelo está correto
        attributes: ['id', 'nome'], // Adicione os atributos que você deseja retornar
      }],
    });

    if (!produtos.length) {
      return res.status(404).json({ error: 'Nenhum produto encontrado para este PDV' });
    }

    res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos do PDV:', error);
    res.status(500).json({ error: error.message });
  }
};
