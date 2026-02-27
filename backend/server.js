const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const leadRoutes = require("./src/routes/leadRoutes");
const { sequelize, testConnection } = require("./src/config/db");
require("./src/models/Lead");
const { startReminderScheduler } = require("./src/services/reminderScheduler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Update this origin to match your frontend URL.
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", leadRoutes);

app.get("/", (req, res) => {
  res.json({ message: "JALS API running" });
});

async function start() {
  await testConnection();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  startReminderScheduler();
}

start();
