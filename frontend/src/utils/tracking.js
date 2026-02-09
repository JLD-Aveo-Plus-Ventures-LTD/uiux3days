export function trackLeadSubmitted(lead) {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        email: lead?.email,
        service: lead?.service_type,
      });
    }
  } catch (error) {
    console.warn("FB tracking error (lead):", error.message);
  }

  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "lead_submitted", {
        lead_email: lead?.email,
        service_type: lead?.service_type,
      });
    }
  } catch (error) {
    console.warn("GA tracking error (lead):", error.message);
  }
}

export function trackConsultationBooked({ leadId, appointmentTimeUtc }) {
  try {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Schedule", {
        lead_id: leadId,
        appointment_time: appointmentTimeUtc,
      });
    }
  } catch (error) {
    console.warn("FB tracking error (booking):", error.message);
  }

  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "consultation_booked", {
        lead_id: leadId,
        appointment_time: appointmentTimeUtc,
        event_category: "booking",
        event_label: "consultation",
      });
    }
  } catch (error) {
    console.warn("GA tracking error (booking):", error.message);
  }
}
