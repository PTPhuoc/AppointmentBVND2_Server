const uri = require("express").Router();
const setId = require("../createId");
const Department = require("../Model/Department");

uri.post("/add-department", async (req, res) => {
  const { name, zone, codeName } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("D", currentDate);
    const newDepartment = await Department.create({
      Id: newId,
      Name: name,
      Zone: zone,
      CodeName: codeName,
      Status: true,
    });
    return res.json({
      Status: "Success",
      DepamentId: newDepartment.getDataValue("Id"),
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
