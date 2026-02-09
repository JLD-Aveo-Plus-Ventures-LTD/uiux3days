const { Op } = require("sequelize");
const { DateTime } = require("luxon");
const Lead = require("../models/Lead");
const { sendReminderEmail } = require("../config/mail");
const { sendReminderSms } = require("../config/sms");

const REMINDER_WINDOWS = [
  { minutesBefore: 24 * 60, label: "tomorrow", flag: "reminder_24_sent" },
  { minutesBefore: 60, label: "in 1 hour", flag: "reminder_1_sent" },
  { minutesBefore: 15, label: "in 15 minutes", flag: "reminder_15_sent" },
];

const POLL_INTERVAL_MINUTES = Number(process.env.REMINDER_POLL_MINUTES) || 3;
const WINDOW_MINUTES = Number(process.env.REMINDER_WINDOW_MINUTES) || 5;

function isWithinWindow(diffMinutes, targetMinutes) {
  return (
    diffMinutes >= 0 &&
    Math.abs(diffMinutes - targetMinutes) <= WINDOW_MINUTES
  );
}

async function processLeadReminder(lead, config) {
  const preferredContactMethod = lead.preferred_contact_method || "Call";

  await sendReminderEmail(lead, {
    label: config.label,
    contactMethod: preferredContactMethod,
  });
  await sendReminderSms(lead, {
    label: config.label,
    contactMethod: preferredContactMethod,
  });

  lead[config.flag] = true;
  await lead.save();
}

async function scanForReminders() {
  try {
    const leads = await Lead.findAll({
      where: {
        appointment_status: { [Op.in]: ["booked", "confirmed"] },
        appointment_time: { [Op.gt]: new Date() },
        [Op.or]: [
          { reminder_24_sent: false },
          { reminder_1_sent: false },
          { reminder_15_sent: false },
        ],
      },
    });

    const now = DateTime.now();

    for (const lead of leads) {
      if (!lead.appointment_time) continue;

      const diffMinutes = DateTime.fromJSDate(new Date(lead.appointment_time))
        .diff(now, "minutes")
        .as("minutes");

      for (const config of REMINDER_WINDOWS) {
        if (lead[config.flag]) continue;

        if (isWithinWindow(diffMinutes, config.minutesBefore)) {
          await processLeadReminder(lead, config);
        }
      }
    }
  } catch (error) {
    console.error("Reminder scheduler error:", error.message);
  }
}

function startReminderScheduler() {
  // Run immediately at startup
  scanForReminders();

  setInterval(scanForReminders, POLL_INTERVAL_MINUTES * 60 * 1000);
}

module.exports = { startReminderScheduler };
