const uri = require("express").Router();
const { ConsultationHours } = require("../relative");
const setId = require("../createId");
const { Op } = require("sequelize");

uri.post("/create-consultation-hours", async (req, res) => {
  const { name, start, end } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("CH", currentDate);
    const newHours = await ConsultationHours.create({
      Id: newId,
      Name: name,
      Start: start,
      End: end,
    });
    return res.json({
      Status: "Success",
      ConsultationHours: {
        Id: newHours.getDataValue("Id"),
        Name: newHours.getDataValue("Name"),
      },
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-consultation-hours", async (req, res) => {
  try {
    const allTime = await ConsultationHours.findAll({order: [
        ['Start', 'ASC'], 
      ]});
    return res.json({ Status: "Success", ConsultationHours: allTime });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
