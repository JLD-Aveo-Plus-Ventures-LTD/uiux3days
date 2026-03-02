const { Op, Transaction } = require("sequelize");
const { DateTime } = require("luxon");
const Lead = require("../models/Lead");
const {
  sendAdminNotification,
  sendLeadConfirmation,
  sendBookingConfirmation,
  sendAdminBookingNotification,
  sendLeadRegistrationEmail,
} = require("../config/mail");
const {
  sendBookingConfirmationSms,
  sendLeadRegistrationSms,
} = require("../config/sms");
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

  const {
    e164,
    error: phoneError,
    country,
  } = normalizePhoneNumber(
    req.body.phone,
    req.body.phone_country || DEFAULT_COUNTRY,
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

    // Notify admin
    sendAdminNotification(lead).catch((err) =>
      console.error("Admin email error:", err.message),
    );

    // Notify lead via email and SMS
    sendLeadRegistrationEmail(lead).catch((err) =>
      console.error("Lead registration email error:", err.message),
    );
    sendLeadRegistrationSms(lead).catch((err) =>
      console.error("Lead registration SMS error:", err.message),
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
  const { status, appointment_status, search, start_date, end_date, page = 1, limit = 20 } = req.query;
  const where = {};

  if (status) where.status = status;
  if (appointment_status) where.appointment_status = appointment_status;
  if (search) {
    where[Op.or] = [
      { full_name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { service_type: { [Op.like]: `%${search}%` } },
    ];
  }

  // Date range filter (both dates optional)
  if (start_date || end_date) {
    where.createdAt = {};
    if (start_date) {
      where.createdAt[Op.gte] = new Date(start_date);
    }
    if (end_date) {
      // Add 1 day to end_date to include entire day
      const endDateObj = new Date(end_date);
      endDateObj.setDate(endDateObj.getDate() + 1);
      where.createdAt[Op.lt] = endDateObj;
    }
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
      const {
        e164,
        error: phoneError,
        country,
      } = normalizePhoneNumber(
        req.body.phone,
        req.body.phone_country || DEFAULT_COUNTRY,
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
      where: { createdAt: { [Op.gte]: oneWeekAgo } },
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
      }),
    );

    return res.json({ totalLeads, newThisWeek, byStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
}

/**
 * Leads series stats for dashboard chart
 * Route: GET /api/stats/leads-series?period=week|month|year&year=YYYY&month=1-12&tz=UTC
 */
async function getLeadsSeries(req, res) {
  try {
    const allowedPeriods = ["week", "month", "year"];
    const requestedPeriod = req.query.period;
    if (requestedPeriod && !allowedPeriods.includes(requestedPeriod)) {
      return res.status(400).json({
        message: "Invalid period. Use one of: week, month, year",
      });
    }
    const period = requestedPeriod || "week";

    const requestedZone = req.query.tz || "UTC";
    const zone = DateTime.now().setZone(requestedZone).isValid
      ? requestedZone
      : "UTC";

    const now = DateTime.now().setZone(zone);

    let rangeStart = now.startOf("day");
    let rangeEnd = now.endOf("day");
    let labels = [];
    let values = [];

    if (period === "week") {
      const startOfWeek = now
        .startOf("day")
        .minus({ days: now.weekday - 1 }); // Monday
      rangeStart = startOfWeek;
      rangeEnd = startOfWeek.plus({ days: 6 }).endOf("day");
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      values = new Array(7).fill(0);
    } else if (period === "month") {
      const year = Number(req.query.year) || now.year;
      const month = Number(req.query.month) || now.month;
      const targetMonth = DateTime.fromObject(
        { year, month, day: 1 },
        { zone },
      );

      if (!targetMonth.isValid) {
        return res
          .status(400)
          .json({ message: "Invalid year or month for period=month" });
      }

      rangeStart = targetMonth.startOf("month");
      rangeEnd = targetMonth.endOf("month");
      const totalDays = targetMonth.daysInMonth;
      labels = Array.from({ length: totalDays }, (_, idx) => String(idx + 1));
      values = new Array(totalDays).fill(0);
    } else {
      const year = Number(req.query.year) || now.year;
      const targetYear = DateTime.fromObject({ year, month: 1, day: 1 }, { zone });

      if (!targetYear.isValid) {
        return res.status(400).json({ message: "Invalid year for period=year" });
      }

      rangeStart = targetYear.startOf("year");
      rangeEnd = targetYear.endOf("year");
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      values = new Array(12).fill(0);
    }

    const rangeStartUtc = rangeStart.toUTC();
    const rangeEndUtc = rangeEnd.toUTC();

    const leads = await Lead.findAll({
      where: {
        createdAt: {
          [Op.between]: [rangeStartUtc.toJSDate(), rangeEndUtc.toJSDate()],
        },
      },
      attributes: ["createdAt"],
    });

    for (const lead of leads) {
      if (!lead.createdAt) continue;
      const leadDate = DateTime.fromJSDate(lead.createdAt, {
        zone: "utc",
      }).setZone(zone);

      if (period === "week") {
        const index = leadDate.weekday - 1; // Mon=1
        if (index >= 0 && index < values.length) values[index] += 1;
      } else if (period === "month") {
        const index = leadDate.day - 1;
        if (index >= 0 && index < values.length) values[index] += 1;
      } else {
        const index = leadDate.month - 1;
        if (index >= 0 && index < values.length) values[index] += 1;
      }
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    return res.json({
      period,
      timezone: zone,
      rangeStart: rangeStartUtc.toISO(),
      rangeEnd: rangeEndUtc.toISO(),
      labels,
      values,
      total,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch leads series" });
  }
}

/**
 * Get available slots for a given date (in UK time)
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
        .map((l) => l.appointment_time.getTime()),
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
 * Book an appointment for a specific lead
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
          lead.phone_country || DEFAULT_COUNTRY,
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
            message: "This time has just been booked. Please choose another.",
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
      },
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
    }).catch((err) => console.error("Booking admin email error:", err.message));

    sendBookingConfirmationSms(lead, {
      contactMethod: preferredContactMethod,
    }).catch((err) => console.error("Booking SMS error:", err.message));

    return res.json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to book appointment" });
  }
}

/**
 * Export leads as CSV
 * Route: GET /api/leads/export/csv?status=&appointment_status=&search=&start_date=&end_date=
 */
async function exportLeadsCsv(req, res) {
  try {
    const { status, appointment_status, search, start_date, end_date } = req.query;
    const where = {};

    if (status) where.status = status;
    if (appointment_status) where.appointment_status = appointment_status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { service_type: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Date range filter (both dates optional)
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        const endDateObj = new Date(end_date);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt[Op.lt] = endDateObj;
      }
    }

    const leads = await Lead.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'service_type',
        'status',
        'appointment_status',
        'appointment_time',
        'createdAt',
      ],
    });

    // Transform data for export
    const csvData = leads.map((lead) => ({
      'Lead ID': lead.id,
      'Name': lead.full_name,
      'Email': lead.email,
      'Phone': lead.phone,
      'Service': lead.service_type,
      'Status': lead.status,
      'Appointment Status': lead.appointment_status,
      'Appointment Time': lead.appointment_time
        ? new Date(lead.appointment_time).toLocaleString()
        : 'N/A',
      'Created': new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    }));

    const Papa = require('papaparse');
    const csv = Papa.unparse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`
    );
    res.send(csv);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to export CSV' });
  }
}

/**
 * Export leads as XLSX
 * Route: GET /api/leads/export/xlsx?status=&appointment_status=&search=&start_date=&end_date=
 */
async function exportLeadsXlsx(req, res) {
  try {
    const { status, appointment_status, search, start_date, end_date } = req.query;
    const where = {};

    if (status) where.status = status;
    if (appointment_status) where.appointment_status = appointment_status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { service_type: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Date range filter (both dates optional)
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        const endDateObj = new Date(end_date);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt[Op.lt] = endDateObj;
      }
    }

    const leads = await Lead.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'service_type',
        'status',
        'appointment_status',
        'appointment_time',
        'createdAt',
      ],
    });

    // Transform data for export
    const xlsxData = leads.map((lead) => {
      const formatDate = (dateVal) => {
        if (!dateVal) return 'N/A';
        try {
          const date = typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
          if (isNaN(date.getTime())) return 'N/A';
          return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        } catch (e) {
          return 'N/A';
        }
      };
      
      return {
        'Lead ID': lead.id,
        'Name': lead.full_name,
        'Email': lead.email,
        'Phone': lead.phone,
        'Service': lead.service_type,
        'Status': lead.status,
        'Appointment Status': lead.appointment_status,
        'Appointment Time': formatDate(lead.appointment_time),
        'Created': formatDate(lead.createdAt),
      };
    });

    const XLSX = require('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
    ];

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to export XLSX' });
  }
}

/**
 * Export leads as PDF with summary page
 * Route: GET /api/leads/export/pdf?status=&appointment_status=&search=&start_date=&end_date=
 */
async function exportLeadsPdf(req, res) {
  const startTime = Date.now();
  try {
    const { status, appointment_status, search, start_date, end_date } = req.query;
    console.log('[PDF Export] Request started', { status, appointment_status, search, start_date, end_date });
    
    const where = {};

    if (status) where.status = status;
    if (appointment_status) where.appointment_status = appointment_status;
    if (search) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { service_type: { [Op.like]: `%${search}%` } },
      ];
    }
    
    // Date range filter (both dates optional)
    if (start_date || end_date) {
      where.createdAt = {};
      if (start_date) {
        where.createdAt[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        const endDateObj = new Date(end_date);
        endDateObj.setDate(endDateObj.getDate() + 1);
        where.createdAt[Op.lt] = endDateObj;
      }
    }

    console.log('[PDF Export] Database query with filters:', where);
    
    const leads = await Lead.findAll({
      where,
      order: [["createdAt", "DESC"]],
      attributes: [
        'id',
        'full_name',
        'email',
        'phone',
        'service_type',
        'status',
        'appointment_status',
        'appointment_time',
        'createdAt',
      ],
    });

    console.log('[PDF Export] Found leads:', leads.length);

    // Calculate summary stats
    const totalLeads = leads.length;
    const statusBreakdown = {};
    const appointmentBreakdown = {};

    leads.forEach(lead => {
      statusBreakdown[lead.status] = (statusBreakdown[lead.status] || 0) + 1;
      appointmentBreakdown[lead.appointment_status] = (appointmentBreakdown[lead.appointment_status] || 0) + 1;
    });

    console.log('[PDF Export] Status breakdown:', statusBreakdown);
    console.log('[PDF Export] Appointment breakdown:', appointmentBreakdown);

    // Transform data for table (only: ID, Name, Email, Phone, Service, Appt Status, Created)
    const tableData = leads.map((lead) => [
      String(lead.id),
      lead.full_name || '',
      lead.email || '',
      lead.phone || '',
      lead.service_type || '',
      lead.appointment_status || '',
      lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A',
    ]);

    console.log('[PDF Export] Starting PDF generation...');
    
    // Use pdfmake with minimal styling for speed
    const pdfmake = require('pdfmake/build/pdfmake');
    const pdfFonts = require('pdfmake/build/vfs_fonts');
    pdfmake.vfs = pdfFonts.vfs;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Professional, well-styled document definition
    const docDefinition = {
      pageMargins: [40, 40, 40, 40],
      content: [
        // Header section
        {
          text: 'Lead Export Report',
          fontSize: 24,
          bold: true,
          color: '#1F2937',
          margin: [0, 0, 0, 8],
        },
        {
          text: `Generated on ${dateStr}`,
          fontSize: 10,
          color: '#6B7280',
          margin: [0, 0, 0, 20],
        },
        
        // Stats section
        {
          columns: [
            {
              text: [
                { text: 'Total Leads: ', bold: true, color: '#374151' },
                { text: String(totalLeads), fontSize: 14, bold: true, color: '#16A34A' },
              ],
              width: '50%',
            },
            {
              text: '',
              width: '50%',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Data table
        {
          table: {
            headerRows: 1,
            widths: ['7%', '16%', '22%', '13%', '16%', '14%', '16%'],
            body: [
              [
                { text: 'ID', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'center', padding: [8, 4] },
                { text: 'Name', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
                { text: 'Email', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
                { text: 'Phone', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
                { text: 'Service', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
                { text: 'Appt Status', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
                { text: 'Created', bold: true, fontSize: 11, color: '#FFFFFF', fillColor: '#1F2937', alignment: 'left', padding: [8, 4] },
              ],
              ...tableData.map((row, idx) => [
                { text: row[0], fontSize: 9, alignment: 'center', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[1], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[2], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[3], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[4], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[5], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
                { text: row[6], fontSize: 9, alignment: 'left', padding: [6, 4], fillColor: idx % 2 === 0 ? '#F9FAFB' : '#FFFFFF' },
              ]),
            ],
          },
          layout: {
            hLineWidth: (i) => i === 0 || i === 1 ? 2 : 0.5,
            vLineWidth: () => 0.5,
            hLineColor: (i) => i === 0 ? '#1F2937' : '#E5E7EB',
            vLineColor: () => '#E5E7EB',
            paddingLeft: () => 4,
            paddingRight: () => 4,
          },
          margin: [0, 0, 0, 0],
        },
      ],
      styles: {
        normal: {
          font: 'Helvetica',
        },
      },
    };

    const pdfDoc = pdfmake.createPdf(docDefinition);
    const fileName = `leads_${new Date().toISOString().split('T')[0]}.pdf`;

    console.log('[PDF Export] PDF object created, generating buffer...');

    // pdfmake@0.3.x getBuffer returns a Promise (callback form can hang)
    const generated = await pdfDoc.getBuffer();
    const buffer = Buffer.isBuffer(generated) ? generated : Buffer.from(generated);

    console.log('[PDF Export] Buffer generated successfully, size:', buffer.length, 'bytes');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);

    const duration = Date.now() - startTime;
    console.log('[PDF Export] ✅ Export successful', {
      fileName,
      totalLeads,
      bufferSize: buffer.length,
      durationMs: duration,
    });
    return;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[PDF Export] ❌ Export failed after', duration, 'ms:', error.message);
    console.error('[PDF Export] Full error:', error);
    return res.status(500).json({ message: 'Failed to export PDF' });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  getSummary,
  getLeadsSeries,
  getAvailableSlots,
  bookAppointment,
  exportLeadsCsv,
  exportLeadsXlsx,
  exportLeadsPdf,
};
