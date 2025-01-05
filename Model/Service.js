const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Service = sequelize.define(
  "Service",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    Name: { type: DataTypes.STRING, allowNull: true },
    CodeName : {type: DataTypes.STRING, allowNull: true},
    Zone: { type: DataTypes.STRING },
    Price: { type: DataTypes.FLOAT, allowNull: true },
    State: { type: DataTypes.BOOLEAN, allowNull: true },
    PaymentType: { type: DataTypes.STRING(50) },
    DepartmentId: {type: DataTypes.STRING}
  },
  {
    timestamps: false,
    tableName: "Service",
  }
);

module.exports = Service;
