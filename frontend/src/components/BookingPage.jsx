import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchSlots, bookLeadAppointment } from "../services/api.js";
import { trackConsultationBooked } from "../utils/tracking.js";

function formatDateForZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function BookingPage() {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get("leadId");

  const detectClientTimezone = useMemo(() => {
    try {
      return (
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London"
      );
    } catch (error) {
      console.error("Timezone detection failed", error);
      return "Europe/London";
    }
  }, []);

  const todayUk = useMemo(
    () => formatDateForZone(new Date(), "Europe/London"),
    []
  );

  const [date, setDate] = useState(() => todayUk);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState("");

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contactMethod, setContactMethod] = useState("Call");

  const deviceTimezone = detectClientTimezone;

  // If leadId missing
  if (!leadId) {
    return (
      <main>
        <section style={{ padding: "40px 0" }}>
          <div className="container" style={{ maxWidth: "700px" }}>
            <h2>Booking not available</h2>
            <p>
              Your booking link is missing required details. Please go back and
              submit your project form again.
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Fetch available slots when date changes
  useEffect(() => {
    async function load() {
      setLoadingSlots(true);
      setSlotsError("");
      try {
        const data = await fetchSlots(date);
        setSlots(data.slots || []);
      } catch (err) {
        console.error(err);
        setSlotsError("Unable to load available times. Please try again.");
      } finally {
        setLoadingSlots(false);
      }
    }
    load();
  }, [date]);

  const handleSelectSlot = (slot) => {
    setBookingError("");
    setContactMethod("Call");
    setBookingSuccess(null);
    setSelectedSlot(slot);
    setShowConfirm(true);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;

    setBooking(true);
    setBookingError("");
    setBookingSuccess(null);

    try {
      await bookLeadAppointment(leadId, {
        appointmentTime: selectedSlot.start_utc, // ✅ use selectedSlot
        clientTimezone: deviceTimezone,
        contactMethod,
      });

      setBookingSuccess(selectedSlot); // ✅ store selectedSlot

      setSlots((prev) =>
        Array.isArray(prev)
          ? prev.filter((slot) => slot.start_utc !== selectedSlot.start_utc)
          : []
      );

      // tracking (safe no-op if you stub it)
      trackConsultationBooked({
        leadId,
        appointmentTimeUtc: selectedSlot.start_utc,
      });

      // hide modal after success
      setShowConfirm(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
      let errorMessage =
        err?.message || "Something went wrong while booking. Please try again.";
      if (err?.status === 409 && err?.message) {
        // e.g. 409 from backend "slot already taken" or "user already has a booking"
        errorMessage = err.message;
      }
      setBookingError(errorMessage);
      setShowConfirm(false);
      setSelectedSlot(null);
    } finally {
      setBooking(false);
    }
  };

  const formatLocalTime = (isoString, withDate = false) => {
    const options = withDate
      ? {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: detectClientTimezone,
          timeZoneName: "short",
        }
      : {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: detectClientTimezone,
          timeZoneName: "short",
        };

    return new Date(isoString).toLocaleString([], options);
  };

  const handleDateChange = (value) => {
    if (!value) return;

    const clampedValue = value < todayUk ? todayUk : value;
    setDate(clampedValue);
    setSelectedSlot(null);
    setBookingSuccess(null);
  };

  return (
    <main>
      <section style={{ background: "#f1f5f9", padding: "40px 0" }}>
        <div
          className="container"
          style={{ display: "grid", gap: "24px", maxWidth: "900px" }}
        >
          <div>
            <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>
              Choose a time for your consultation
            </h2>
            <p style={{ fontSize: "16px", color: "#475569" }}>
              Thanks for sharing your project details. Please select a suitable
              time below to book your consultation.
            </p>
          </div>

          {/* Video */}
          <div
            style={{
              background: "#000",
              height: "280px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Consultation intro"
              style={{ border: "none" }}
              allowFullScreen
            />
          </div>

          {/* Date selector */}
          <div
            className="card"
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              background: "#fff",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            >
              Select a date:
            </label>

            <input
              type="date"
              value={date}
              min={todayUk}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
              }}
            />

            <p style={{ fontSize: "13px", color: "#64748b", marginTop: "6px" }}>
              Times adjust automatically to your local timezone (
              {deviceTimezone}). Slots are shown between 08:00 and 18:00 UK
              time.
            </p>
          </div>

          {/* Slot selector */}
          <div className="card" style={{ padding: "16px" }}>
            <h3>Available times</h3>

            {loadingSlots && <p>Loading times…</p>}
            {slotsError && <p style={{ color: "red" }}>{slotsError}</p>}

            {!loadingSlots && !slotsError && slots.length === 0 && (
              <p>No available times for this day. Try another date.</p>
            )}

            {!loadingSlots && !slotsError && slots.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {slots.map((slot) => {
                  const localTime = formatLocalTime(slot.start_utc);

                  return (
                    <button
                      key={slot.start_utc}
                      type="button"
                      onClick={() => handleSelectSlot(slot)}
                      disabled={booking}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {localTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Booking result */}
          {bookingError && (
            <p style={{ color: "red", marginTop: "8px" }}>{bookingError}</p>
          )}

          {bookingSuccess && (
            <div
              className="card"
              style={{
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
              }}
            >
              <h3>You’re booked! 🎉</h3>
              <p>
                Your consultation is scheduled for{" "}
                <strong>
                  {formatLocalTime(bookingSuccess.start_utc, true)}
                </strong>
                .
              </p>
              <p style={{ marginTop: "8px" }}>
                Preferred contact method: <strong>{contactMethod}</strong>
              </p>
              <p>
                Please accept the calendar invite sent to your email and keep an
                eye on your inbox for confirmation.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation modal */}
      {showConfirm && selectedSlot && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Confirm your booking</h3>
            <p style={{ marginBottom: "8px" }}>
              Selected time:{" "}
              <strong>{formatLocalTime(selectedSlot.start_utc, true)}</strong> (
              {detectClientTimezone})
            </p>
            <p style={{ color: "#475569", fontSize: "14px" }}>
              You can only have one active appointment at a time. Please check
              this date and time before confirming.
            </p>

            <label
              htmlFor="contact-method"
              style={{ display: "block", fontWeight: 600, marginBottom: "6px" }}
            >
              Preferred contact method
            </label>
            <select
              id="contact-method"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                marginBottom: "14px",
              }}
            >
              <option value="Call">Call</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedSlot(null);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBook}
                disabled={booking}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0ea5e9",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {booking ? "Booking…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default BookingPage;
