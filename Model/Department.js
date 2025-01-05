const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Department = sequelize.define(
  "Department",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Name: { type: DataTypes.STRING, allowNull: false },
    Zone: { type: DataTypes.STRING },
    CodeName: { type: DataTypes.STRING },
    Status: { type: DataTypes.STRING(50) },
  },
  {
    timestamps: false,
    tableName: "Department",
  }
);

module.exports = Department;
