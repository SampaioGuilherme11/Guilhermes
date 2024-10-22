const { Movimentacao, Produtos, sequelize } = require('../models'); // Pega a instância correta do sequelize

// Cria uma movimentação e atualiza o estoque
exports.createMovimentacao = async (req, res) => {
  const { produtoId, quantidade, tipo } = req.body;
  const quantidadeMovimentada = Number(quantidade); // Converte a quantidade para número

  if (isNaN(quantidadeMovimentada) || quantidadeMovimentada <= 0) {
    return res.status(400).json({ error: 'Quantidade inválida.' });
  }

  const transaction = await sequelize.transaction(); // Inicia uma transação usando a instância correta

  try {
    // Busca o produto relacionado à movimentação
    const produto = await Produtos.findByPk(produtoId);
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Atualiza o estoque do produto baseado na movimentação
    if (tipo === 'entrada') {
      produto.estoque += quantidadeMovimentada; // Incrementa o estoque
    } else if (tipo === 'saida') {
      if (produto.estoque < quantidadeMovimentada) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Estoque insuficiente para saída' });
      }
      produto.estoque -= quantidadeMovimentada; // Decrementa o estoque
    }

    await produto.save({ transaction });

    // Cria a movimentação
    const movimentacao = await Movimentacao.create(
      { produtoId, quantidade: quantidadeMovimentada, tipo },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(movimentacao);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Busca todas as movimentações
exports.getAllMovimentacoes = async (req, res) => {
  try {
    const movimentacoes = await Movimentacao.findAll();
    res.status(200).json(movimentacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Busca uma movimentação por ID
exports.getMovimentacaoById = async (req, res) => {
  try {
    const movimentacao = await Movimentacao.findByPk(req.params.id);
    if (!movimentacao) return res.status(404).json({ error: 'Movimentação não encontrada' });
    res.status(200).json(movimentacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualiza uma movimentação e ajusta o estoque
exports.updateMovimentacao = async (req, res) => {
  const { produtoId, quantidade, tipo } = req.body;
  const quantidadeMovimentada = Number(quantidade);

  if (isNaN(quantidadeMovimentada) || quantidadeMovimentada <= 0) {
    return res.status(400).json({ error: 'Quantidade inválida.' });
  }

  const transaction = await sequelize.transaction();

  try {
    const movimentacao = await Movimentacao.findByPk(req.params.id);
    if (!movimentacao) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    const produto = await Produtos.findByPk(produtoId);
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Reverte o estoque baseado na movimentação anterior
    if (movimentacao.tipo === 'entrada') {
      produto.estoque -= movimentacao.quantidade; // Reverte entrada
    } else if (movimentacao.tipo === 'saida') {
      produto.estoque += movimentacao.quantidade; // Reverte saída
    }

    // Atualiza o estoque com a nova movimentação
    if (tipo === 'entrada') {
      produto.estoque += quantidadeMovimentada; // Nova entrada
    } else if (tipo === 'saida') {
      if (produto.estoque < quantidadeMovimentada) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Estoque insuficiente para saída' });
      }
      produto.estoque -= quantidadeMovimentada; // Nova saída
    }

    await produto.save({ transaction });

    // Atualiza a movimentação
    movimentacao.produtoId = produtoId;
    movimentacao.quantidade = quantidadeMovimentada;
    movimentacao.tipo = tipo;
    await movimentacao.save({ transaction });

    await transaction.commit();
    res.status(200).json(movimentacao);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

// Deleta uma movimentação e ajusta o estoque
exports.deleteMovimentacao = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const movimentacao = await Movimentacao.findByPk(req.params.id);
    if (!movimentacao) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Movimentação não encontrada' });
    }

    const produto = await Produtos.findByPk(movimentacao.produtoId);
    if (!produto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Reverte o estoque baseado na movimentação que está sendo deletada
    if (movimentacao.tipo === 'entrada') {
      produto.estoque -= movimentacao.quantidade; // Reverte entrada
    } else if (movimentacao.tipo === 'saida') {
      produto.estoque += movimentacao.quantidade; // Reverte saída
    }

    await produto.save({ transaction });

    // Deleta a movimentação
    await movimentacao.destroy({ transaction });

    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
