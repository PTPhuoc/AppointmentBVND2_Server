const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Schedule = sequelize.define(
  "Schedule",
  {
    Name: { type: DataTypes.STRING , primaryKey: true, allowNull: false},
    Monday: { type: DataTypes.BOOLEAN },
    Tuesday: { type: DataTypes.BOOLEAN },
    Wednesday: { type: DataTypes.BOOLEAN },
    Thursday: { type: DataTypes.BOOLEAN },
    Friday: { type: DataTypes.BOOLEAN },
    Saturday: { type: DataTypes.BOOLEAN },
    Sunday: { type: DataTypes.BOOLEAN },
    Status: { type: DataTypes.BOOLEAN },
  },
  { timestamps: false, tableName: "Schedule" }
);

module.exports = Schedule;
