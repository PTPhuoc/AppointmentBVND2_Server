const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Patien = sequelize.define(
  "Patient",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Name: { type: DataTypes.STRING, allowNull: false },
    Birth: { type: DataTypes.DATE, allowNull: false },
    Age: { type: DataTypes.INTEGER, allowNull: false },
    Gender: { type: DataTypes.STRING(50), allowNull: false },
    Ethnicity: { type: DataTypes.STRING(100) },
    Nation: { type: DataTypes.STRING(100) },
    Location: { type: DataTypes.STRING },
    TypeRelatives: {type: DataTypes.STRING(50)},
    Relatives: { type: DataTypes.STRING },
    RelativesPhone: { type: DataTypes.STRING(50) },
  },
  { tableName: "Patient", timestamps: false }
);

module.exports = Patien
