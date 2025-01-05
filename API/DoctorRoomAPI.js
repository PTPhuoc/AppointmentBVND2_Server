const uri = require("express").Router();
const setId = require("../createId");
const {
  DoctorRoom,
  Employee,
  Room,
  Shift,
  Department,
  ConsultationHours,
  Appointment,
  Service,
} = require("../relative");

uri.post("/add-doctor-room", async (req, res) => {
  const { employeeId, shiftId, roomId, week, day, date, state } = req.body;
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
      State: state,
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
  const { id, employeeId, shiftId, roomId, week, day, date, state } = req.body;
  try {
    const selectDate = new Date(date);
    await DoctorRoom.update(
      {
        EmployeeId: employeeId,
        ShiftId: shiftId,
        RoomId: roomId,
        Week: week,
        Day: day,
        Date: selectDate,
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

uri.delete("/delete-all-doctor-room", async (req, res) => {
  const { week, date } = req.query;
  try {
    const selectDate = new Date(date);
    await DoctorRoom.destroy({ where: { Week: week, Date: selectDate } });
    res.json({
      Status: "Success",
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/duplicate-doctor-room", async (req, res) => {
  const { week, day, date, targetWeek, targetDay, targetDate } = req.body;
  try {
    const doctorRooms = await DoctorRoom.findAll({
      where: { Week: week, Date: date },
    });
    const targetDoctorRooms = await DoctorRoom.findAll({
      where: { Week: targetWeek, Date: targetDate },
    });
    if (targetDoctorRooms.length === 0) {
      const handleDuplicate = doctorRooms.map(async (item, index) => {
        const currentDate = new Date();
        let newId = item.Id;
        const hasC = newId.includes("C");
        if (hasC) {
          newId = newId.split("C")[0] + setId("C", currentDate);
        } else {
          newId += setId("C", currentDate);
        }
        return await DoctorRoom.create({
          Id: newId,
          EmployeeId: item.EmployeeId,
          ShiftId: item.ShiftId,
          RoomId: item.RoomId,
          Day: targetDay,
          Week: targetWeek,
          Date: targetDate,
          State: item.State,
        });
      });
      await Promise.all(handleDuplicate);
      return res.json({
        Status: "Success",
      });
    } else {
      return res.json({ Status: "Has Data" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/insert-doctor-room", async (req, res) => {
  const { week, day, date, targetWeek, targetDay, targetDate } = req.body;
  try {
    const doctorRooms = await DoctorRoom.findAll({
      where: { Week: week, Date: date },
    });
    const handleDuplicate = doctorRooms.map(async (item, index) => {
      let newId = item.Id;
      const hasC = newId.includes("C");
      if (hasC) {
        const number = parseInt(newId.split("C")[1], 10);
        newId = newId.split("C")[0] + "C" + (number + 1);
      } else {
        newId += "C1";
      }
      return await DoctorRoom.create({
        Id: newId,
        EmployeeId: item.EmployeeId,
        ShiftId: item.ShiftId,
        RoomId: item.RoomId,
        Day: targetDay,
        Week: targetWeek,
        Date: targetDate,
        State: item.State,
      });
    });
    await Promise.all(handleDuplicate);
    return res.json({
      Status: "Success",
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-doctor-room", async (req, res) => {
  const { week, date } = req.query;
  try {
    const selectDate = new Date(date);
    const doctorRooms = await DoctorRoom.findAll({
      where: { Week: week, Date: selectDate },
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
          attributes: ["Id", "Name"],
          required: true,
        },
      ],
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

function calculateMaxPatients(startTime, endTime, consultationTime) {
  const diffInMilliseconds = Math.abs(endTime - startTime);
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return Math.floor(totalMinutes / consultationTime);
}

uri.get("/get-doctor-room-consultation", async (req, res) => {
  const { shiftId, departmentId, doctorId, week, date } = req.query;
  try {
    const allTime = await ConsultationHours.findAll({
      order: [["Start", "ASC"]],
    });
    const appointment = await Appointment.findAll({
      where: { Date: date },
      include: [
        { model: Service, attributes: ["DepartmentId"], required: true },
      ],
    });
    const doctorRooms = await DoctorRoom.findAll({
      where: { Week: week, Date: date },
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
    });
    const handleDoctorRoom = await Promise.all(
      doctorRooms.map((item1) => {
        const handleTime = allTime
          .map((item2) => {
            if (item2.End <= item1.Shift.End) {
              const slot = calculateMaxPatients(item2.Start, item2.End, 6);
              const valable = appointment.filter(
                (item3) =>
                  item3.State === "Đã đăng ký" &&
                  item3.Service.DepartmentId === item1.Room.Department.Id
              ).length;
              return {
                ...item1.toJSON(),
                Slot: slot,
                Shift: item2.Name,
                ShiftId: item2.Id,
                ShiftStart: item2.Start,
                ShiftEnd: item2.End,
                Valable: valable,
              };
            }
            return null;
          })
          .filter(Boolean);
        return handleTime;
      })
    );
    if (handleDoctorRoom.length > 0) {
      let result = handleDoctorRoom.flat();
      if (shiftId) {
        result = result.filter((item) => item.ShiftId === shiftId);
      }
      if (departmentId) {
        result = result.filter(
          (item) => item.Room.Department.Id === departmentId
        );
      }
      if (doctorId) {
        result = result.filter((item) => item.EmployeeId === doctorId);
      }
      return res.json({ Status: "Success", DoctorRooms: result });
    } else {
      return res.json({ Status: "Empty" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
