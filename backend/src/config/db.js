// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');

// dotenv.config();

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 3306,
//   dialect: 'mysql',
//   logging: false,
// });

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Connected to MySQL');
//   } catch (error) {
//     console.error('❌ Unable to connect to MySQL:', error.message);
//   }
// }

// module.exports = { sequelize, testConnection };

const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Railway / production setup (connection URL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
  });
} else {
  // ✅ Local development fallback
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    }
  );
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error.message);
    throw error;
  }
}

module.exports = { sequelize, testConnection };
