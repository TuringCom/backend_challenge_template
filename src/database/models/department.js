module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      department_id: {
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
      description: DataTypes.STRING(1000),
    },
    {
      timestamps: false,
      tableName: 'department',
    }
  );

  Department.associate = ({ Category }) => {
    Department.hasMany(Category, {
      foreignKey: 'department_id',
    });
  };

  return Department;
};
