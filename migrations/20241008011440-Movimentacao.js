'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movimentacao', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      produtoId: { // Foreign key para o produto
        type: Sequelize.INTEGER,
        references: {
          model: 'Produtos', // Nome da tabela de produtos
          key: 'id',
        },
        onUpdate: 'CASCADE', // Atualiza em cascata
        onDelete: 'CASCADE', // Deleta em cascata
        allowNull: false,
      },
      quantidade: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.ENUM('entrada', 'saida'), // Tipos possíveis: entrada ou saída
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Define o valor padrão como timestamp atual
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), // Atualiza automaticamente o timestamp
      },
    }, {
      charset: 'utf8mb4', // Charset para a tabela inteira
      collate: 'utf8mb4_unicode_ci', // Collation para a tabela inteira
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movimentacao');
  },
};
