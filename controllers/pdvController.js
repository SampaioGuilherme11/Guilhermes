const { PDV, ProdutosPdv, Caixa, Movimentacao, FormaPagamento, Produtos } = require('../models');

const pdvController = {
  createPdv: async (req, res) => {
    const { valor, formaPagamentoId, produtos } = req.body;

    try {
      // Buscar a descrição da forma de pagamento
      const formaPagamento = await FormaPagamento.findByPk(formaPagamentoId);
      if (!formaPagamento) {
        return res.status(400).json({ error: 'Forma de pagamento não encontrada' });
      }

      const formaPagamentoDescricao = formaPagamento.descricao;

      // Criar o PDV com a descrição da forma de pagamento
      const pdv = await PDV.create({
        valor,
        formaPagamentoId,
        formaPagamentoDescricao, // Adicionando a descrição aqui
      });

      const produtosPdvPromises = produtos.map(async produto => {
        const produtoDb = await Produtos.findByPk(produto.produtoId);
        if (!produtoDb) {
          throw new Error(`Produto com ID ${produto.produtoId} não encontrado`);
        }

        // Verifica se há estoque suficiente
        if (produtoDb.estoque < produto.quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${produtoDb.nome}`);
        }

        // Criar o registro em ProdutosPdv
        await ProdutosPdv.create({
          pdvId: pdv.id,
          produtoId: produto.produtoId,
          nomeProduto: produtoDb.nome,  // Nome do produto agora é parte do registro
          quantidade: produto.quantidade,
          preco: produtoDb.valorVenda,
        });

        // Atualizar estoque do produto
        await produtoDb.update({ estoque: produtoDb.estoque - produto.quantidade });
      });

      await Promise.all(produtosPdvPromises);

      // Alteração na movimentação
      const movimentacao = await Movimentacao.create({
        produtoId: produtos[0].produtoId,
        quantidade: produtos.reduce((total, p) => total + p.quantidade, 0),
        tipo: 'saida',
      });

      await Caixa.create({
        observacao: `Venda realizada: PDV ID ${pdv.id}`,
        valor,
        tipo: 'entrada',
        formaPagamentoId,
      });

      return res.status(201).json({ message: 'Venda registrada com sucesso!', pdv, movimentacao });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Erro ao criar PDV' });
    }
  },

  getPdvById: async (req, res) => {
    const { id } = req.params;

    try {
      const pdv = await PDV.findOne({
        where: { id },
        include: [
          {
            model: ProdutosPdv,
            include: [{ model: Produtos }],
          },
          { model: FormaPagamento },
        ],
      });

      if (!pdv) {
        return res.status(404).json({ error: 'PDV não encontrado' });
      }

      return res.json(pdv);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar PDV' });
    }
  },

  // Adicione outros métodos conforme necessário
};

module.exports = pdvController;
