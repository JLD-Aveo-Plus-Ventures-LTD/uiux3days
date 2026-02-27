import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/api.js";
import { normalizePhoneNumber, loadCountries, DEFAULT_COUNTRY } from "../../utils/phone.js";
import "./styles/BookingForm.css";

const designStruggles = [
    "I don't know which tech skill is right for me",
    "I start learning but get confused and overwhelmed",
    "Too much theory and not enough practical guidance",
    "I'm scared it might not lead to a real job",
    "I struggle to stay consistent and finish what I start",
    "I can't afford to waste money on the wrong courses",
]
const interviewMethods = [
    "Normal Phone Call",
    "Video Call",
    "In-Person Meeting",
    "Email Correspondence",
];

const BookingForm = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        countryCode: DEFAULT_COUNTRY,
        mobileNumber: "",
        currentStatus: "Student",
        designStruggle: "My designs look amateur",
        interviewMethod: "Normal Phone Call",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // Load full country list once
    useEffect(() => {
        let mounted = true;
        loadCountries().then((list) => {
            if (mounted) setCountries(list || []);
        }).catch(() => { });
        return () => { mounted = false; };
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required";
        } else if (
            !/^\d{10,}$/.test(formData.mobileNumber.replace(/\s/g, ""))
        ) {
            newErrors.mobileNumber = "Please enter a valid mobile number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Selected country ISO (we store ISO codes in the select)
            const isoCode = formData.countryCode || DEFAULT_COUNTRY;

            // Normalize phone number
            const { e164: normalizedPhone, error: phoneError } = normalizePhoneNumber(
                formData.mobileNumber,
                isoCode
            );

            if (!normalizedPhone) {
                setSubmitStatus({
                    type: "error",
                    message: phoneError || "Please enter a valid phone number.",
                });
                setIsSubmitting(false);
                return;
            }

            // Map form fields to backend Lead model fields
            const payload = {
                full_name: formData.fullName,
                email: formData.email,
                phone: normalizedPhone,
                phone_country: formData.countryCode,
                service_type: formData.currentStatus,
                project_description: formData.designStruggle,
                preferred_contact_method: formData.interviewMethod,
            };

            const response = await fetch(`${API_BASE_URL}/leads`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                // Success - redirect to registration success page with leadId
                navigate(`/registration-success?leadId=${data.lead.id}`);
            } else {
                const errorData = await response.json();
                const errorMsg = errorData?.errors?.join(", ") || errorData?.message || "Submission failed";
                throw new Error(errorMsg);
            }
        } catch (error) {
            setSubmitStatus({
                type: "error",
                message: error.message || "Failed to submit booking. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="booking-form-container" id="booking-form">
            <div className="booking-form-card">
                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="fullName">
                            Full Name<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className={errors.fullName ? "error" : ""}
                        />
                        {errors.fullName && (
                            <span className="error-message">
                                {errors.fullName}
                            </span>
                        )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">
                            Email<span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="johndoe@domain.com"
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                            <span className="error-message">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                        <label htmlFor="mobileNumber">
                            Mobile Number<span className="required">*</span>
                        </label>
                        <div className="mobile-input-group">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleInputChange}
                                className="country-code-select "
                            >
                                {countries.length > 0
                                    ? countries.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.name} ({item.dialCode})
                                        </option>
                                    ))
                                    : null}
                            </select>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                placeholder="8455 3211 7199"
                                className={errors.mobileNumber ? "error" : ""}
                            />
                        </div>
                        {errors.mobileNumber && (
                            <span className="error-message">
                                {errors.mobileNumber}
                            </span>
                        )}
                        <p className="help-text">
                            Enter your mobile so we can send confirmations and
                            reminders. You can type it naturally (e.g. 07700
                            900123) and we will format it for you.
                        </p>
                    </div>

                    {/* Current Title or Status */}
                    <div className="form-group">
                        <label htmlFor="currentStatus">
                            Current Title or Status
                            <span className="required">*</span>
                        </label>
                        <select
                            id="currentStatus"
                            name="currentStatus"
                            value={formData.currentStatus}
                            onChange={handleInputChange}
                        >
                            <option value="Student">Student</option>
                            <option value="Professional">Professional</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Design Struggle */}
                    <div className="form-group">
                        <label htmlFor="designStruggle">
                            What's Your Biggest Struggle in Learning a Digital Skill?
                        </label>
                        <select
                            id="designStruggle"
                            name="designStruggle"
                            value={formData.designStruggle}
                            onChange={handleInputChange}
                        >
                            {designStruggles.map((struggle) => (
                                <option key={struggle} value={struggle}>
                                    {struggle}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Interview Method */}
                    <div className="form-group">
                        <label htmlFor="interviewMethod">
                            Preferred Interview Method
                        </label>
                        <select
                            id="interviewMethod"
                            name="interviewMethod"
                            value={formData.interviewMethod}
                            onChange={handleInputChange}
                        >
                            {interviewMethods.map((method) => (
                                <option key={method} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Status */}
                    {submitStatus && (
                        <div className={`submit-status ${submitStatus.type}`}>
                            {submitStatus.message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default BookingForm;
