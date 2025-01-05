const uri = require("express").Router();
const { Patient } = require("../relative");
const setId = require("../createId");

uri.post("/save-patient", async (req, res) => {
  const {
    id,
    name,
    birth,
    age,
    gender,
    ethnicity,
    nation,
    job,
    location,
    codeLocation,
    marital,
    relatives,
    relativesPhone,
  } = req.body;
  try {
    const currentDate = new Date();
    if (id) {
      await Patient.update(
        {
          Name: name,
          Birth: birth,
          Age: age,
          Gender: gender,
          Ethnicity: ethnicity,
          Nation: nation,
          Job: job,
          Location: location,
          CodeLocation: codeLocation,
          Marital: marital,
          Relatives: relatives,
          RelativesPhone: relativesPhone,
        },
        { where: { Id: id } }
      );
      return res.json({
        Status: "Success",
        Patient: {
          Id: id,
          Name: name,
        },
      });
    } else {
      const newId = setId("P", currentDate);
      const newPatient = await Patient.create({
        Id: newId,
        Name: name,
        Birth: birth,
        Age: age,
        Gender: gender,
        Ethnicity: ethnicity,
        Nation: nation,
        Job: job,
        Location: location,
        CodeLocation: codeLocation,
        Marital: marital,
        Relatives: relatives,
        RelativesPhone: relativesPhone,
      });
      return res.json({
        Status: "Success",
        Patient: {
          Id: newPatient.getDataValue("Id"),
          Name: newPatient.getDataValue("Name"),
        },
      });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/all-patient", async (req, res) => {
  try {
    const allPatient = await Patient.findAll();
    return res.json({ Status: "Success", Patients: allPatient });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/one-patient", async (req, res) => {
  const { id } = req.query;
  try {
    const onePatient = await Patient.findOne({ where: { Id: id } });
    return res.json({ Status: "Success", Patients: onePatient });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
