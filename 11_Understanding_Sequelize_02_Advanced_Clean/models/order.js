const { Sequelize } = require("sequelize");
const sequelize = require("./../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Order;
