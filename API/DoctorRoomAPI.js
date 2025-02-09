const uri = require("express").Router();
const setId = require("../createId");
const {
  DoctorRoom,
  Employee,
  Room,
  Shift,
  Department
} = require("../relative");

uri.post("/add-doctor-room", async (req, res) => {
  const {
    employeeId,
    scheduleId,
    shiftId,
    roomId,
    week,
    day,
    date,
    maxTime,
    state,
  } = req.body;
  try {
    const currentDate = new Date();
    const selectDate = new Date(date);
    const newId = setId("DR", currentDate);
    const newDoctorRoom = await DoctorRoom.create({
      Id: newId,
      EmployeeId: employeeId,
      ShiftId: shiftId,
      RoomId: roomId,
      Week: week,
      Day: day,
      Date: selectDate,
      MaxTime: maxTime,
      State: state,
      ScheduleId: scheduleId,
    });
    res.json({
      Status: "Success",
      doctorRoomId: newDoctorRoom.getDataValue("Id"),
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/update-doctor-room", async (req, res) => {
  const {
    id,
    scheduleId,
    employeeId,
    shiftId,
    roomId,
    week,
    day,
    maxTime,
    date,
    state,
  } = req.body;
  try {
    const selectDate = new Date(date);
    await DoctorRoom.update(
      {
        EmployeeId: employeeId,
        ShiftId: shiftId,
        ScheduleId: scheduleId,
        RoomId: roomId,
        Week: week,
        Day: day,
        Date: selectDate,
        MaxTime: maxTime,
        State: state,
      },
      { where: { Id: id } }
    );
    res.json({
      Status: "Success",
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.delete("/delete-doctor-room", async (req, res) => {
  const { id } = req.query;
  try {
    await DoctorRoom.destroy({ where: { Id: id } });
    res.json({
      Status: "Success",
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-doctor-room", async (req, res) => {
  try {
    const doctorRooms = await DoctorRoom.findAll({
      include: [
        {
          model: Employee,
          attributes: ["Id", "Name"],
          required: true,
        },
        {
          model: Room,
          attributes: ["Id", "Name"],
          required: true,
          include: [
            {
              model: Department,
              attributes: ["Id", "Name", "Zone"],
              required: true,
            },
          ],
        },
        {
          model: Shift,
          attributes: ["Id", "Name", "Start", "End"],
          required: true,
        },
      ],
      order: [[Shift, "Start", "ASC"]],
    });
    if (doctorRooms.length > 0) {
      return res.json({ Status: "Success", DoctorRooms: doctorRooms });
    } else {
      return res.json({ Status: "Empty" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
