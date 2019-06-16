module.exports = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define(
    'ProductAttribute',
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attribute_value_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'product_attribute',
    }
  );

  ProductAttribute.associate = ({ Product, AttributeValue }) => {
    ProductAttribute.belongsTo(Product, {
      foreignKey: 'product_id',
    });
    ProductAttribute.belongsTo(AttributeValue, {
      foreignKey: 'attribute_value_id',
    });
  };

  return ProductAttribute;
};
