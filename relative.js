const sequelize = require("./database");
const Room = require("./Model/Room");
const Department = require("./Model/Department");
const Employee = require("./Model/Employee");
const DoctorRoom = require("./Model/DoctorRoom");
const Shift = require("./Model/Shift");
const Appointment = require("./Model/Appointment");
const Patient = require("./Model/Patient");
const ConsultationHours = require("./Model/ConsultationHours");
const Service = require("./Model/Service");

DoctorRoom.belongsTo(Employee, { foreignKey: "EmployeeId" });
Employee.hasMany(DoctorRoom, { foreignKey: "EmployeeId" });

DoctorRoom.belongsTo(Shift, { foreignKey: "ShiftId" });
Shift.hasMany(DoctorRoom, { foreignKey: "ShiftId" });

DoctorRoom.belongsTo(Room, { foreignKey: "RoomId" });
Room.hasMany(DoctorRoom, { foreignKey: "RoomId" });

Room.belongsTo(Department, { foreignKey: "DepartmentId" });
Department.hasMany(Room, { foreignKey: "DepartmentId" });

Appointment.belongsTo(DoctorRoom, { foreignKey: "DoctorRoomId" });
DoctorRoom.hasMany(Appointment, { foreignKey: "DoctorRoomId" });

Appointment.belongsTo(Service, { foreignKey: "ServiceId" });
Service.hasMany(Appointment, { foreignKey: "ServiceId" });

Appointment.belongsTo(Patient, { foreignKey: "PatientId" });
Patient.hasMany(Appointment, { foreignKey: "PatientId" });

Appointment.belongsTo(Employee, {foreignKey: "DoctorId"})
Employee.hasMany(Appointment, {foreignKey: "DoctorId"})

Service.belongsTo(Department, { foreignKey: "DepartmentId" });
Department.hasMany(Service, { foreignKey: "DepartmentId" });

module.exports = {
  sequelize,
  Room,
  Department,
  DoctorRoom,
  Employee,
  Shift,
  Appointment,
  Patient,
  ConsultationHours,
  Service,
};
