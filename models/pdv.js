'use strict';
module.exports = (sequelize, DataTypes) => {
  const PDV = sequelize.define('PDV', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    formaPagamentoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FormaPagamento',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    formaPagamentoDescricao: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
  }, {
    tableName: 'PDV', // Define o nome da tabela
    timestamps: true, // Para incluir createdAt e updatedAt
  });

  // Associações (se necessário)
  PDV.associate = function(models) {
    PDV.belongsTo(models.FormaPagamento, { foreignKey: 'formaPagamentoId' });
    PDV.hasMany(models.ProdutosPdv, { foreignKey: 'pdvId' });
  };

  return PDV;
};
