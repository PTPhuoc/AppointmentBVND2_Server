const uri = require("express").Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const Account = require("../Model/Account");
const setId = require("../createId");

const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

const comparePassword = async (password, hashedPass) => {
  const isMatch = await bcrypt.compare(password, hashedPass);
  return isMatch;
};

uri.post("/sign-up", async (req, res) => {
  const { name, password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    const currentDate = new Date()
    const newId = setId("A", currentDate);
    const newAccount = await Account.create({
      Id: newId,
      Name: name,
      Password: hashedPassword,
      Role: role,
    });
    return res.json({
      Status: "Success",
      Account: {
        id: newAccount.getDataValue("Id"),
        name: newAccount.getDataValue("Name"),
        role: newAccount.getDataValue("Role"),
      },
    });
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/sign-in", async (req, res) => {
  const { name, password } = req.body;
  try {
    const currentAccount = await Account.findOne({
      where: {
        Name: name,
      },
      attributes: ["Name", "Password", "Id", "Role"],
    });
    const isMatch = await comparePassword(
      password,
      currentAccount.getDataValue("Password")
    );
    if (isMatch) {
      return res.json({
        Status: "Success",
        Account: {
          id: currentAccount.getDataValue("Id"),
          name: currentAccount.getDataValue("Name"),
          role: currentAccount.getDataValue("Role"),
        },
      });
    } else {
      return res.json({ Status: "Not Found" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

uri.post("/get-infor-user", async (req, res) => {
  const { name } = req.body;
  try {
    const currentAccount = await Account.findOne({
      where: { Name: name },
      attributes: ["Name", "Id", "Role"],
    });
    if (currentAccount) {
      return res.json({
        Status: "Success",
        Account: {
          id: currentAccount.getDataValue("Id"),
          name: currentAccount.getDataValue("Name"),
          role: currentAccount.getDataValue("Role"),
        },
      });
    } else {
      return res.json({ Status: "Not Found" });
    }
  } catch (err) {
    return res.json({ Status: "Server Error", Message: err });
  }
});

module.exports = uri;
