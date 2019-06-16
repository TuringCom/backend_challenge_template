module.exports = (sequelize, DataTypes) => {
  const AttributeValue = sequelize.define(
    'AttributeValue',
    {
      attribute_value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
      tableName: 'attribute_value',
    }
  );

  AttributeValue.associate = ({ Attribute, Product }) => {
    AttributeValue.belongsTo(Attribute, {
      foreignKey: 'attribute_id',
      as: 'attribute_type',
    });

    AttributeValue.belongsToMany(Product, {
      through: 'ProductAttribute',
      foreignKey: 'attribute_value_id',
    });
  };

  return AttributeValue;
};
