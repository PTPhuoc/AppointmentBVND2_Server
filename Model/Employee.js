const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Employee = sequelize.define(
  "Employee",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Name: { type: DataTypes.STRING, allowNull: false },
    Birth: { type: DataTypes.DATE, allowNull: false },
    Gender: { type: DataTypes.STRING(50), allowNull: false },
    Nation: { type: DataTypes.STRING(100) },
    Ethnicity: { type: DataTypes.STRING(100) },
    Zone: { type: DataTypes.STRING },
    Phone: { type: DataTypes.STRING(50) },
    Gmail: { type: DataTypes.STRING },
    Location: { type: DataTypes.STRING },
    Type: { type: DataTypes.STRING(50) },
    Technique: {type: DataTypes.STRING}
  },
  {
    timestamps: false,
    tableName: "Employee",
  }
);

module.exports = Employee;
