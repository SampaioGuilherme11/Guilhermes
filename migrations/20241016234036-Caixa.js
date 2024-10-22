'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Caixa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      observacao: {
        type: Sequelize.STRING(255), // Definindo um tamanho máximo
        allowNull: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
      valor: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('entrada', 'saida'),
        allowNull: false,
      },
      formaPagamentoId: { // Chave estrangeira
        type: Sequelize.INTEGER,
        references: {
          model: 'FormaPagamento', // Nome da tabela que será referenciada
          key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza em cascata
        onDelete: 'SET NULL', // Define como NULL se o pagamento for excluído
        allowNull: true, // Permite valores nulos se não houver pagamento associado
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE, // Permite que o usuário forneça a data
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // Atualiza na modificação
      },
    }, {
      charset: 'utf8mb4', // Charset para a tabela inteira
      collate: 'utf8mb4_unicode_ci', // Collation para a tabela inteira
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Caixa');
  }
};
