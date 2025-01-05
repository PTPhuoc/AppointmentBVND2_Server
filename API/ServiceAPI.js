const uri = require("express").Router();
const { Service } = require("../relative");
const setId = require("../createId");

uri.post("/add-service", async (req, res) => {
  const { name, codeName, zone, price, paymentType, departmentId } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("DV", currentDate);
    const newService = await Service.create({
      Id: newId,
      Name: name,
      CodeName: codeName,
      Zone: zone,
      Price: price,
      State: true,
      PaymentType: paymentType,
      DepartmentId: departmentId
    });
    return res.json({
      Status: "Success",
      Service: newService.getDataValue("Id"),
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-service", async (req, res) => {
  try {
    const Services = await Service.findAll();
    res.json({ Status: "Success", Services: Services });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
