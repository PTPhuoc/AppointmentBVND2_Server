const uri = require("express").Router();
const {
  Appointment,
  ConsultationHours,
  Service,
  DoctorRoom,
  Employee,
  Patient,
  Room,
} = require("../relative");
const setId = require("../createId");
const { addMinutes } = require("date-fns");

uri.get("/get-appointment", async (req, res) => {
  const { date } = req.query;
  try {
    const Appointments = await Appointment.findAll({
      where: { date: date },
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
          model: Service,
          attributes: ["Id", "Name", "DepartmentId"],
        },
        {
          model: DoctorRoom,
          include: [{ model: Room, attributes: ["Id", "Name"] }],
        },
      ],
    });
    res.json({ Status: "Success", Appointments: Appointments });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/save-appointment", async (req, res) => {
  const {
    id,
    patientId,
    object,
    referralPlace,
    referrer,
    company,
    checkMedical,
    require,
    paraclinical,
    priority,
    serviceName,
    serviceId,
    doctor,
    doctorId,
    date,
    status,
  } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("AP", currentDate);
    if (id && patientId) {
      await Appointment.update(
        {
          Object: object,
          ReferralPlace: referralPlace,
          Referrer: referrer,
          Company: company,
          CheckMedical: checkMedical,
          Require: require,
          Paraclinical: paraclinical,
          Priority: priority,
          ServiceName: serviceName,
          ServiceId: serviceId,
          Doctor: doctor,
          DoctorId: doctorId,
          State: status,
          Date: date,
          Time: null,
          DoctorRoomId: null,
        },
        { where: { Id: id, PatientId: patientId } }
      );
      return res.json({
        Status: "Success",
        AppointmentId: id,
      });
    } else {
      const currentAppointment = await Appointment.create({
        Id: newId,
        PatientId: patientId,
        Object: object,
        ReferralPlace: referralPlace,
        Referrer: referrer,
        Company: company,
        CheckMedical: checkMedical,
        Require: require,
        Paraclinical: paraclinical,
        Priority: priority,
        ServiceName: serviceName,
        ServiceId: serviceId,
        Doctor: doctor,
        DoctorId: doctorId,
        State: status,
        Date: date,
        Time: null,
        DoctorRoomId: null,
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

uri.post("/add-time", async (req, res) => {
  const { id, doctorRoomId, shiftId, valable } = req.body;
  try {
    const getTime = await ConsultationHours.findOne({ where: { Id: shiftId } });
    const getDoctorRoom = await DoctorRoom.findOne({
      where: { Id: doctorRoomId },
      include: [
        { model: Employee, attributes: ["Id", "Name"], required: true },
      ],
    });
    const time = getTime.getDataValue("Start");
    const updateTime = addMinutes(time, valable * 6);
    const hours = updateTime.getUTCHours().toString().padStart(2, "0");
    const minutes = updateTime.getUTCMinutes().toString().padStart(2, "0");
    const seconds = updateTime.getUTCSeconds().toString().padStart(2, "0");
    await Appointment.update(
      {
        Time: hours + ":" + minutes + ":" + seconds,
        DoctorRoomId: doctorRoomId,
        DoctorId: getDoctorRoom.Employee.Id,
        Doctor: getDoctorRoom.Employee.Name,
        State: "Đã đăng ký",
      },
      { where: { Id: id } }
    );
    return res.json({ Status: "Success" });
  } catch (err) {
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

module.exports = uri;
