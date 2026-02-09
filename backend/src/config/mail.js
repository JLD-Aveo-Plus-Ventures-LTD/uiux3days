const nodemailer = require("nodemailer");
const { DateTime } = require("luxon");
const dotenv = require("dotenv");

dotenv.config();

const FROM_NAME =
  process.env.FROM_NAME || process.env.EMAIL_SENDER_NAME || "JLD Aveo Institute";
const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER;

const hasSmtpConfig =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // SSL ON for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  : null;

async function safeSendMail(message) {
  if (!transporter) {
    console.warn("SMTP not configured. Skipping email send.");
    return;
  }

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Email send error:", error.message);
  }
}

function buildFromAddress() {
  if (FROM_EMAIL) {
    return `${FROM_NAME} <${FROM_EMAIL}>`;
  }
  return FROM_NAME;
}

function formatAppointmentDate(lead, zoneOverride) {
  const zone = zoneOverride || lead?.client_timezone || "Europe/London";
  let formatted = lead?.appointment_time;

  try {
    if (lead?.appointment_time) {
      const dt = DateTime.fromJSDate(new Date(lead.appointment_time)).setZone(
        zone
      );
      formatted = dt.isValid
        ? dt.toFormat("cccc, d LLLL yyyy 'at' h:mm a")
        : lead.appointment_time;
    }
  } catch (error) {
    console.error("Failed to format appointment time for email:", error.message);
  }

  return { formatted, zone };
}

async function sendAdminNotification(lead) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured. Skipping admin notification.");
    return;
  }

  const message = {
    from: buildFromAddress(),
    to: adminEmail,
    subject: `New Lead: ${lead.full_name}`,
    html: `<h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${lead.full_name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
      <p><strong>Service:</strong> ${lead.service_type}</p>
      <p><strong>Budget:</strong> ${lead.budget_range || "N/A"}</p>
      <p><strong>Timeframe:</strong> ${lead.timeframe || "N/A"}</p>
      <p><strong>Source:</strong> ${lead.source || "N/A"}</p>
      <p><strong>Description:</strong></p>
      <p>${lead.project_description || "N/A"}</p>`,
  };

  await safeSendMail(message);
}

async function sendAdminBookingNotification(
  lead,
  { contactMethod = "Call", clientTimezone } = {}
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured. Skipping booking admin notification.");
    return;
  }

  const { formatted, zone } = formatAppointmentDate(lead, clientTimezone);

  const message = {
    from: buildFromAddress(),
    to: adminEmail,
    subject: `Appointment booked: ${lead.full_name}`,
    text: `A client has booked a consultation.\n\nName: ${lead.full_name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nService: ${lead.service_type}\nAppointment: ${formatted} (${zone})\nPreferred contact: ${contactMethod}\nSource: ${lead.source || "N/A"}\nLead ID: ${lead.id}`,
  };

  await safeSendMail(message);
}

async function sendLeadConfirmation(lead) {
  if (String(process.env.ENABLE_LEAD_AUTOREPLY).toLowerCase() !== "true") {
    return;
  }

  const message = {
    from: buildFromAddress(),
    to: lead.email,
    subject: "Thanks for contacting JALS",
    text: `Hi ${lead.full_name},\n\nThank you for telling us about your project. Our team will review your request and reach out soon.\n\n- JALS Team`,
  };

  await safeSendMail(message);
}

async function sendBookingConfirmation(
  lead,
  { contactMethod = "Call", clientTimezone } = {}
) {
  if (!lead?.email) return;

  const { formatted, zone } = formatAppointmentDate(lead, clientTimezone);

  const message = {
    from: buildFromAddress(),
    to: lead.email,
    subject: "Your consultation is booked",
    text: `Hi ${lead.full_name},\n\nGreat news – your consultation has been booked for ${formatted} (${zone}).\n\nPreferred contact method: ${contactMethod}\n\nIf you need to reschedule, just reply to this email and we'll arrange a new time.\n\nThanks,\nJALS Team`,
  };

  await safeSendMail(message);
}

async function sendReminderEmail(lead, { label, contactMethod = "Call" }) {
  if (!lead?.email) return;

  const { formatted, zone } = formatAppointmentDate(lead);

  const subject = `Reminder: Your consultation ${label}`;
  const message = {
    from: buildFromAddress(),
    to: lead.email,
    subject,
    text: `Hi ${lead.full_name},\n\nYour appointment is ${label.toLowerCase()} (at ${formatted} ${zone}).\n${label === "in 1 hour" ? "Your appointment is in 1 hour" : label === "in 15 minutes" ? "Your appointment begins in 15 minutes" : "Your appointment is tomorrow"} at ${formatted}.\nPreferred contact method: ${contactMethod}.\n\nIf you need to adjust the time, please reply to this message.\n\nThanks,\n${FROM_NAME}`,
  };

  await safeSendMail(message);
}

module.exports = {
  transporter,
  sendAdminNotification,
  sendLeadConfirmation,
  sendBookingConfirmation,
  sendAdminBookingNotification,
  sendReminderEmail,
  formatAppointmentDate,
  FROM_NAME,
};
