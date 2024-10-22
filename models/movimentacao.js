module.exports = (sequelize, DataTypes) => {
  const Movimentacao = sequelize.define('Movimentacao', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Produtos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
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
    tableName: 'Movimentacao',
    timestamps: true,
  });

  // Associações com outros modelos
  Movimentacao.associate = function(models) {
    // Relacionamento belongsTo com Produtos
    Movimentacao.belongsTo(models.Produtos, { foreignKey: 'produtoId', as: 'produto' });
  };

  return Movimentacao;
};
