const express = require("express");
const {
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
} = require("../controllers/leadController");
const adminAuth = require("../middleware/auth");

const router = express.Router();

// PUBLIC: create a lead (used by landing page form)
// POST /api/leads
router.post("/leads", createLead);

// PUBLIC: get available appointment slots for a given date
// GET /api/leads/slots?date=YYYY-MM-DD
router.get("/leads/slots", getAvailableSlots);

// PUBLIC: book an appointment for a specific lead
// POST /api/leads/:id/book
router.post("/leads/:id/book", bookAppointment);

// ADMIN: list leads
// GET /api/leads
router.get("/leads", adminAuth, getLeads);

// ADMIN: get single lead
// GET /api/leads/:id
router.get("/leads/:id", adminAuth, getLeadById);

// ADMIN: update lead
// PATCH /api/leads/:id
router.patch("/leads/:id", adminAuth, updateLead);

// ADMIN: summary stats
// GET /api/stats/summary
router.get("/stats/summary", adminAuth, getSummary);

// ADMIN: leads series chart stats
// GET /api/stats/leads-series?period=week|month|year&year=YYYY&month=1-12&tz=UTC
router.get("/stats/leads-series", adminAuth, getLeadsSeries);

// ADMIN: export leads as CSV
// GET /api/leads/export/csv?status=&appointment_status=&search=
router.get("/leads/export/csv", adminAuth, exportLeadsCsv);

// ADMIN: export leads as XLSX
// GET /api/leads/export/xlsx?status=&appointment_status=&search=
router.get("/leads/export/xlsx", adminAuth, exportLeadsXlsx);

// ADMIN: export leads as PDF with summary
// GET /api/leads/export/pdf?status=&appointment_status=&search=
router.get("/leads/export/pdf", adminAuth, exportLeadsPdf);

module.exports = router;
