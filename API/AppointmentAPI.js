const uri = require("express").Router();
const {
  Appointment,
  DoctorRoom,
  Employee,
  Patient,
  Room,
  ConsultationHours,
} = require("../relative");
const setId = require("../createId");
const { Op } = require("sequelize");
const { addMinutes } = require("date-fns");

uri.get("/get-appointment", async (req, res) => {
  const { date } = req.query;
  try {
    const Appointments = await Appointment.findAll({
      where: { Date: date },
      include: [
        {
          model: Patient,
          attributes: ["Id", "Name", "RelativesPhone"],
        },
        {
          model: Employee,
          attributes: ["Id", "Name"],
        },
        {
          model: DoctorRoom,
          include: [{ model: Room, attributes: ["Id", "Name"] }],
        },
      ],
    });
    if (Appointments.length > 0) {
      res.json({ Status: "Success", Appointments: Appointments });
    } else {
      res.json({ Status: "Empty" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-patient-appointment", async (req, res) => {
  const { id } = req.query;
  try {
    const patientAppointments = await Appointment.findOne({
      where: { Id: id },
      include: [
        {
          model: Patient,
          attributes: ["Id", "Name"],
        },
        {
          model: Employee,
          attributes: ["Id", "Name"],
        },
      ],
    });
    res.json({ Status: "Success", PatientAppointment: patientAppointments });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

const stringUTCTime = (date) => {
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
};

uri.post("/save-appointment", async (req, res) => {
  const {
    id,
    patientId,
    object,
    priority,
    doctorId,
    date,
    status,
    timeStart,
    timeEnd,
    time,
    note,
    doctorRoomId,
  } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("AP", currentDate);
    if (id && patientId) {
      const getDoctorRoom = await DoctorRoom.findOne({
        where: { Id: doctorRoomId },
      });
      const currentAppointment = await Appointment.findOne({
        where: { Id: id },
      });
      let number = 1;
      if (timeEnd && timeStart) {
        const registedAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: doctorRoomId,
            State: "Đã đăng ký",
            Priority: priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(timeStart)),
              [Op.lt]: stringUTCTime(new Date(timeEnd)),
            },
            Id: { [Op.ne]: id },
          },
        });
        number = registedAppointment.length + 1;
      } else {
        const registedAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: doctorRoomId,
            State: "Đã đăng ký",
            Priority: priority,
            Id: { [Op.ne]: id },
          },
        });
        number = registedAppointment.length + 1;
      }

      if (time) {
        const getHours = await ConsultationHours.findOne({
          where: {
            Start: { [Op.lte]: stringUTCTime(new Date(time)) },
            End: { [Op.gt]: stringUTCTime(new Date(time)) },
          },
        });
        await Appointment.update(
          {
            Object: object ? object : currentAppointment.Object,
            Priority: priority ? priority : currentAppointment.Priority,
            DoctorId: doctorId ? doctorId : currentAppointment.DoctorId,
            State: status ? status : currentAppointment.State,
            Date: date ? date : currentAppointment.Date,
            Time: stringUTCTime(
              addMinutes(getHours.Start, (number - 1) * getDoctorRoom.MaxTime)
            ),
            DoctorRoomId: doctorRoomId
              ? doctorRoomId
              : currentAppointment.DoctorRoomId,
            Number: number,
            Note: note ? note : currentAppointment.Note,
          },
          { where: { Id: id, PatientId: patientId } }
        );
      } else {
        await Appointment.update(
          {
            Object: object ? object : currentAppointment.Object,
            Priority: priority ? priority : currentAppointment.Priority,
            DoctorId: doctorId ? doctorId : currentAppointment.DoctorId,
            State: status ? status : currentAppointment.State,
            Date: date ? date : currentAppointment.Date,
            Time: timeStart
              ? stringUTCTime(
                  addMinutes(
                    new Date(timeStart),
                    (number - 1) * getDoctorRoom.MaxTime
                  )
                )
              : stringUTCTime(currentAppointment.Time),
            DoctorRoomId: doctorRoomId
              ? doctorRoomId
              : currentAppointment.DoctorRoomId,
            Number: number,
            Note: note ? note : currentAppointment.Note,
          },
          { where: { Id: id, PatientId: patientId } }
        );
      }

      return res.json({
        Status: "Success",
        AppointmentId: id,
      });
    } else {
      const currentAppointment = await Appointment.create({
        Id: newId,
        PatientId: patientId,
        Object: object,
        Priority: priority,
        DoctorId: doctorId,
        State: status,
        Date: date,
        Time: null,
        DoctorRoomId: null,
        Number: 0,
        Note: note,
      });
      return res.json({
        Status: "Success",
        AppointmentId: currentAppointment.getDataValue("Id"),
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/cancel-appointment", async (req, res) => {
  const { id } = req.body;
  try {
    await Appointment.update(
      {
        State: "Đã hủy",
      },
      { where: { Id: id } }
    );
    return res.json({ Status: "Success" });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.delete("/delete-appointment", async (req, res) => {
  const { id } = req.query;
  try {
    await Appointment.destroy({ where: { Id: id } });
    return res.json({ Status: "Success" });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/reset-select-appointment", async (req, res) => {
  const { id, date } = req.body;
  try {
    const currentAppointment = await Appointment.findOne({ where: { Id: id } });
    const getDoctorRoom = await DoctorRoom.findOne({
      where: { Id: currentAppointment.DoctorRoomId },
    });
    if (getDoctorRoom) {
      const getHours = await ConsultationHours.findOne({
        where: {
          Start: { [Op.lte]: stringUTCTime(new Date(currentAppointment.Time)) },
          End: { [Op.gt]: stringUTCTime(new Date(currentAppointment.Time)) },
        },
      });
      if (currentAppointment.Priority) {
        const requireAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
            Number: { [Op.gte]: currentAppointment.Number },
            Id: { [Op.ne]: id },
          },
        });
        const normalAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: !currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
          },
        });
        if (requireAppointment.length > 0) {
          await Promise.all(
            requireAppointment.map((item) =>
              Appointment.update(
                {
                  Number: item.Number - 1,
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), -getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
        if (normalAppointment.length > 0) {
          await Promise.all(
            normalAppointment.map((item) =>
              Appointment.update(
                {
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), -getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
      } else {
        const registedAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
            Number: { [Op.gte]: currentAppointment.Number },
            Id: { [Op.ne]: id },
          },
        });
        if (registedAppointment.length > 0) {
          await Promise.all(
            registedAppointment.map((item) =>
              Appointment.update(
                {
                  Number: item.Number - 1,
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), -getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
      }
    }
    return res.json({
      Status: "Success",
      Message: `appointments updated.`,
    });
  } catch (error) {
    console.log(error);
    return res.json({ Status: "Server Error", Message: error.message });
  }
});

uri.post("/reset-update-appointment", async (req, res) => {
  const { id, date } = req.body;
  try {
    const currentAppointment = await Appointment.findOne({ where: { Id: id } });
    const getDoctorRoom = await DoctorRoom.findOne({
      where: { Id: currentAppointment.DoctorRoomId },
    });
    if (getDoctorRoom) {
      const getHours = await ConsultationHours.findOne({
        where: {
          Start: { [Op.lte]: stringUTCTime(new Date(currentAppointment.Time)) },
          End: { [Op.gt]: stringUTCTime(new Date(currentAppointment.Time)) },
        },
      });
      if (currentAppointment.Priority) {
        const requireAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
            Number: { [Op.gte]: currentAppointment.Number },
            Id: { [Op.ne]: id },
          },
        });
        const normalAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: !currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
          },
        });
        if (requireAppointment.length > 0) {
          await Promise.all(
            requireAppointment.map((item) =>
              Appointment.update(
                {
                  Number: item.Number - 1,
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), -getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
        if (normalAppointment.length > 0) {
          await Promise.all(
            normalAppointment.map((item) =>
              Appointment.update(
                {
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), -getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
      } else {
        const registedAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
            Number: { [Op.lte]: currentAppointment.Number },
            Id: { [Op.ne]: id },
          },
        });
        if (registedAppointment.length > 0) {
          await Promise.all(
            registedAppointment.map((item) =>
              Appointment.update(
                {
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
          const lessAppointment = await Appointment.findAll({
            where: {
              Date: date,
              DoctorRoomId: currentAppointment.DoctorRoomId,
              State: "Đã đăng ký",
              Priority: currentAppointment.Priority,
              Time: {
                [Op.gte]: stringUTCTime(new Date(getHours.Start)),
                [Op.lt]: stringUTCTime(new Date(getHours.End)),
              },
              Number: { [Op.gte]: currentAppointment.Number },
              Id: { [Op.ne]: id },
            },
          });
          if (lessAppointment.length > 0) {
            await Promise.all(
              registedAppointment.map((item) =>
                Appointment.update(
                  {
                    Number: item.Number - 1,
                  },
                  { where: { Id: item.Id } }
                )
              )
            );
          }
        }
      }
    }
    return res.json({
      Status: "Success",
      Message: `appointments updated.`,
    });
  } catch (error) {
    console.log(error);
    return res.json({ Status: "Server Error", Message: error.message });
  }
});

uri.post("/reset-target-appointment", async (req, res) => {
  const { id, date } = req.body;
  try {
    const currentAppointment = await Appointment.findOne({ where: { Id: id } });
    const getDoctorRoom = await DoctorRoom.findOne({
      where: { Id: currentAppointment.DoctorRoomId },
    });
    if (getDoctorRoom) {
      const getHours = await ConsultationHours.findOne({
        where: {
          Start: { [Op.lte]: stringUTCTime(new Date(currentAppointment.Time)) },
          End: { [Op.gt]: stringUTCTime(new Date(currentAppointment.Time)) },
        },
      });
      if (currentAppointment.Priority) {
        const normalAppointment = await Appointment.findAll({
          where: {
            Date: date,
            DoctorRoomId: currentAppointment.DoctorRoomId,
            State: "Đã đăng ký",
            Priority: !currentAppointment.Priority,
            Time: {
              [Op.gte]: stringUTCTime(new Date(getHours.Start)),
              [Op.lt]: stringUTCTime(new Date(getHours.End)),
            },
          },
        });
        if (normalAppointment.length > 0) {
          await Promise.all(
            normalAppointment.map((item) =>
              Appointment.update(
                {
                  Time: stringUTCTime(
                    addMinutes(new Date(item.Time), getDoctorRoom.MaxTime)
                  ),
                },
                { where: { Id: item.Id } }
              )
            )
          );
        }
      }
    }
    return res.json({
      Status: "Success",
      Message: `appointments updated.`,
    });
  } catch (error) {
    console.log(error);
    return res.json({ Status: "Server Error", Message: error.message });
  }
});

module.exports = uri;
