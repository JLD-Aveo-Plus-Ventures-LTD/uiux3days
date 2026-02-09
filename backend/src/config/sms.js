const https = require("https");
const { FROM_NAME, formatAppointmentDate } = require("./mail");
const { normalizePhoneNumber, DEFAULT_COUNTRY } = require("../utils/phone");

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } =
  process.env;

function hasConfig() {
  return TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER;
}

function resolveDestination(lead) {
  const countryHint = lead?.phone_country || DEFAULT_COUNTRY;
  const { e164, error } = normalizePhoneNumber(lead?.phone, countryHint);

  if (!e164) {
    console.warn(
      `Skipping SMS: invalid phone for lead ${lead?.id || "unknown"} (${lead?.phone || "missing"}) – ${
        error || "Unable to normalise number"
      }`
    );
  }

  return e164;
}

function sendRequest(path, body) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
      "base64"
    );

    const data = new URLSearchParams(body).toString();

    const options = {
      hostname: "api.twilio.com",
      port: 443,
      path,
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(
            new Error(
              `Twilio API responded with status ${res.statusCode}: ${responseData}`
            )
          );
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function sendBookingConfirmationSms(lead, { contactMethod = "Call" } = {}) {
  const toNumber = resolveDestination(lead);
  if (!toNumber) return;

  if (!hasConfig()) {
    console.warn("Twilio configuration missing. Skipping SMS send.");
    return;
  }

  const { formatted, zone } = formatAppointmentDate(lead);

  const body = `Hi ${lead.full_name}, thank you! Your consultation is booked for ${formatted} (${zone}). Preferred contact: ${contactMethod}.`;

  try {
    await sendRequest(
      `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        To: toNumber,
        From: TWILIO_FROM_NUMBER,
        Body: body,
      }
    );
  } catch (error) {
    console.error(
      `Twilio SMS error for lead ${lead?.id || "unknown"} (${toNumber}): ${error.message}`
    );
  }
}

async function sendReminderSms(lead, { label, contactMethod = "Call" }) {
  const toNumber = resolveDestination(lead);
  if (!toNumber) return;

  if (!hasConfig()) {
    console.warn("Twilio configuration missing. Skipping SMS send.");
    return;
  }

  const { formatted, zone } = formatAppointmentDate(lead);
  const friendlyLabel =
    label === "tomorrow"
      ? "tomorrow"
      : label === "in 1 hour"
      ? "in 1 hour"
      : "in 15 minutes";

  const body = `${FROM_NAME}: Reminder – your appointment is ${friendlyLabel} at ${formatted} (${zone}). Preferred contact: ${contactMethod}.`;

  try {
    await sendRequest(
      `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        To: toNumber,
        From: TWILIO_FROM_NUMBER,
        Body: body,
      }
    );
  } catch (error) {
    console.error(
      `Twilio SMS error for lead ${lead?.id || "unknown"} (${toNumber}): ${error.message}`
    );
  }
}

module.exports = { sendBookingConfirmationSms, sendReminderSms };
