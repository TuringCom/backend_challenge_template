module.exports = (sequelize, DataTypes) => {
  const ShippingRegion = sequelize.define(
    'ShippingRegion',
    {
      shipping_region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      shipping_region: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'shipping_region',
    }
  );

  ShippingRegion.associate = models => {
    ShippingRegion.hasMany(models.Shipping, {
      foreignKey: 'shipping_region_id',
    });
    // ShippingRegion.hasMany(models.Customer, {
    //   foreignKey: 'shipping_region_id',
    //   onDelete: 'CASCADE',
    // });
  };

  return ShippingRegion;
};
