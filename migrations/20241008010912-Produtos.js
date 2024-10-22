'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produtos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
      },
      estoque: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      valorVenda: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      valorCusto: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Timestamp atual na criação
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // Atualiza na modificação
      },
    }, {
      charset: 'utf8mb4', // Charset para a tabela inteira
      collate: 'utf8mb4_unicode_ci', // Collation para a tabela inteira
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produtos');
  }
};
