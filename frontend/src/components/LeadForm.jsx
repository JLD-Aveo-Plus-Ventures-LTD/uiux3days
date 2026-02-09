import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from "../services/api.js";
import { trackLeadSubmitted } from "../utils/tracking.js";
import {
  DEFAULT_COUNTRY,
  FALLBACK_COUNTRIES,
  loadCountries,
  normalizePhoneNumber,
} from "../utils/phone.js";

const initialState = {
  full_name: "",
  email: "",
  phone: "",
  service_type: "Branding",
  budget_range: "",
  timeframe: "",
  project_description: "",
  source: "",
};

function LeadForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [localNumber, setLocalNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(DEFAULT_COUNTRY);
  const [countries, setCountries] = useState(FALLBACK_COUNTRIES);
  const [countryLoading, setCountryLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const hydrateCountries = async () => {
      try {
        setCountryLoading(true);
        const loaded = await loadCountries();
        if (!isCurrent) return;
        setCountries(loaded);
      } catch (err) {
        console.warn("Unable to load country list, falling back to defaults", err);
      } finally {
        if (isCurrent) setCountryLoading(false);
      }
    };

    hydrateCountries();

    return () => {
      isCurrent = false;
    };
  }, []);

  const preferredCountryCodes = useMemo(
    () => new Set(FALLBACK_COUNTRIES.map((c) => c.code)),
    []
  );

  const countryOptions = useMemo(() => {
    const preferred = countries.filter((c) => preferredCountryCodes.has(c.code));
    const others = countries.filter((c) => !preferredCountryCodes.has(c.code));
    return [...preferred, ...others];
  }, [countries, preferredCountryCodes]);

  const selectedCountry = useMemo(
    () => countryOptions.find((c) => c.code === phoneCountry) || countryOptions[0],
    [countryOptions, phoneCountry]
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.full_name || !form.email || !localNumber || !form.service_type) {
      setLoading(false);
      setError("Please fill in your name, email, and phone number to continue.");
      return;
    }

    const { e164, error: normalizeError, country } = normalizePhoneNumber(
      localNumber,
      phoneCountry
    );

    if (!e164) {
      setLoading(false);
      setPhoneError(
        normalizeError ||
          "Please enter a valid mobile number so we can send confirmations and reminders."
      );
      return;
    }

    try {
      const result = await createLead({
        ...form,
        phone: e164,
        phone_country: country?.code || phoneCountry,
      });
      const newLeadId = result?.lead?.id;

      if (!newLeadId) {
        console.error("No lead ID returned from API:", result);
        setError("Something went wrong. Please try again.");
        return;
      }

      trackLeadSubmitted(result.lead);
      setForm(initialState);
      setLocalNumber("");
      setPhoneCountry(DEFAULT_COUNTRY);
      setSuccess("Thanks! Redirecting you to booking...");
      navigate(`/booking?leadId=${newLeadId}`);
    } catch (err) {
      console.error(err);
      const friendlyError =
        err?.body?.message || err?.message || "Unable to submit right now. Please try again.";
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "grid", gap: "12px" }}>
        <div>
          <label>Full name*</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email*</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "4px" }}>Mobile number*</label>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "stretch",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <select
              value={phoneCountry}
              onChange={(e) => {
                const newCountry = e.target.value;
                setPhoneCountry(newCountry);
                setPhoneError("");
              }}
              style={{
                minWidth: "160px",
                flex: "1 1 220px",
                padding: "10px",
              }}
              disabled={countryLoading}
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.dialCode})
                </option>
              ))}
            </select>
            <div style={{ display: "flex", flex: 1, gap: "8px", alignItems: "center" }}>
              <span style={{ whiteSpace: "nowrap", color: "#334155" }}>
                {selectedCountry?.dialCode || "+"}
              </span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                pattern="[0-9+()\\s-]*"
                value={localNumber}
                onChange={(e) => {
                  setLocalNumber(e.target.value);
                  setPhoneError("");
                }}
                placeholder={
                  selectedCountry?.example ||
                  (selectedCountry?.code === "GB" ? "07700 900123" : "Enter your mobile number")
                }
                style={{
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                }}
                required
              />
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
            Enter your mobile so we can send confirmations and reminders. You can type it naturally
            (e.g. 07700 900123) and we will format it for you.
          </p>
          {phoneError && (
            <p style={{ color: "#dc2626", marginTop: "4px", fontSize: "13px" }}>{phoneError}</p>
          )}
        </div>

        <div>
          <label>Service type*</label>
          <select name="service_type" value={form.service_type} onChange={handleChange} required>
            <option>Branding</option>
            <option>Web Development</option>
            <option>UI/UX</option>
            <option>Data</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Budget range</label>
          <select name="budget_range" value={form.budget_range} onChange={handleChange}>
            <option value="">Select a budget</option>
            <option>{"<£500"}</option>
            <option>£500–£1500</option>
            <option>£1500–£5000</option>
            <option>{">£5000"}</option>
          </select>
        </div>

        <div>
          <label>Timeframe</label>
          <select name="timeframe" value={form.timeframe} onChange={handleChange}>
            <option value="">Select timeframe</option>
            <option>Immediately</option>
            <option>1–3 months</option>
            <option>3–6 months</option>
          </select>
        </div>

        <div>
          <label>Project description</label>
          <textarea
            name="project_description"
            rows="4"
            value={form.project_description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>How did you hear about us?</label>
          <input name="source" value={form.source} onChange={handleChange} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px",
          background: "#0ea5e9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: 600,
        }}
      >
        {loading ? "Submitting..." : "Continue to booking →"}
      </button>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LeadForm;
