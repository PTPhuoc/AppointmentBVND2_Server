const uri = require("express").Router();
const setId = require("../createId");
const { Shift } = require("../relative");

uri.post("/add-shift", async (req, res) => {
  const { name, start, end } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("S", currentDate);
    const newShift = await Shift.create({
      Id: newId,
      Name: name,
      Start: start,
      End: end,
    });
    res.json({ Status: "Success", ShiftId: newShift.getDataValue("Id") });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-all-shift", async (req, res) => {
  try {
    const shifts = await Shift.findAll();
    if (shifts.length > 0) {
      return res.json({ Status: "Success", Shifts: shifts });
    } else {
      return res.json({ Status: "Empty" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
