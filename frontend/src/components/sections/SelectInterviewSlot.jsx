import { useEffect, useMemo, useState } from "react";
import { fetchSlots, bookLeadAppointment } from "../../services/api.js";
import { trackConsultationBooked } from "../../utils/tracking.js";
import "./styles/SelectInterviewSlot.css";

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

function SelectInterviewSlot({ leadId }) {
    const detectClientTimezone = useMemo(() => {
        try {
            return (
                Intl.DateTimeFormat().resolvedOptions().timeZone ||
                "Europe/London"
            );
        } catch (error) {
            console.error("Timezone detection failed", error);
            return "Europe/London";
        }
    }, []);

    const todayUk = useMemo(
        () => formatDateForZone(new Date(), "Europe/London"),
        [],
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
                setSlotsError(
                    "Unable to load available times. Please try again.",
                );
            } finally {
                setLoadingSlots(false);
            }
        }
        load();
    }, [date]);

    const handleSelectSlot = (slot) => {
        setBookingError("");
        setBookingSuccess(null);
        setSelectedSlot(slot);
    };

    const handleConfirmBookingClick = () => {
        if (!selectedSlot) return;
        setContactMethod("Call");
        setShowConfirm(true);
    };

    const handleBook = async () => {
        if (!selectedSlot) return;

        setBooking(true);
        setBookingError("");
        setBookingSuccess(null);

        try {
            await bookLeadAppointment(leadId, {
                appointmentTime: selectedSlot.start_utc,
                clientTimezone: deviceTimezone,
                contactMethod,
            });

            setBookingSuccess(selectedSlot);

            setSlots((prev) =>
                Array.isArray(prev)
                    ? prev.filter(
                          (slot) => slot.start_utc !== selectedSlot.start_utc,
                      )
                    : [],
            );

            trackConsultationBooked({
                leadId,
                appointmentTimeUtc: selectedSlot.start_utc,
            });

            setShowConfirm(false);
            setSelectedSlot(null);
        } catch (err) {
            console.error(err);
            let errorMessage =
                err?.message ||
                "Something went wrong while booking. Please try again.";
            if (err?.status === 409 && err?.message) {
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
        <section className="select-interview-section">
            <div
                className="container"
                style={{ display: "grid", gap: "24px", maxWidth: "900px" }}
            >
                {/* Section Title */}
                <div>
                    <h2 className="select-interview-title">
                        Final Step: Select Your Interview Date & Time
                    </h2>
                    <p className="select-interview-subtitle">
                        We have received your application! Since we only accept
                        15 students for the <br />
                        March 6-8 cohort, we need to have a quick 10-minute chat
                        to ensure you are a right fit.
                    </p>
                </div>

                {/* Date selector */}
                <div className="date-picker-container">
                    <label className="date-picker-label">Select a date:</label>
                    <input
                        type="date"
                        value={date}
                        min={todayUk}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="date-input"
                    />
                    <p className="date-helper-text">
                        Times adjust automatically to your local timezone (
                        {deviceTimezone}). Slots are shown between 08:00 and
                        18:00 UK time.
                    </p>
                </div>

                {/* Slot selector */}
                <div className="times-container">
                    <h3>Available times</h3>

                    {loadingSlots && <p>Loading times…</p>}
                    {slotsError && <p className="error-text">{slotsError}</p>}

                    {!loadingSlots && !slotsError && slots.length === 0 && (
                        <p>
                            No available times for this day. Try another date.
                        </p>
                    )}

                    {!loadingSlots && !slotsError && slots.length > 0 && (
                        <div className="times-grid">
                            {slots.map((slot) => {
                                const localTime = formatLocalTime(
                                    slot.start_utc,
                                );
                                const isSelected =
                                    selectedSlot?.start_utc === slot.start_utc;

                                return (
                                    <button
                                        key={slot.start_utc}
                                        type="button"
                                        onClick={() => handleSelectSlot(slot)}
                                        disabled={booking}
                                        className={`time-slot-button ${isSelected ? "selected" : ""}`}
                                    >
                                        {localTime}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Confirm Booking Button */}
                    {!loadingSlots && !slotsError && slots.length > 0 && (
                        <button
                            type="button"
                            onClick={handleConfirmBookingClick}
                            disabled={!selectedSlot || booking}
                            className="confirm-booking-button"
                        >
                            Confirm Booking
                        </button>
                    )}
                </div>

                {/* Booking error */}
                {bookingError && <p className="error-text">{bookingError}</p>}

                {/* Booking success */}
                {bookingSuccess && (
                    <div className="booking-success-card">
                        <h3>You're booked! 🎉</h3>
                        <p>
                            Your consultation is scheduled for{" "}
                            <strong>
                                {formatLocalTime(
                                    bookingSuccess.start_utc,
                                    true,
                                )}
                            </strong>
                            .
                        </p>
                        <p style={{ marginTop: "8px" }}>
                            Preferred contact method:{" "}
                            <strong>{contactMethod}</strong>
                        </p>
                        <p>
                            Please accept the calendar invite sent to your email
                            and keep an eye on your inbox for confirmation.
                        </p>
                    </div>
                )}
            </div>

            {/* Confirmation modal */}
            {showConfirm && selectedSlot && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-card">
                        <h3 style={{ marginTop: 0 }}>Confirm your booking</h3>
                        <p style={{ marginBottom: "8px" }}>
                            Selected time:{" "}
                            <strong>
                                {formatLocalTime(selectedSlot.start_utc, true)}
                            </strong>{" "}
                            ({detectClientTimezone})
                        </p>
                        <p className="modal-helper-text">
                            You can only have one active appointment at a time.
                            Please check this date and time before confirming.
                        </p>

                        <label htmlFor="contact-method" className="modal-label">
                            Preferred contact method
                        </label>
                        <select
                            id="contact-method"
                            value={contactMethod}
                            onChange={(e) => setContactMethod(e.target.value)}
                            className="modal-select"
                        >
                            <option value="Call">Call</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>

                        <div className="modal-buttons">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirm(false);
                                    setSelectedSlot(null);
                                }}
                                className="modal-button-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBook}
                                disabled={booking}
                                className="modal-button-confirm"
                            >
                                {booking ? "Booking…" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SelectInterviewSlot;
