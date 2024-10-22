const { FormaPagamento } = require('../models'); // Importando o modelo FormaPagamento

// Criar nova forma de pagamento
exports.createFormaPagamento = async (req, res) => {
  try {
    // Validações manuais (opcional)
    if (!req.body.descricao) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const formaPagamento = await FormaPagamento.create(req.body);
    res.status(201).json(formaPagamento);
  } catch (error) {
    console.error('Erro ao criar forma de pagamento:', error); // Log do erro no backend
    res.status(400).json({ error: error.message || 'Erro ao criar a forma de pagamento' });
  }
};

// Listar todas as formas de pagamento
exports.getAllFormasPagamento = async (req, res) => {
  try {
    const formasPagamento = await FormaPagamento.findAll();
    res.status(200).json(formasPagamento);
  } catch (error) {
    console.error('Erro ao buscar formas de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obter forma de pagamento específica pelo ID
exports.getFormaPagamentoById = async (req, res) => {
  try {
    const formaPagamento = await FormaPagamento.findByPk(req.params.id);
    if (!formaPagamento) return res.status(404).json({ error: 'Forma de pagamento não encontrada' });
    res.status(200).json(formaPagamento);
  } catch (error) {
    console.error('Erro ao buscar forma de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
};

// Atualizar forma de pagamento
exports.updateFormaPagamento = async (req, res) => {
  try {
    // Validações manuais (opcional)
    if (!req.body.descricao) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const [updated] = await FormaPagamento.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Forma de pagamento não encontrada' });
    }

    const updatedFormaPagamento = await FormaPagamento.findByPk(req.params.id);
    res.status(200).json(updatedFormaPagamento);
  } catch (error) {
    console.error('Erro ao atualizar forma de pagamento:', error); // Log do erro no backend
    res.status(400).json({ error: error.message || 'Erro ao atualizar a forma de pagamento' });
  }
};

// Deletar forma de pagamento
exports.deleteFormaPagamento = async (req, res) => {
  try {
    const deleted = await FormaPagamento.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: 'Forma de pagamento não encontrada' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar forma de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
};
