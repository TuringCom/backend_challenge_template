module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      discounted_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      image: DataTypes.STRING(150),
      image_2: DataTypes.STRING(150),
      thumbnail: DataTypes.STRING(150),
      display: {
        type: DataTypes.SMALLINT(6),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: 'product',
    }
  );

  Product.associate = ({ Category, AttributeValue }) => {
    Product.belongsToMany(Category, {
      through: 'ProductCategory',
      foreignKey: 'product_id',
    });

    Product.belongsToMany(AttributeValue, {
      through: 'ProductAttribute',
      as: 'attributes',
      foreignKey: 'product_id',
    });
  };

  return Product;
};
