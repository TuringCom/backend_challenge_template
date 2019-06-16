module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'product_category',
    }
  );

  ProductCategory.associate = ({ Product, Category }) => {
    ProductCategory.belongsTo(Product, {
      as: 'product',
      foreignKey: 'product_id',
    });
    ProductCategory.belongsTo(Category, {
      foreignKey: 'category_id',
    });
  };

  return ProductCategory;
};
