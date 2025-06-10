module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });
  return Customer;
};
