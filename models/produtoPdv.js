'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProdutosPdv = sequelize.define('ProdutosPdv', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pdvId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'PDV',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    produtoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Produtos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    nomeProduto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'ProdutosPdv',
    timestamps: true,
  });

  // Associações (se necessário)
  ProdutosPdv.associate = function(models) {
    ProdutosPdv.belongsTo(models.PDV, { foreignKey: 'pdvId' });
    ProdutosPdv.belongsTo(models.Produtos, { foreignKey: 'produtoId' });
  };

  return ProdutosPdv;
};
