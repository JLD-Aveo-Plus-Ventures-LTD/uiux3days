const { Op, Transaction } = require("sequelize");
const { DateTime } = require("luxon");
const Lead = require("../models/Lead");
const {
  sendAdminNotification,
  sendLeadConfirmation,
  sendBookingConfirmation,
  sendAdminBookingNotification,
} = require("../config/mail");
const { sendBookingConfirmationSms } = require("../config/sms");
const { validateLeadPayload } = require("../utils/validation");
const { sequelize } = require("../config/db");
const { normalizePhoneNumber, DEFAULT_COUNTRY } = require("../utils/phone");

/**
 * Create a new lead
 */
async function createLead(req, res) {
  const { valid, errors } = validateLeadPayload(req.body);
  if (!valid) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  const { e164, error: phoneError, country } = normalizePhoneNumber(
    req.body.phone,
    req.body.phone_country || DEFAULT_COUNTRY
  );

  if (!e164) {
    return res.status(400).json({
      message:
        phoneError ||
        "Please enter a valid mobile number so we can send confirmations and reminders.",
    });
  }

  req.body.phone = e164;
  req.body.phone_country = country?.code;

  try {
    const lead = await Lead.create(req.body);

    // Notify admin + optional autoresponder
    sendAdminNotification(lead).catch((err) =>
      console.error("Admin email error:", err.message)
    );
    sendLeadConfirmation(lead).catch((err) =>
      console.error("Lead email error:", err.message)
    );

    // IMPORTANT: return the created lead (includes lead.id)
    return res.status(201).json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create lead" });
  }
}

/**
 * Paginated list of leads with optional status/search filters
 */
async function getLeads(req, res) {
  const { status, search, page = 1, limit = 20 } = req.query;
  const where = {};

  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { service_type: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const offset = (pageNum - 1) * limitNum;

  try {
    const { rows, count } = await Lead.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [["created_at", "DESC"]],
    });
    return res.json({
      leads: rows,
      total: count,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch leads" });
  }
}

/**
 * Get a single lead by ID
 */
async function getLeadById(req, res) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    return res.json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch lead" });
  }
}

/**
 * Update lead (generic)
 */
async function updateLead(req, res) {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (req.body.phone) {
      const { e164, error: phoneError, country } = normalizePhoneNumber(
        req.body.phone,
        req.body.phone_country || DEFAULT_COUNTRY
      );

      if (!e164) {
        return res.status(400).json({
          message:
            phoneError ||
            "Please provide a valid mobile number so we can send confirmations and reminders.",
        });
      }

      req.body.phone = e164;
      req.body.phone_country = country?.code;
    }
    await lead.update(req.body);
    return res.json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update lead" });
  }
}

/**
 * Summary stats for dashboard
 */
async function getSummary(req, res) {
  try {
    const totalLeads = await Lead.count();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newThisWeek = await Lead.count({
      where: { created_at: { [Op.gte]: oneWeekAgo } },
    });

    const statuses = [
      "new",
      "contacted",
      "qualified",
      "not_interested",
      "converted",
    ];
    const byStatus = {};
    await Promise.all(
      statuses.map(async (status) => {
        byStatus[status] = await Lead.count({ where: { status } });
      })
    );

    return res.json({ totalLeads, newThisWeek, byStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
}

/**
 * 🔹 Get available slots for a given date (in UK time)
 * Route example: GET /api/leads/slots?date=2025-11-30
 */
async function getAvailableSlots(req, res) {
  try {
    const WORK_DAY_START_HOUR = 8; // 08:00
    const WORK_DAY_END_HOUR = 18; // 18:00
    const SLOT_INTERVAL_MINUTES = 40; // 30 mins + 10 mins buffer
    const ZONE = "Europe/London";
    const takenStatuses = ["booked", "confirmed"];

    // If date not provided, default to today in UK
    const todayUk = DateTime.now().setZone(ZONE);
    const requestedDate = req.query.date;
    const dateStr = requestedDate || todayUk.toISODate(); // YYYY-MM-DD

    // Validate date
    const parsedDate = DateTime.fromISO(dateStr, { zone: ZONE });
    if (!parsedDate.isValid) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Start/end of that day in UK time
    const dayStartUk = parsedDate.set({
      hour: WORK_DAY_START_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    const dayEndUk = parsedDate.set({
      hour: WORK_DAY_END_HOUR,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    // Get all booked appointments for that day (in UTC)
    const dayStartUtc = dayStartUk.toUTC();
    const dayEndUtc = dayEndUk.toUTC();

    const bookedLeads = await Lead.findAll({
      where: {
        appointment_status: { [Op.in]: takenStatuses },
        appointment_time: {
          [Op.between]: [dayStartUtc.toJSDate(), dayEndUtc.toJSDate()],
        },
      },
      attributes: ["appointment_time"],
    });

    const bookedTimesMs = new Set(
      bookedLeads
        .filter((l) => l.appointment_time)
        .map((l) => l.appointment_time.getTime())
    );

    // Generate candidate slots
    const slots = [];
    let cursor = dayStartUk;

    const isCurrentUkDay = parsedDate.hasSame(todayUk, "day");
    const nowUk = todayUk;

    while (true) {
      // Skip slots that have already passed in UK time for the current day
      if (isCurrentUkDay && cursor < nowUk) {
        cursor = cursor.plus({ minutes: SLOT_INTERVAL_MINUTES });
        continue;
      }

      // Ensure the 30-min consult fits before end of day
      const consultEnd = cursor.plus({ minutes: 30 });
      if (consultEnd > dayEndUk) break;

      const slotUtc = cursor.toUTC();
      const slotMs = slotUtc.toJSDate().getTime();

      // If not booked, add to list
      if (!bookedTimesMs.has(slotMs)) {
        slots.push({
          start_utc: slotUtc.toISO(),
          start_uk_label: cursor.toFormat("HH:mm"),
        });
      }

      // Move by interval (30 + 10 buffer)
      cursor = cursor.plus({ minutes: SLOT_INTERVAL_MINUTES });
    }

    return res.json({
      date: dateStr,
      timezone: ZONE,
      slots,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch available slots" });
  }
}

/**
 * 🔹 Book an appointment for a specific lead
 * Route example: POST /api/leads/:id/book
 * Body: { appointmentTime: string (ISO), clientTimezone?: string }
 * appointmentTime is expected as an ISO string in UTC or local UK time.
 */
async function bookAppointment(req, res) {
  const leadId = req.params.id;
  const { appointmentTime, clientTimezone, contactMethod } = req.body;

  if (!appointmentTime) {
    return res
      .status(400)
      .json({ message: "appointmentTime (ISO) is required" });
  }

  try {
    const result = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (t) => {
        const lead = await Lead.findByPk(leadId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!lead) {
          return { status: 404, message: "Lead not found" };
        }

        if (!lead.email || !lead.phone) {
          return {
            status: 400,
            message:
              "A valid email and phone number are required before booking an appointment.",
          };
        }

        const normalizedForBooking = normalizePhoneNumber(
          lead.phone,
          lead.phone_country || DEFAULT_COUNTRY
        );

        if (!normalizedForBooking.e164) {
          return {
            status: 400,
            message:
              normalizedForBooking.error ||
              "Please double-check your mobile number before booking so we can send your reminders.",
          };
        }

        if (lead.phone !== normalizedForBooking.e164) {
          lead.phone = normalizedForBooking.e164;
          await lead.save({ transaction: t });
        }

        // Parse the appointmentTime (we'll treat it as ISO)
        const parsed = DateTime.fromISO(appointmentTime, {
          zone: "utc",
        });
        if (!parsed.isValid) {
          return { status: 400, message: "Invalid appointmentTime format" };
        }

        const slotDate = parsed.toJSDate();
        const takenStatuses = ["booked", "confirmed"];

        // Prevent duplicate active bookings for this person (email + phone)
        const activeExisting = await Lead.findOne({
          where: {
            email: lead.email,
            phone: lead.phone,
            appointment_time: { [Op.gt]: new Date() },
            appointment_status: { [Op.in]: takenStatuses },
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (activeExisting) {
          return {
            status: 409,
            message:
              "You already have an active appointment. You cannot book another until the previous one has passed.",
          };
        }

        // Lock any existing bookings for that slot to avoid race conditions
        const conflicting = await Lead.findOne({
          where: {
            appointment_time: slotDate,
            appointment_status: { [Op.in]: takenStatuses },
          },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (conflicting) {
          return {
            status: 409,
            message:
              "This time has just been booked. Please choose another.",
          };
        }

        // Store in UTC in DB
        lead.appointment_time = slotDate;
        lead.appointment_status = "booked";
        lead.client_timezone =
          clientTimezone || lead.client_timezone || "Europe/London";

        await lead.save({ transaction: t });

        const normalizedContactMethod =
          contactMethod && String(contactMethod).toLowerCase() === "whatsapp"
            ? "WhatsApp"
            : "Call";

        lead.preferred_contact_method = normalizedContactMethod;

        return { status: 200, lead, contactMethod: normalizedContactMethod };
      }
    );

    if (result?.status && result.status !== 200) {
      return res.status(result.status).json({ message: result.message });
    }

    if (!result?.lead) {
      return res.status(500).json({ message: "Failed to book appointment" });
    }

    const { lead, contactMethod: preferredContactMethod } = result;

    // Fire confirmation channels but don't block response
    sendBookingConfirmation(lead, {
      contactMethod: preferredContactMethod,
      clientTimezone,
    }).catch((err) => console.error("Booking email error:", err.message));

    sendAdminBookingNotification(lead, {
      contactMethod: preferredContactMethod,
      clientTimezone,
    }).catch((err) =>
      console.error("Booking admin email error:", err.message)
    );

    sendBookingConfirmationSms(lead, {
      contactMethod: preferredContactMethod,
    }).catch((err) => console.error("Booking SMS error:", err.message));

    return res.json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to book appointment" });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  getSummary,
  getAvailableSlots,
  bookAppointment,
};
