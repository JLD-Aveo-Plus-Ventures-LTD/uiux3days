const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Lead = sequelize.define(
  "Lead",
  {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    service_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget_range: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    project_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    timeframe: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
    appointment_time: {
      type: DataTypes.DATE,
      allowNull: true, // null means they haven't booked yet
    },
    appointment_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "unbooked", // other values later: 'booked', 'completed', 'cancelled'
    },
    client_timezone: {
      type: DataTypes.STRING,
      allowNull: true, // we'll store things like 'Europe/London', 'Africa/Lagos'
    },
    preferred_contact_method: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Call",
    },
    reminder_24_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reminder_1_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reminder_15_sent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "leads",
    underscored: true,
  }
);

module.exports = Lead;
