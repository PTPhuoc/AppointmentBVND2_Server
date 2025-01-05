const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.database,
  process.env.user,
  process.env.password,
  {
    host: process.env.ip,
    dialect: "mssql", // Hoặc "postgres", "sqlite", "mssql"
    dialectOptions: {
      options: {
        encrypt: true, 
        enableArithAbort: true,
      },
    },
    logging: false,
  }
);

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log("Kết nối thành công đến cơ sở dữ liệu!"))
  .catch((err) => console.error("Không thể kết nối:", err));

sequelize
  .sync({ alter: true }) // `alter: true` chỉ thay đổi khi cần
  .then(() => console.log("Đồng bộ hóa thành công!"))
  .catch((err) => console.error("Lỗi đồng bộ:", err));

module.exports = sequelize;
