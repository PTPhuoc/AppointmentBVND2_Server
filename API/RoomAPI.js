const uri = require("express").Router();
const setId = require("../createId");
const { Sequelize } = require("sequelize");
const { Room, Department } = require("../relative")

uri.post("/add-room", async (req, res) => {
  const { name, codeName, departmentId } = req.body;
  try {
    const currentDate = new Date();
    const newId = setId("R", currentDate);
    const newRoom = await Room.create({
      Id: newId,
      Name: name,
      CodeName: codeName,
      DepartmentId: departmentId,
      State: true,
    });
    return res.json({ Status: "Success", RoomId: newRoom.getDataValue("Id") });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.get("/get-all-room", async (req, res) => {
  try {
    const rooms = await Room.findAll({
      attributes: ["Id", "Name", "CodeName", "State", "DepartmentId"],
      include: [
        {
          model: Department,
          attributes: ["Id", "Name"],
          required: true,
        },
      ],
    });
    return res.json({ Status: "Success", Rooms: rooms });
  } catch (err) {
    return res.json({ Status: "Error", Message: err.message });
  }
});

module.exports = uri;
