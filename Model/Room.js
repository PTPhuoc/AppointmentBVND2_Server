const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Room = sequelize.define(
  "Room",
  {
    Id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    Name: { type: DataTypes.STRING },
    CodeName: { type: DataTypes.STRING },
    State: { type: DataTypes.BOOLEAN },
    DepartmentId: { type: DataTypes.STRING },
  },
  { tableName: "Room", timestamps: false }
);

module.exports = Room;
