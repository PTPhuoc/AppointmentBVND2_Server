const uri = require("express").Router();
const { Schedule, DoctorRoom } = require("../relative");
const { Op } = require("sequelize");

uri.get("/all-schedule", async (req, res) => {
  try {
    const allSchedule = await Schedule.findAll();
    return res.json({ Status: "Success", Schedules: allSchedule });
  } catch (error) {
    return res.json({ Status: "Error", Error: error });
  }
});

uri.post("/create-schedule", async (req, res) => {
  const { name } = req.body;
  try {
    const checkName = await Schedule.findOne({ where: { Name: name } });
    if (checkName) {
      return res.json({ Status: "Failure", Message: "Not Unique" });
    } else {
      let day = {
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
      };
      const allScheduleActive = await Schedule.findAll({
        where: { Status: 1 },
      });
      if (allScheduleActive.length > 0) {
        allScheduleActive.forEach((schedule) => {
          Object.keys(day).forEach((key) => {
            if (schedule[key] === true) {
              day[key] = false;
            }
          });
        });
      }
      const newSchedule = await Schedule.create({
        Name: name,
        Status: true,
        ...day,
      });
      return res.json({ Status: "Success", Schedule: newSchedule });
    }
  } catch (error) {
    return res.json({ Status: "Error", Error: error });
  }
});

uri.post("/delete-schedule", async (req, res) => {
  const { name } = req.body;
  try {
    await Schedule.destroy({ where: { Name: name } });
    await DoctorRoom.destroy({ where: { ScheduleId: name } });
    return res.json({ Status: "Success" });
  } catch (error) {
    return res.json({ Status: "Server Error", Message: error });
  }
});

const handleSetSchedule = (schedule, otherSchedule) => {
  let targetSchedule = { ...schedule };
  Object.keys(targetSchedule).forEach((key) => {
    targetSchedule[key] = !schedule[key];
  });
  if (otherSchedule.length > 0) {
    otherSchedule.forEach((item) => {
      Object.keys(targetSchedule).forEach((key) => {
        if (item[key]) {
          targetSchedule[key] = false;
        }
      });
    });
  }
  return targetSchedule;
};

uri.post("/update-schedule", async (req, res) => {
  const { name, targetName, status, listDay } = req.body;
  try {
    let day = {
      Monday: listDay.Monday,
      Tuesday: listDay.Tuesday,
      Wednesday: listDay.Wednesday,
      Thursday: listDay.Thursday,
      Friday: listDay.Friday,
      Saturday: listDay.Saturday,
      Sunday: listDay.Sunday,
    };
    if (status) {
      if (targetName) {
        const otherSchedule = await Schedule.findAll({
          where: {
            Status: true,
            Name: { [Op.ne]: name },
            Name: { [Op.ne]: targetName },
          },
        });
        await Schedule.update(
          {
            ...handleSetSchedule(day, otherSchedule),
            Status: status,
          },
          { where: { Name: targetName } }
        );
      } else {
        const otherSchedule = await Schedule.findAll({
          where: { Status: true, Name: { [Op.ne]: name } },
        });
        if (otherSchedule.length > 0) {
          await Promise.all(
            otherSchedule.map(async (item) => {
              return Schedule.update(
                {
                  Monday: day.Monday ? false : item.Monday,
                  Tuesday: day.Tuesday ? false : item.Tuesday,
                  Wednesday: day.Wednesday ? false : item.Wednesday,
                  Thursday: day.Thursday ? false : item.Thursday,
                  Friday: day.Friday ? false : item.Friday,
                  Saturday: day.Saturday ? false : item.Saturday,
                  Sunday: day.Sunday ? false : item.Sunday,
                  Status: status,
                },
                { where: { Name: item.Name } }
              );
            })
          );
        }
      }
    }
    await Schedule.update(
      {
        ...day,
        Status: status,
      },
      { where: { Name: name } }
    );
    return res.json({ Status: "Success" });
  } catch (error) {
    return res.json({ Status: "Error", Error: error });
  }
});

module.exports = uri;
