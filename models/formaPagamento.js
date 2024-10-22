module.exports = (sequelize, DataTypes) => {
    const FormaPagamento = sequelize.define('FormaPagamento', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      somaCaixa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Define como verdadeiro por padrão
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
      tableName: 'FormaPagamento',
      timestamps: true,
    });
  
    return FormaPagamento;
  };
  