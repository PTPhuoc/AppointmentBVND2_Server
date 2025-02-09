const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const DoctorRoom = sequelize.define(
  "DoctorRoom",
  {
    Id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    ScheduleId: { type: DataTypes.STRING },
    EmployeeId: { type: DataTypes.STRING },
    ShiftId: { type: DataTypes.STRING },
    RoomId: { type: DataTypes.STRING },
    State: { type: DataTypes.BOOLEAN },
    MaxTime: { type: DataTypes.INTEGER },
  },
  {
    timestamps: false,
    tableName: "DoctorRoom",
  }
);

module.exports = DoctorRoom;
