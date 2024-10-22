module.exports = (sequelize, DataTypes) => {
  const Produtos = sequelize.define('Produtos', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estoque: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    valorVenda: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    valorCusto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Produtos',
    timestamps: true,
  });

  Produtos.associate = function(models) {
    Produtos.hasMany(models.Movimentacao, { foreignKey: 'produtoId', as: 'movimentacoes' });
  };

  return Produtos;
};
