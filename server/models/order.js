module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    sealImage: {
      type: DataTypes.TEXT
    },
    payCode: {
      type: DataTypes.TEXT
    }
  });
  return Order;
};
