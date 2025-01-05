const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Appointment = sequelize.define(
  "Appointment",
  { 
    Id: { type: DataTypes.STRING, primaryKey: true },
    PatientId: {type: DataTypes.STRING, allowNull: false},
    Object: { type: DataTypes.STRING },
    ReferralPlace: { type: DataTypes.STRING },
    Referrer: { type: DataTypes.STRING },
    Company: { type: DataTypes.BOOLEAN },
    CheckMedical: { type: DataTypes.STRING },
    Require: { type: DataTypes.BOOLEAN },
    Paraclinical: { type: DataTypes.BOOLEAN },
    Priority: { type: DataTypes.STRING(50) },
    ServiceName: { type: DataTypes.STRING },
    ServiceId: { type: DataTypes.STRING },
    Doctor: { type: DataTypes.STRING },
    DoctorId: { type: DataTypes.STRING },
    State: { type: DataTypes.STRING(50) },
    Date: { type: DataTypes.DATE },
    Time: { type: DataTypes.TIME },
    DoctorRoomId: { type: DataTypes.STRING },
  },
  {
    timestamps: false,
    tableName: "Appointment",
  }
);

module.exports = Appointment;
