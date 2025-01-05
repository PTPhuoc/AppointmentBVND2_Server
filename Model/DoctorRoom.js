const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const DoctorRoom = sequelize.define(
  "DoctorRoom",
  {
    Id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    EmployeeId: { type: DataTypes.STRING },
    ShiftId: { type: DataTypes.STRING },
    RoomId: { type: DataTypes.STRING },
    Day: { type: DataTypes.INTEGER },
    Week: { type: DataTypes.INTEGER },
    Date: { type: DataTypes.DATE },
    State: { type: DataTypes.BOOLEAN },
  },
  {
    timestamps: false,
    tableName: "DoctorRoom",
  }
);

module.exports = DoctorRoom;
