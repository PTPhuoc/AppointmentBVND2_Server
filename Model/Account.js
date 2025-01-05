const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Account = sequelize.define(
  "Account",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Name: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    Role: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    timestamps: false,
    tableName: "Account",
  }
);

module.exports = Account;
