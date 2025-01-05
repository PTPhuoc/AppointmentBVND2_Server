const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Shift = sequelize.define(
  "Shift",
  {
    Id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    Name: { type: DataTypes.STRING },
    Start: { type: DataTypes.TIME },
    End: { type: DataTypes.TIME },
  },
  { tableName: "Shift", timestamps: false }
);

module.exports = Shift;
