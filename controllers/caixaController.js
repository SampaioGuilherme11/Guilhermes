const { Caixa, FormaPagamento  } = require('../models');

// Criar nova entrada no caixa
exports.createCaixa = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);

    // Validações
    if (!req.body.observacao || !req.body.valor || !req.body.tipo) {
      return res.status(400).json({ error: 'Observação, valor e tipo são obrigatórios' });
    }

    const caixaData = {
      observacao: req.body.observacao,
      valor: parseFloat(req.body.valor),
      tipo: req.body.tipo,
      formaPagamentoId: req.body.formaPagamentoId || null, // Verifica se forma de pagamento foi enviada
      createdAt: req.body.data,
      somaCaixa: req.body.somaCaixa !== undefined ? req.body.somaCaixa : true,
    };

    const caixa = await Caixa.create(caixaData);
    res.status(201).json(caixa);
  } catch (error) {
    console.error('Erro ao criar entrada no caixa:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar a entrada no caixa' });
  }
};

// Listar todas as entradas no caixa
exports.getAllCaixas = async (req, res) => {
  try {
    const caixas = await Caixa.findAll({
      include: [{
        model: FormaPagamento,
        as: 'formaPagamento', // Certifique-se de que o alias aqui está correto
        attributes: ['descricao'], // Pega apenas a descrição
      }],
    });
    res.status(200).json(caixas);
  } catch (error) {
    console.error('Erro ao buscar entradas no caixa:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter entrada específica do caixa pelo ID
exports.getCaixaById = async (req, res) => {
  try {
    const caixa = await Caixa.findByPk(req.params.id);
    if (!caixa) return res.status(404).json({ error: 'Entrada no caixa não encontrada' });
    res.status(200).json(caixa);
  } catch (error) {
    console.error('Erro ao buscar entrada no caixa:', error);
    res.status(500).json({ error: error.message });
  }
};

// Atualizar entrada no caixa
exports.updateCaixa = async (req, res) => {
  try {
    if (!req.body.observacao || !req.body.valor || !req.body.tipo) {
      return res.status(400).json({ error: 'Observação, valor e tipo são obrigatórios' });
    }

    const [updated] = await Caixa.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Entrada no caixa não encontrada' });
    }

    const updatedCaixa = await Caixa.findByPk(req.params.id);
    res.status(200).json(updatedCaixa);
  } catch (error) {
    console.error('Erro ao atualizar entrada no caixa:', error);
    res.status(400).json({ error: error.message || 'Erro ao atualizar a entrada no caixa' });
  }
};

// Deletar entrada no caixa
exports.deleteCaixa = async (req, res) => {
  try {
    const deleted = await Caixa.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: 'Entrada no caixa não encontrada' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar entrada no caixa:', error);
    res.status(500).json({ error: error.message });
  }
};
