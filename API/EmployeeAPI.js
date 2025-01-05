const uri = require("express").Router();
const setId = require("../createId");
const Employee = require("../Model/Employee");

uri.post("/add-employee", async (req, res) => {
  const {
    name,
    birth,
    gender,
    nation,
    ethnicity,
    zone,
    phone,
    gmail,
    location,
    type,
  } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("NV", currentDate);
    const newEmployee = await Employee.create({
      Id: newId,
      Name: name,
      Birth: birth,
      Gender: gender,
      Nation: nation,
      Ethnicity: ethnicity,
      Zone: zone,
      Phone: phone,
      Gmail: gmail,
      Location: location,
      Type: type,
    });
    return res.json({
      Status: "Success",
      Employee: newEmployee.getDataValue("Id"),
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-all-employee", async (req, res) => {
  try {
    const Employee = await Employee.findAll();
    res.json({ Status: "Success", Employees: Employee });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-type-employee", async (req, res) => {
  const { type } = req.query;
  try {
    const employee = await Employee.findAll({ where: { Type: type } });
    if (employee.length > 0) {
      return res.json({ Status: "Success", Employees: employee });
    } else {
      return res.json({ Status: "Empty" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
