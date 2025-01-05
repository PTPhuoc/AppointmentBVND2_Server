const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ConsultationHours = sequelize.define(
  "ConsultationHours",
  {
    Id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    Name: { type: DataTypes.STRING },
    Start: { type: DataTypes.TIME },
    End: { type: DataTypes.TIME },
  },
  { tableName: "ConsultationHours", timestamps: false }
);

module.exports = ConsultationHours
