module.exports = (sequelize, DataTypes) => {
  const Caixa = sequelize.define('Caixa', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    observacao: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false,
    },
    formaPagamentoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FormaPagamento', // Referência à tabela FormaPagamento
        key: 'id',
      },
      onUpdate: 'CASCADE', // Atualização em cascata
      onDelete: 'SET NULL', // Se excluir forma de pagamento, deixa NULL
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false, // O usuário fornecerá a data
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Atualiza automaticamente
    },
  }, {
    tableName: 'Caixa',
    timestamps: true,
  });

  Caixa.associate = function(models) {
    Caixa.belongsTo(models.FormaPagamento, {
      foreignKey: 'formaPagamentoId',
      as: 'formaPagamento',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  };

  return Caixa;
};
