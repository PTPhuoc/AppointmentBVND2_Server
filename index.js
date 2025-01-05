const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const sequelize = require("./database");
const AccountAPI = require("./API/AccountAPI");
const AppointmentAPI = require("./API/AppointmentAPI");
const ServiceAPI = require("./API/ServiceAPI");
const EmployeeAPI = require("./API/EmployeeAPI");
const DepartmentAPI = require("./API/DepartmentAPI");
const DoctorRoomAPI = require("./API/DoctorRoomAPI");
const ShiftAPI = require("./API/ShiftAPI");
const RoomAPI = require("./API/RoomAPI");
const PatientAPI = require("./API/PatientAPI");
const ConsultationHours = require("./API/ConsultationHoursAPI")

const app = express();
const httpServer = createServer(app);

// Cấu hình Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Cho phép tất cả các IP
  },
});

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request body

app.use("/account", AccountAPI);
app.use("/appointment", AppointmentAPI);
app.use("/service", ServiceAPI);
app.use("/employee", EmployeeAPI);
app.use("/department", DepartmentAPI);
app.use("/doctor-room", DoctorRoomAPI);
app.use("/shift", ShiftAPI);
app.use("/room", RoomAPI);
app.use("/patient", PatientAPI);
app.use("/consultation-hours", ConsultationHours)

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("Người dùng đã kết nối:", socket.id);

  socket.on("message", (msg) => {
    console.log("Tin nhắn nhận được:", msg);
    io.emit("message", msg); // Phát tin nhắn đến tất cả các client
  });

  socket.on("disconnect", () => {
    console.log("Người dùng đã ngắt kết nối:", socket.id);
  });
});

// Kết nối cơ sở dữ liệu
sequelize
  .sync()
  .then(() => console.log("Database Status: Enable"))
  .catch((err) => {
    console.log("Lỗi: ", err);
  });

// Khởi động server
const PORT = process.env.port;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
