// Base URL for your backend API
// Update this if your backend runs somewhere else.
const API_ROOT =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";
export const API_BASE_URL = `${API_ROOT}/api`;

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "string"
        ? data
        : data?.message || res.statusText)
      || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
}

// 🟦 PUBLIC – create a lead (landing page form)
export async function createLead(payload) {
  const res = await fetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res); // expected { lead: {...} }
}

// 🟦 ADMIN – fetch leads list
export async function fetchLeads(adminPassword, params = {}) {
  const url = new URL(`${API_BASE_URL}/leads`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url, {
    headers: {
      "x-admin-password": adminPassword,
    },
  });

  return handleResponse(res);
}

// 🟦 ADMIN – get single lead
export async function fetchLead(adminPassword, id) {
  const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
    headers: { "x-admin-password": adminPassword },
  });
  return handleResponse(res);
}

// 🟦 ADMIN – update lead
export async function updateLead(adminPassword, id, payload) {
  const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// 🟦 ADMIN – summary stats
export async function getStats(adminPassword) {
  const res = await fetch(`${API_BASE_URL}/stats/summary`, {
    headers: { "x-admin-password": adminPassword },
  });
  return handleResponse(res);
}

// ⭐ NEW: fetch available slots (PUBLIC, used by BookingPage)
export async function fetchSlots(date) {
  const params = new URLSearchParams();
  if (date) params.set("date", date);

  const res = await fetch(`${API_BASE_URL}/leads/slots?` + params.toString());
  return handleResponse(res); // { date, timezone, slots: [...] }
}

// ⭐ NEW: book appointment for a lead (PUBLIC, used by BookingPage)
export async function bookLeadAppointment(leadId, payload) {
  const res = await fetch(`${API_BASE_URL}/leads/${leadId}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res); // { lead }
}
