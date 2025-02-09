const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Appointment = sequelize.define(
  "Appointment",
  {
    Id: { type: DataTypes.STRING, primaryKey: true },
    PatientId: { type: DataTypes.STRING, allowNull: false },
    Object: { type: DataTypes.STRING },
    Priority: { type: DataTypes.BOOLEAN },
    DoctorId: { type: DataTypes.STRING },
    State: { type: DataTypes.STRING(50) },
    Date: { type: DataTypes.DATE },
    Note: { type: DataTypes.STRING },
    Time: { type: DataTypes.TIME },
    DoctorRoomId: { type: DataTypes.STRING },
    Number: { type: DataTypes.INTEGER },
  },
  {
    timestamps: false,
    tableName: "Appointment",
  }
);

module.exports = Appointment;
