module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define(
    'Shipping',
    {
      shipping_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      shipping_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      shipping_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'shipping',
    }
  );

  Shipping.associate = models => {
    Shipping.belongsTo(models.ShippingRegion, {
      foreignKey: 'shipping_region_id',
      onDelete: 'CASCADE',
    });
  };

  return Shipping;
};
