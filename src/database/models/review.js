module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define (
    'Review',
    {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      rating: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      created_on: DataTypes.DATE,
    },
    {
      timestamps: false,
      tableName: 'review',
    }
  );
  Review.associate = ({ Product, Customer }) => {
    Review.belongsTo(Product, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'product',
    });
    Review.belongsTo(Customer, {
      foreignKey: 'customer_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      as: 'customer',
    });
  };
  return Review;
};